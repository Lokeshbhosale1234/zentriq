package com.fintech.insights.dto;

import java.util.List;

public class InsightSummaryDTO {

    private HealthScoreDTO healthScore;
    private List<InsightDTO> insights;
    private String smartSummary;
    private double totalIncome;
    private double totalExpenses;
    private double netSavings;
    private double savingsRate;
    private String topCategory;
    private String fastestGrowingCategory;

    public InsightSummaryDTO() {
    }

    public HealthScoreDTO getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(HealthScoreDTO healthScore) {
        this.healthScore = healthScore;
    }

    public List<InsightDTO> getInsights() {
        return insights;
    }

    public void setInsights(List<InsightDTO> insights) {
        this.insights = insights;
    }

    public String getSmartSummary() {
        return smartSummary;
    }

    public void setSmartSummary(String smartSummary) {
        this.smartSummary = smartSummary;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public double getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(double netSavings) {
        this.netSavings = netSavings;
    }

    public double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public String getFastestGrowingCategory() {
        return fastestGrowingCategory;
    }

    public void setFastestGrowingCategory(String fastestGrowingCategory) {
        this.fastestGrowingCategory = fastestGrowingCategory;
    }
}
