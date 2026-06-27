package com.fintech.insights.engine;

import com.fintech.entity.Budget;
import com.fintech.entity.Transaction;
import com.fintech.insights.dto.HealthScoreDTO;
import com.fintech.insights.dto.InsightDTO;
import com.fintech.insights.model.InsightType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Rule-based analytical engine for financial insights.
 */
@Component
public class InsightEngine {

        // ─────────────────────────────────────────────────────────
        // SCORE WEIGHTS
        // ─────────────────────────────────────────────────────────

        private static final double SAVINGS_WEIGHT = 0.35;
        private static final double BUDGET_WEIGHT = 0.30;
        private static final double STABILITY_WEIGHT = 0.20;
        private static final double OVERSPEND_WEIGHT = 0.15;

        // ─────────────────────────────────────────────────────────
        // THRESHOLDS
        // ─────────────────────────────────────────────────────────

        private static final double OVERSPEND_THRESHOLD_PCT = 20.0;
        private static final double OVERSPEND_DANGER_PCT = 50.0;
        private static final double BUDGET_WARNING_UTILIZATION = 80.0;

        // ─────────────────────────────────────────────────────────
        // PUBLIC METHODS
        // ─────────────────────────────────────────────────────────

        public List<InsightDTO> generateInsights(
                        List<Transaction> transactions,
                        List<Budget> budgets) {

                if (transactions == null)
                        transactions = Collections.emptyList();
                if (budgets == null)
                        budgets = Collections.emptyList();

                YearMonth current = YearMonth.now();
                YearMonth previous = current.minusMonths(1);

                Map<String, Double> currentExp = expensesByCategory(transactions, current);

                Map<String, Double> previousExp = expensesByCategory(transactions, previous);

                List<InsightDTO> insights = new ArrayList<>();

                insights.addAll(
                                overspendingInsights(currentExp, previousExp));

                insights.addAll(
                                budgetWarnings(currentExp, budgets));

                insights.addAll(
                                savingsInsights(transactions, current));

                return insights;
        }

        public HealthScoreDTO computeHealthScore(
                        List<Transaction> transactions,
                        List<Budget> budgets) {

                if (transactions == null)
                        transactions = Collections.emptyList();
                if (budgets == null)
                        budgets = Collections.emptyList();

                YearMonth current = YearMonth.now();
                YearMonth previous = current.minusMonths(1);

                double income = totalIncome(transactions, current);
                double expenses = totalExpenses(transactions, current);

                double savingsRatio = income > 0
                                ? Math.max(0.0, (income - expenses) / income)
                                : 0.0;

                double budgetAdherence = budgetAdherenceScore(transactions, budgets, current);

                double spendingStability = stabilityScore(transactions, current, previous);

                double overspendPenalty = overspendingPenalty(transactions, budgets, current);

                double raw = (savingsRatio * 100.0 * SAVINGS_WEIGHT)
                                + (budgetAdherence * BUDGET_WEIGHT)
                                + (spendingStability * STABILITY_WEIGHT)
                                - (overspendPenalty * OVERSPEND_WEIGHT);

                int score = (int) Math.max(0, Math.min(100, raw));

                HealthScoreDTO dto = new HealthScoreDTO();

                dto.setScore(score);
                dto.setSavingsRatio(round2(savingsRatio * 100));
                dto.setBudgetAdherence(round2(budgetAdherence));
                dto.setSpendingStability(round2(spendingStability));
                dto.setOverspendingPenalty(round2(overspendPenalty));

                if (score >= 85) {
                        dto.setGrade("A");
                        dto.setLabel("Excellent");
                        dto.setColor("#10b981");
                } else if (score >= 70) {
                        dto.setGrade("B");
                        dto.setLabel("Good");
                        dto.setColor("#3b82f6");
                } else if (score >= 55) {
                        dto.setGrade("C");
                        dto.setLabel("Fair");
                        dto.setColor("#f59e0b");
                } else if (score >= 40) {
                        dto.setGrade("D");
                        dto.setLabel("Poor");
                        dto.setColor("#f97316");
                } else {
                        dto.setGrade("F");
                        dto.setLabel("Critical");
                        dto.setColor("#ef4444");
                }

                return dto;
        }

        public String generateSmartSummary(
                        List<InsightDTO> insights,
                        HealthScoreDTO score,
                        double income,
                        double expenses) {

                double savings = income - expenses;

                return String.format(
                                "Your health score is %d. Income ₹%.0f, expenses ₹%.0f, savings ₹%.0f.",
                                score.getScore(),
                                income,
                                expenses,
                                savings);
        }

        public String topSpendingCategory(List<Transaction> transactions) {

                if (transactions == null || transactions.isEmpty()) {
                        return "N/A";
                }

                YearMonth current = YearMonth.now();

                return expensesByCategory(transactions, current)
                                .entrySet()
                                .stream()
                                .max(Map.Entry.comparingByValue())
                                .map(Map.Entry::getKey)
                                .orElse("N/A");
        }

        public String fastestGrowingCategory(List<Transaction> transactions) {

                if (transactions == null || transactions.isEmpty()) {
                        return "N/A";
                }

                return "N/A";
        }

        // ─────────────────────────────────────────────────────────
        // INSIGHT GENERATORS
        // ─────────────────────────────────────────────────────────

        private List<InsightDTO> overspendingInsights(
                        Map<String, Double> current,
                        Map<String, Double> previous) {

                List<InsightDTO> out = new ArrayList<>();

                for (Map.Entry<String, Double> entry : current.entrySet()) {

                        String category = entry.getKey();

                        double currentValue = entry.getValue();

                        double previousValue = previous.getOrDefault(category, 0.0);

                        if (previousValue <= 0)
                                continue;

                        double percent = percentChange(previousValue, currentValue);

                        if (percent >= OVERSPEND_THRESHOLD_PCT) {

                                String severity = percent >= OVERSPEND_DANGER_PCT
                                                ? "danger"
                                                : "warning";

                                out.add(
                                                new InsightDTO(
                                                                InsightType.OVERSPENDING,
                                                                capitalize(category) + " Spending Increased",
                                                                String.format(
                                                                                "%s spending increased %.0f%% this month.",
                                                                                capitalize(category),
                                                                                percent),
                                                                severity,
                                                                category,
                                                                currentValue,
                                                                percent,
                                                                "up",
                                                                "📈"));
                        }
                }

                return out;
        }

        private List<InsightDTO> budgetWarnings(
                        Map<String, Double> current,
                        List<Budget> budgets) {

                List<InsightDTO> out = new ArrayList<>();

                for (Budget budget : budgets) {

                        if (budget.getLimitAmount() == null)
                                continue;

                        double limit = budget.getLimitAmount().doubleValue();

                        if (limit <= 0)
                                continue;

                        String category = budget.getCategory();

                        double spent = current.getOrDefault(
                                        category.toLowerCase(),
                                        0.0);

                        double utilization = (spent / limit) * 100.0;

                        if (utilization >= 100.0) {

                                out.add(
                                                new InsightDTO(
                                                                InsightType.BUDGET_WARNING,
                                                                category + " Budget Exceeded",
                                                                "Budget exceeded.",
                                                                "danger",
                                                                category,
                                                                spent,
                                                                utilization,
                                                                "up",
                                                                "🚨"));

                        } else if (utilization >= BUDGET_WARNING_UTILIZATION) {

                                out.add(
                                                new InsightDTO(
                                                                InsightType.BUDGET_WARNING,
                                                                category + " Budget Warning",
                                                                "Budget nearing limit.",
                                                                "warning",
                                                                category,
                                                                spent,
                                                                utilization,
                                                                "up",
                                                                "⚠️"));
                        }
                }

                return out;
        }

        private List<InsightDTO> savingsInsights(
                        List<Transaction> transactions,
                        YearMonth month) {

                List<InsightDTO> out = new ArrayList<>();

                double income = totalIncome(transactions, month);
                double expenses = totalExpenses(transactions, month);

                // If there is no income, don't generate savings insights
                if (income <= 0) {
                        return out;
                }

                double savings = income - expenses;
                double savingsRate = (savings / income) * 100.0;

                // Excellent saver
                if (savingsRate >= 30) {

                        out.add(new InsightDTO(
                                        InsightType.SAVINGS_SUGGESTION,
                                        "Excellent Savings Rate",
                                        String.format(
                                                        "You're saving %.0f%% of your income this month. Keep it up!",
                                                        savingsRate),
                                        "success",
                                        "Savings",
                                        savings,
                                        savingsRate,
                                        "up",
                                        "💰"));
                }

                // Poor savings
                else if (savingsRate < 10) {

                        out.add(new InsightDTO(
                                        InsightType.SAVINGS_SUGGESTION,
                                        "Low Savings Rate",
                                        String.format(
                                                        "You're only saving %.0f%% of your income. Try reducing unnecessary expenses.",
                                                        savingsRate),
                                        "warning",
                                        "Savings",
                                        savings,
                                        savingsRate,
                                        "down",
                                        "📉"));
                }

                return out;
        }

        // ─────────────────────────────────────────────────────────
        // SCORE HELPERS
        // ─────────────────────────────────────────────────────────

        private double budgetAdherenceScore(
                        List<Transaction> transactions,
                        List<Budget> budgets,
                        YearMonth month) {

                if (budgets.isEmpty())
                        return 70.0;

                Map<String, Double> expenses = expensesByCategory(transactions, month);

                long total = budgets.stream()
                                .filter(b -> b.getLimitAmount() != null)
                                .count();

                if (total == 0)
                        return 70.0;

                long adhering = budgets.stream()
                                .filter(b -> b.getLimitAmount() != null)
                                .filter(b -> {
                                        double spent = expenses.getOrDefault(
                                                        b.getCategory().toLowerCase(),
                                                        0.0);

                                        return spent <= b.getLimitAmount().doubleValue();
                                })
                                .count();

                return ((double) adhering / total) * 100.0;
        }

        private double stabilityScore(
                        List<Transaction> transactions,
                        YearMonth current,
                        YearMonth previous) {

                double currentExpenses = totalExpenses(transactions, current);

                double previousExpenses = totalExpenses(transactions, previous);

                if (previousExpenses <= 0)
                        return 70.0;

                double change = Math.abs(
                                percentChange(previousExpenses, currentExpenses));

                return Math.max(0, 100 - (change * 1.5));
        }

        private double overspendingPenalty(
                        List<Transaction> transactions,
                        List<Budget> budgets,
                        YearMonth month) {

                if (budgets.isEmpty())
                        return 0.0;

                Map<String, Double> expenses = expensesByCategory(transactions, month);

                OptionalDouble average = budgets.stream()
                                .filter(b -> b.getLimitAmount() != null)
                                .mapToDouble(b -> {

                                        double limit = b.getLimitAmount().doubleValue();

                                        double spent = expenses.getOrDefault(
                                                        b.getCategory().toLowerCase(),
                                                        0.0);

                                        double over = spent - limit;

                                        return over > 0
                                                        ? (over / limit) * 100.0
                                                        : 0.0;
                                })
                                .average();

                return average.orElse(0.0);
        }

        // ─────────────────────────────────────────────────────────
        // DATA HELPERS
        // ─────────────────────────────────────────────────────────

        private Map<String, Double> expensesByCategory(
                        List<Transaction> transactions,
                        YearMonth month) {

                return transactions.stream()
                                .filter(t -> isExpense(t) && inMonth(t, month))
                                .collect(
                                                Collectors.groupingBy(
                                                                t -> {
                                                                        String category = t.getCategory();

                                                                        return category == null
                                                                                        ? "uncategorized"
                                                                                        : category.toLowerCase();
                                                                },
                                                                Collectors.summingDouble(
                                                                                t -> t.getAmount()
                                                                                                .abs()
                                                                                                .doubleValue())));
        }

        private double totalIncome(
                        List<Transaction> transactions,
                        YearMonth month) {

                return transactions.stream()
                                .filter(t -> isIncome(t) && inMonth(t, month))
                                .mapToDouble(
                                                t -> t.getAmount()
                                                                .abs()
                                                                .doubleValue())
                                .sum();
        }

        private double totalExpenses(
                        List<Transaction> transactions,
                        YearMonth month) {

                return transactions.stream()
                                .filter(t -> isExpense(t) && inMonth(t, month))
                                .mapToDouble(
                                                t -> t.getAmount()
                                                                .abs()
                                                                .doubleValue())
                                .sum();
        }

        // ─────────────────────────────────────────────────────────
        // TRANSACTION TYPE HELPERS
        // ─────────────────────────────────────────────────────────

        private boolean isIncome(Transaction t) {

                if (t == null)
                        return false;

                if (t.getType() != null) {

                        String type = t.getType()
                                        .toString()
                                        .toUpperCase();

                        return type.equals("CREDIT")
                                        || type.equals("INCOME")
                                        || type.equals("DEPOSIT");
                }

                return t.getAmount()
                                .compareTo(BigDecimal.ZERO) > 0;
        }

        private boolean isExpense(Transaction t) {

                if (t == null)
                        return false;

                if (t.getType() != null) {

                        String type = t.getType()
                                        .toString()
                                        .toUpperCase();

                        return type.equals("DEBIT")
                                        || type.equals("EXPENSE")
                                        || type.equals("WITHDRAWAL");
                }

                return t.getAmount()
                                .compareTo(BigDecimal.ZERO) < 0;
        }

        // ─────────────────────────────────────────────────────────
        // DATE HELPERS
        // ─────────────────────────────────────────────────────────

        private boolean inMonth(Transaction t, YearMonth month) {

                if (t == null || t.getTransactionDate() == null) {
                        return false;
                }

                LocalDate date = t.getTransactionDate().toLocalDate();

                return YearMonth.from(date).equals(month);
        }

        // ─────────────────────────────────────────────────────────
        // UTILITIES
        // ─────────────────────────────────────────────────────────

        private double percentChange(double oldVal, double newVal) {

                if (oldVal == 0)
                        return 0.0;

                return ((newVal - oldVal) / oldVal) * 100.0;
        }

        private double round2(double value) {

                return Math.round(value * 100.0) / 100.0;
        }

        private String capitalize(String value) {

                if (value == null || value.isBlank()) {
                        return value;
                }

                return Character.toUpperCase(value.charAt(0))
                                + value.substring(1).toLowerCase();
        }
}