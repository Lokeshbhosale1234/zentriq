package com.fintech.budget;

import com.fintech.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@Slf4j
public class BudgetController {

    private final BudgetService budgetService;

    // ── GET /api/budgets  (all budgets for current user) ──────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetDTOs.BudgetResponse>>> getAllBudgets() {
        try {
            return ResponseEntity.ok(ApiResponse.success(budgetService.getAllBudgets()));
        } catch (Exception e) {
            log.error("Error fetching budgets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch budgets: " + e.getMessage()));
        }
    }

    // ── GET /api/budgets/analytics?month=5&year=2025 ──────────────────────────
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<List<BudgetDTOs.BudgetAnalyticsResponse>>> getAnalytics(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        try {
            return ResponseEntity.ok(ApiResponse.success(budgetService.getBudgetAnalytics(month, year)));
        } catch (Exception e) {
            log.error("Error computing budget analytics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to compute budget analytics: " + e.getMessage()));
        }
    }

    // ── POST /api/budgets ──────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<BudgetDTOs.BudgetResponse>> createBudget(
            @Valid @RequestBody BudgetDTOs.BudgetRequest request) {
        try {
            BudgetDTOs.BudgetResponse created = budgetService.createBudget(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Budget created successfully", created));
        } catch (RuntimeException e) {
            log.warn("Budget creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create budget: " + e.getMessage()));
        }
    }

    // ── PUT /api/budgets/{id} ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetDTOs.BudgetResponse>> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetDTOs.BudgetRequest request) {
        try {
            BudgetDTOs.BudgetResponse updated = budgetService.updateBudget(id, request);
            return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", updated));
        } catch (RuntimeException e) {
            log.warn("Budget update failed for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating budget {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update budget: " + e.getMessage()));
        }
    }

    // ── DELETE /api/budgets/{id} ──────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable Long id) {
        try {
            budgetService.deleteBudget(id);
            return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
        } catch (RuntimeException e) {
            log.warn("Budget delete failed for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting budget {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete budget: " + e.getMessage()));
        }
    }
}
