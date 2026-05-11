package com.fintech.budget;

import com.fintech.entity.Budget;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetService {

    private final BudgetRepository        budgetRepository;
    private final TransactionRepository   transactionRepository;
    private final SecurityUtils           securityUtils;

    // ── GET all budgets for current user ──────────────────────────────────────
    public List<BudgetDTOs.BudgetResponse> getAllBudgets() {
        User user = securityUtils.getCurrentUser();
        return budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── GET budgets for specific month/year ────────────────────────────────────
    public List<BudgetDTOs.BudgetResponse> getBudgetsByPeriod(Integer month, Integer year) {
        User user = securityUtils.getCurrentUser();
        return budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(user, month, year)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── GET budget analytics (budgets + spending) ─────────────────────────────
    public List<BudgetDTOs.BudgetAnalyticsResponse> getBudgetAnalytics(Integer month, Integer year) {
        User user = securityUtils.getCurrentUser();

        // Default to current month/year if not specified
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year  != null) ? year  : LocalDate.now().getYear();

        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(user, m, y);

        return budgets.stream().map(b -> {
            BigDecimal spent = transactionRepository
                    .sumSpentByUserCategoryAndPeriod(user, b.getCategory(), m, y);
            if (spent == null) spent = BigDecimal.ZERO;

            BigDecimal limit     = b.getLimitAmount();
            BigDecimal remaining = limit.subtract(spent);
            boolean exceeded     = spent.compareTo(limit) > 0;

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
        }).collect(Collectors.toList());
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
        log.info("Budget created: {} - {}/{} for user {}", saved.getCategory(), saved.getMonth(), saved.getYear(), user.getEmail());
        return toResponse(saved);
    }

    // ── UPDATE budget ─────────────────────────────────────────────────────────
    @Transactional
    public BudgetDTOs.BudgetResponse updateBudget(Long id, BudgetDTOs.BudgetRequest request) {
        User user = securityUtils.getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        // Check for duplicate on category change
        boolean categoryChanged = !budget.getCategory().equals(request.getCategory())
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
