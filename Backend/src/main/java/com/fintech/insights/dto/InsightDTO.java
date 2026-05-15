package com.fintech.insights.dto;

import com.fintech.insights.model.InsightType;

public class InsightDTO {

    private InsightType type;
    private String title;
    private String message;
    private String severity;
    private String category;

    // Financial value
    private Double amount;

    // Percentage change
    private Double percentage;

    private String trend;
    private String icon;

    // Empty constructor
    public InsightDTO() {
    }

    // Full constructor
    public InsightDTO(
            InsightType type,
            String title,
            String message,
            String severity,
            String category,
            Double amount,
            Double percentage,
            String trend,
            String icon
    ) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
        this.trend = trend;
        this.icon = icon;
    }

    public InsightType getType() {
        return type;
    }

    public void setType(InsightType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}