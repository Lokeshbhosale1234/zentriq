package com.fintech.budget;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BudgetDTOs {

    // ── CREATE / UPDATE request ───────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BudgetRequest {

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Limit amount is required")
        @DecimalMin(value = "1.0", message = "Limit must be at least 1")
        private BigDecimal limitAmount;

        @NotNull(message = "Month is required")
        @Min(value = 1,  message = "Month must be between 1 and 12")
        @Max(value = 12, message = "Month must be between 1 and 12")
        private Integer month;

        @NotNull(message = "Year is required")
        @Min(value = 2000, message = "Year must be 2000 or later")
        private Integer year;
    }

    // ── Basic budget response ─────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BudgetResponse {
        private Long        id;
        private String      category;
        private BigDecimal  limitAmount;
        private Integer     month;
        private Integer     year;
        private LocalDateTime createdAt;
    }

    // ── Budget with spending analytics ────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BudgetAnalyticsResponse {
        private Long        id;
        private String      category;
        private BigDecimal  limitAmount;
        private BigDecimal  spent;
        private BigDecimal  remaining;
        private double      percentageUsed;
        private boolean     exceeded;
        private Integer     month;
        private Integer     year;
    }
}
