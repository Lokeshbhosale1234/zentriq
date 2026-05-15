package com.fintech.insights.service;

import com.fintech.entity.Budget;
import com.fintech.budget.BudgetRepository;
import com.fintech.insights.dto.HealthScoreDTO;
import com.fintech.insights.dto.InsightDTO;
import com.fintech.insights.dto.InsightSummaryDTO;
import com.fintech.insights.engine.InsightEngine;
import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionType;
import com.fintech.repository.TransactionRepository;
import com.fintech.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * Service layer for AI financial insights.
 * Orchestrates data fetching, delegates computation to InsightEngine,
 * and assembles response DTOs.
 */
@Service
public class InsightService {

    private final InsightEngine engine;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public InsightService(InsightEngine engine,
                          TransactionRepository transactionRepository,
                          BudgetRepository budgetRepository) {
        this.engine = engine;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    /**
     * Returns a flat list of insights for the authenticated user.
     */
    public List<InsightDTO> getInsights(User user) {

        List<Transaction> transactions =
                transactionRepository.findByUserOrderByTransactionDateDesc(user);

        List<Budget> budgets =
                budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user);

        return engine.generateInsights(transactions, budgets);
    }

    /**
     * Returns the financial health score for the authenticated user.
     */
    public HealthScoreDTO getHealthScore(User user) {

        List<Transaction> transactions =
                transactionRepository.findByUserOrderByTransactionDateDesc(user);

        List<Budget> budgets =
                budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user);

        return engine.computeHealthScore(transactions, budgets);
    }

    /**
     * Returns a full summary including health score, all insights,
     * smart summary paragraph, and aggregate financial metrics.
     */
    public InsightSummaryDTO getSummary(User user) {

        List<Transaction> transactions =
                transactionRepository.findByUserOrderByTransactionDateDesc(user);

        List<Budget> budgets =
                budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user);

        YearMonth current = YearMonth.now();

        double income = sumIncomeForMonth(transactions, current);
        double expenses = sumExpensesForMonth(transactions, current);

        List<InsightDTO> insights =
                engine.generateInsights(transactions, budgets);

        HealthScoreDTO health =
                engine.computeHealthScore(transactions, budgets);

        String summary =
                engine.generateSmartSummary(insights, health, income, expenses);

        InsightSummaryDTO dto = new InsightSummaryDTO();

        dto.setHealthScore(health);
        dto.setInsights(insights);
        dto.setSmartSummary(summary);

        dto.setTotalIncome(round2(income));
        dto.setTotalExpenses(round2(expenses));
        dto.setNetSavings(round2(income - expenses));

        dto.setSavingsRate(
                income > 0
                        ? round2(((income - expenses) / income) * 100.0)
                        : 0.0
        );

        dto.setTopCategory(
                engine.topSpendingCategory(transactions)
        );

        dto.setFastestGrowingCategory(
                engine.fastestGrowingCategory(transactions)
        );

        return dto;
    }

    // ─────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────

    /**
     * Sums income transactions for the given month.
     */
    private double sumIncomeForMonth(
            List<Transaction> transactions,
            YearMonth month
    ) {

        return transactions.stream()

                .filter(t ->
                        t.getTransactionDate() != null
                                && inMonth(t.getTransactionDate(), month)
                )

                .filter(t ->
                        t.getType() == TransactionType.CREDIT
                )

                .mapToDouble(t ->
                        t.getAmount().doubleValue()
                )

                .sum();
    }

    /**
     * Sums expense transactions for the given month.
     */
    private double sumExpensesForMonth(
            List<Transaction> transactions,
            YearMonth month
    ) {

        return transactions.stream()

                .filter(t ->
                        t.getTransactionDate() != null
                                && inMonth(t.getTransactionDate(), month)
                )

                .filter(t ->
                        t.getType() == TransactionType.DEBIT
                )

                .mapToDouble(t ->
                        t.getAmount().doubleValue()
                )

                .sum();
    }

    /**
     * Checks if transaction belongs to the given month.
     */
    private boolean inMonth(
            LocalDateTime date,
            YearMonth month
    ) {

        return YearMonth.from(date).equals(month);
    }

    /**
     * Rounds to 2 decimal places.
     */
    private double round2(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}