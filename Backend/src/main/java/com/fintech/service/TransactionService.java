package com.fintech.service;

import com.fintech.dto.AnalyticsDTO;
import com.fintech.dto.TransactionDTO;
import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionStatus;
import com.fintech.entity.TransactionType;
import com.fintech.entity.User;
import com.fintech.repository.TransactionRepository;
import com.fintech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    // ─────────────────────────────────────────────────────────────────────────────
    // Get all transactions for logged-in user
    // ─────────────────────────────────────────────────────────────────────────────
    public List<TransactionDTO> getAllTransactions() {

        log.debug("Fetching all transactions");

        String email = getCurrentUserEmail();

        return transactionRepository
                .findByUserEmailOrderByTransactionDateDesc(email)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Search / Filter Transactions
    // ─────────────────────────────────────────────────────────────────────────────
    public List<TransactionDTO> searchTransactions(
            String search,
            String category,
            String type,
            LocalDateTime dateFrom,
            LocalDateTime dateTo,
            BigDecimal minAmount,
            BigDecimal maxAmount
    ) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TransactionType typeEnum = null;

        if (type != null && !type.isBlank()) {

            try {
                typeEnum = TransactionType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        String searchVal =
                (search != null && !search.isBlank())
                        ? search.trim()
                        : null;

        String categoryVal =
                (category != null && !category.isBlank())
                        ? category.trim()
                        : null;

        return transactionRepository
                .searchTransactions(
                        user,
                        searchVal,
                        categoryVal,
                        typeEnum,
                        dateFrom,
                        dateTo,
                        minAmount,
                        maxAmount
                )
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Create Transaction
    // ─────────────────────────────────────────────────────────────────────────────
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {

        log.debug("Creating transaction: {}", dto.getTitle());

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = Transaction.builder()
                .title(dto.getTitle())
                .description(dto.getDescription() != null
                        ? dto.getDescription()
                        : "")
                .amount(dto.getAmount())
                .type(dto.getType())
                .status(dto.getStatus() != null
                        ? dto.getStatus()
                        : TransactionStatus.COMPLETED)
                .category(dto.getCategory())
                .transactionDate(dto.getTransactionDate() != null
                        ? dto.getTransactionDate()
                        : LocalDateTime.now())
                .user(user)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        log.debug("Transaction created with id: {}", saved.getId());

        return toDTO(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Delete Transaction (ONLY owner can delete)
    // ─────────────────────────────────────────────────────────────────────────────
    @Transactional
    public void deleteTransaction(Long id) {

        log.debug("Deleting transaction with id: {}", id);

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Transaction not found with id: " + id
                        )
                );

        transactionRepository.delete(transaction);

        log.debug("Transaction deleted with id: {}", id);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Analytics
    // ─────────────────────────────────────────────────────────────────────────────
    public AnalyticsDTO getAnalytics() {

        log.debug("Computing analytics");

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal totalIncome =
                Optional.ofNullable(
                        transactionRepository.sumByUserAndType(
                                user,
                                TransactionType.CREDIT
                        )
                ).orElse(BigDecimal.ZERO);

        BigDecimal totalExpense =
                Optional.ofNullable(
                        transactionRepository.sumByUserAndType(
                                user,
                                TransactionType.DEBIT
                        )
                ).orElse(BigDecimal.ZERO);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        long totalTransactions =
                transactionRepository.countByUser(user);

        // ── Category Breakdown ────────────────────────────────────────────────

        List<Object[]> categoryData =
                transactionRepository.findCategoryBreakdownByUser(user);

        Map<String, BigDecimal> categoryBreakdown =
                new LinkedHashMap<>();

        for (Object[] row : categoryData) {

            categoryBreakdown.put(
                    (String) row[0],
                    (BigDecimal) row[1]
            );
        }

        // ── Monthly Trend ─────────────────────────────────────────────────────

        LocalDateTime sixMonthsAgo =
                LocalDateTime.now()
                        .minusMonths(6)
                        .withDayOfMonth(1)
                        .withHour(0)
                        .withMinute(0)
                        .withSecond(0);

        List<Object[]> trendData =
                transactionRepository.findMonthlyTrendByUser(
                        user,
                        sixMonthsAgo
                );

        Map<String, AnalyticsDTO.MonthlyTrendDTO> trendMap =
                new LinkedHashMap<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM");

        // Prepopulate last 6 months
        for (int i = 5; i >= 0; i--) {

            String monthKey =
                    LocalDateTime.now()
                            .minusMonths(i)
                            .format(formatter);

            trendMap.put(
                    monthKey,
                    AnalyticsDTO.MonthlyTrendDTO.builder()
                            .month(monthKey)
                            .income(BigDecimal.ZERO)
                            .expense(BigDecimal.ZERO)
                            .build()
            );
        }

        for (Object[] row : trendData) {

            String month = (String) row[0];

            TransactionType type =
                    (TransactionType) row[1];

            BigDecimal total =
                    (BigDecimal) row[2];

            if (trendMap.containsKey(month)) {

                AnalyticsDTO.MonthlyTrendDTO trend =
                        trendMap.get(month);

                if (type == TransactionType.CREDIT) {
                    trend.setIncome(total);
                } else {
                    trend.setExpense(total);
                }
            }
        }

        return AnalyticsDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .totalTransactions(totalTransactions)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrend(new ArrayList<>(trendMap.values()))
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DTO Mapper
    // ─────────────────────────────────────────────────────────────────────────────
    private TransactionDTO toDTO(Transaction t) {

        return TransactionDTO.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .category(t.getCategory())
                .transactionDate(t.getTransactionDate())
                .createdAt(t.getCreatedAt())
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Current Logged-in User Email
    // ─────────────────────────────────────────────────────────────────────────────
    private String getCurrentUserEmail() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }
}