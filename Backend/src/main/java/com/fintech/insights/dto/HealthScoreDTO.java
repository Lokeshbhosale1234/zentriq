package com.fintech.insights.dto;

public class HealthScoreDTO {

    private int score;
    private String grade;
    private String label;
    private double savingsRatio;
    private double budgetAdherence;
    private double spendingStability;
    private double overspendingPenalty;
    private String color;

    public HealthScoreDTO() {
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getSavingsRatio() {
        return savingsRatio;
    }

    public void setSavingsRatio(double savingsRatio) {
        this.savingsRatio = savingsRatio;
    }

    public double getBudgetAdherence() {
        return budgetAdherence;
    }

    public void setBudgetAdherence(double budgetAdherence) {
        this.budgetAdherence = budgetAdherence;
    }

    public double getSpendingStability() {
        return spendingStability;
    }

    public void setSpendingStability(double spendingStability) {
        this.spendingStability = spendingStability;
    }

    public double getOverspendingPenalty() {
        return overspendingPenalty;
    }

    public void setOverspendingPenalty(double overspendingPenalty) {
        this.overspendingPenalty = overspendingPenalty;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
