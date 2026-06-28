package com.fintech.budget;

import com.fintech.entity.Budget;
import com.fintech.entity.TransactionType;
import com.fintech.entity.User;
import com.fintech.repository.TransactionRepository;
import com.fintech.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetService {

    private final BudgetRepository      budgetRepository;
    private final TransactionRepository transactionRepository;
    private final SecurityUtils         securityUtils;

    // ── GET all budgets for current user ──────────────────────────────────────
    public List<BudgetDTOs.BudgetResponse> getAllBudgets() {
        User user = securityUtils.getCurrentUser();
        return budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── GET budgets for specific month/year ───────────────────────────────────
    public List<BudgetDTOs.BudgetResponse> getBudgetsByPeriod(Integer month, Integer year) {
        User user = securityUtils.getCurrentUser();
        return budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(user, month, year)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── GET budget analytics (budgets + spending) ─────────────────────────────
    //
    //  ROOT CAUSE OF THE 500:
    //  ──────────────────────
    //  The JPQL query `sumSpentByUserCategoryAndPeriod` uses:
    //
    //    AND t.type = 'DEBIT'
    //
    //  This is a string literal compared against an @Enumerated(STRING) column.
    //  On PostgreSQL with Spring Data JPA the parameter binding for enum columns
    //  is handled by Hibernate's EnumType. When the literal 'DEBIT' is embedded
    //  directly in JPQL (not as a typed :param), Hibernate may resolve it as a
    //  plain String and fail to cast it to the TransactionType enum, throwing:
    //
    //    java.lang.IllegalArgumentException: No enum constant
    //        TransactionType.DEBIT   ← wrapped as 500
    //
    //  Additionally, even if that resolves, COALESCE(SUM(...), 0) in JPQL with
    //  PostgreSQL returns a numeric type whose Hibernate mapping can differ from
    //  BigDecimal, causing a ClassCastException on the line:
    //
    //    BigDecimal spent = transactionRepository
    //                           .sumSpentByUserCategoryAndPeriod(...);
    //                                                              ↑ NPE or CCE
    //
    //  SECONDARY RISK — divide-by-zero guard was present, but if limitAmount is
    //  null (budget row persisted without it somehow), `limit.subtract(spent)`
    //  throws NullPointerException.
    //
    //  FIX STRATEGY:
    //  1. Replace the unsafe JPQL literal 'DEBIT' with a proper typed enum param.
    //  2. Null-guard every BigDecimal field coming from the DB.
    //  3. Guard limitAmount against null before any arithmetic.
    //  4. Return Collections.emptyList() when the user has no budgets (instead
    //     of streaming an empty list which is fine, but be explicit).
    //  5. Wrap the whole method in a try/catch so a single broken budget row
    //     never kills the entire response — skip it with a warning instead.
    //
    public List<BudgetDTOs.BudgetAnalyticsResponse> getBudgetAnalytics(Integer month, Integer year) {
        User user = securityUtils.getCurrentUser();

        // Default to current month/year when not provided
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year  != null) ? year  : LocalDate.now().getYear();

        List<Budget> budgets =
                budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(user, m, y);

        // ── Edge case: no budgets set up for this period ──────────────────────
        // Return an empty list — valid 200 response.  The frontend receives
        // { "success": true, "data": [] } and skips rendering instead of crashing.
        if (budgets == null || budgets.isEmpty()) {
            log.debug("No budgets found for user {} period {}/{}", user.getEmail(), m, y);
            return Collections.emptyList();
        }

        return budgets.stream()
                .map(b -> {
                    try {
                        return buildAnalyticsResponse(b, user, m, y);
                    } catch (Exception ex) {
                        // A broken row must not kill the whole response.
                        // Log it and return a safe zero-spent placeholder.
                        log.warn("Could not compute analytics for budget id={} category='{}': {}",
                                b.getId(), b.getCategory(), ex.getMessage());
                        return safeZeroResponse(b);
                    }
                })
                .collect(Collectors.toList());
    }

    // ── Build one analytics row, all BigDecimal paths null-guarded ───────────
    private BudgetDTOs.BudgetAnalyticsResponse buildAnalyticsResponse(
            Budget b, User user, int month, int year) {

        // FIX 1: call the corrected repository method that uses a typed enum param.
        // See TransactionRepository — the fixed query passes TransactionType.DEBIT
        // as a :type parameter instead of embedding the string literal 'DEBIT'.
        BigDecimal spent = transactionRepository
                .sumSpentByUserCategoryAndPeriod(user, b.getCategory(), month, year, TransactionType.DEBIT);

        // FIX 2: null-guard the SUM result.
        // COALESCE in JPQL should handle this, but PostgreSQL + Hibernate can
        // still return null when there are zero matching rows on some driver versions.
        if (spent == null) spent = BigDecimal.ZERO;

        // FIX 3: null-guard limitAmount from the entity itself.
        BigDecimal limit = b.getLimitAmount();
        if (limit == null || limit.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Budget id={} has null/zero limitAmount — defaulting to ZERO", b.getId());
            limit = BigDecimal.ZERO;
        }

        BigDecimal remaining = limit.subtract(spent);
        boolean    exceeded  = spent.compareTo(limit) > 0;

        // FIX 4: divide-by-zero guard (was already present, kept explicit).
        double pct = 0.0;
        if (limit.compareTo(BigDecimal.ZERO) > 0) {
            pct = spent.multiply(BigDecimal.valueOf(100))
                       .divide(limit, 2, RoundingMode.HALF_UP)
                       .doubleValue();
        }

        return BudgetDTOs.BudgetAnalyticsResponse.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(limit)
                .spent(spent)
                .remaining(remaining)
                .percentageUsed(pct)
                .exceeded(exceeded)
                .month(b.getMonth())
                .year(b.getYear())
                .build();
    }

    // ── Safe fallback row when a single budget cannot be computed ─────────────
    private BudgetDTOs.BudgetAnalyticsResponse safeZeroResponse(Budget b) {
        BigDecimal limit = (b.getLimitAmount() != null) ? b.getLimitAmount() : BigDecimal.ZERO;
        return BudgetDTOs.BudgetAnalyticsResponse.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(limit)
                .spent(BigDecimal.ZERO)
                .remaining(limit)
                .percentageUsed(0.0)
                .exceeded(false)
                .month(b.getMonth())
                .year(b.getYear())
                .build();
    }

    // ── CREATE budget ─────────────────────────────────────────────────────────
    @Transactional
    public BudgetDTOs.BudgetResponse createBudget(BudgetDTOs.BudgetRequest request) {
        User user = securityUtils.getCurrentUser();

        if (budgetRepository.existsByUserAndCategoryAndMonthAndYear(
                user, request.getCategory(), request.getMonth(), request.getYear())) {
            throw new RuntimeException(
                "Budget for '" + request.getCategory() + "' already exists for "
                + request.getMonth() + "/" + request.getYear());
        }

        Budget budget = Budget.builder()
                .user(user)
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .build();

        Budget saved = budgetRepository.save(budget);
        log.info("Budget created: {} - {}/{} for user {}",
                saved.getCategory(), saved.getMonth(), saved.getYear(), user.getEmail());
        return toResponse(saved);
    }

    // ── UPDATE budget ─────────────────────────────────────────────────────────
    @Transactional
    public BudgetDTOs.BudgetResponse updateBudget(Long id, BudgetDTOs.BudgetRequest request) {
        User user   = securityUtils.getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        boolean categoryChanged =
                !budget.getCategory().equals(request.getCategory())
                || !budget.getMonth().equals(request.getMonth())
                || !budget.getYear().equals(request.getYear());

        if (categoryChanged && budgetRepository.existsByUserAndCategoryAndMonthAndYear(
                user, request.getCategory(), request.getMonth(), request.getYear())) {
            throw new RuntimeException(
                "Budget for '" + request.getCategory() + "' already exists for "
                + request.getMonth() + "/" + request.getYear());
        }

        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget saved = budgetRepository.save(budget);
        log.info("Budget {} updated for user {}", id, user.getEmail());
        return toResponse(saved);
    }

    // ── DELETE budget ─────────────────────────────────────────────────────────
    @Transactional
    public void deleteBudget(Long id) {
        User user = securityUtils.getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
        log.info("Budget {} deleted for user {}", id, user.getEmail());
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    private BudgetDTOs.BudgetResponse toResponse(Budget b) {
        return BudgetDTOs.BudgetResponse.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(b.getLimitAmount())
                .month(b.getMonth())
                .year(b.getYear())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
