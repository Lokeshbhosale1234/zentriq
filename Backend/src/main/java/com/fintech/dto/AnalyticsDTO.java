package com.fintech.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private long totalTransactions;
    private Map<String, BigDecimal> categoryBreakdown;
    private List<MonthlyTrendDTO> monthlyTrend;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrendDTO {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;
    }
}
