package com.fintech.service;

import com.fintech.dto.AnalyticsDTO;
import com.fintech.dto.TransactionDTO;
import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionStatus;
import com.fintech.entity.TransactionType;
import com.fintech.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    public List<TransactionDTO> getAllTransactions() {
        log.debug("Fetching all transactions");
        return transactionRepository.findAllByOrderByTransactionDateDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        log.debug("Creating transaction: {}", dto.getTitle());
        Transaction transaction = Transaction.builder()
                .title(dto.getTitle())
                .description(dto.getDescription() != null ? dto.getDescription() : "")
                .amount(dto.getAmount())
                .type(dto.getType())
                .status(dto.getStatus() != null ? dto.getStatus() : TransactionStatus.COMPLETED)
                .category(dto.getCategory())
                .transactionDate(dto.getTransactionDate() != null ? dto.getTransactionDate() : LocalDateTime.now())
                .build();
        Transaction saved = transactionRepository.save(transaction);
        log.debug("Transaction created with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        log.debug("Deleting transaction with id: {}", id);
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
        log.debug("Transaction deleted with id: {}", id);
    }

    public AnalyticsDTO getAnalytics() {
        log.debug("Computing analytics");

        BigDecimal totalIncome = transactionRepository.sumByType(TransactionType.CREDIT);
        BigDecimal totalExpense = transactionRepository.sumByType(TransactionType.DEBIT);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        long totalTransactions = transactionRepository.count();

        // Category breakdown
        List<Object[]> categoryData = transactionRepository.findCategoryBreakdown();
        Map<String, BigDecimal> categoryBreakdown = new LinkedHashMap<>();
        for (Object[] row : categoryData) {
            categoryBreakdown.put((String) row[0], (BigDecimal) row[1]);
        }

        // Monthly trend (last 6 months)
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6).withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0);
        List<Object[]> trendData = transactionRepository.findMonthlyTrend(sixMonthsAgo);

        Map<String, AnalyticsDTO.MonthlyTrendDTO> trendMap = new LinkedHashMap<>();

        // Pre-populate last 6 months with zeros
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        for (int i = 5; i >= 0; i--) {
            String monthKey = LocalDateTime.now().minusMonths(i).format(formatter);
            trendMap.put(monthKey, AnalyticsDTO.MonthlyTrendDTO.builder()
                    .month(monthKey)
                    .income(BigDecimal.ZERO)
                    .expense(BigDecimal.ZERO)
                    .build());
        }

        for (Object[] row : trendData) {
            String month = (String) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal total = (BigDecimal) row[2];
            if (trendMap.containsKey(month)) {
                AnalyticsDTO.MonthlyTrendDTO trend = trendMap.get(month);
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
}
