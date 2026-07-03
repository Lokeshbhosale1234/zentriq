package com.fintech.controller;

import com.fintech.dto.AnalyticsDTO;
import com.fintech.dto.ApiResponse;
import com.fintech.dto.TransactionDTO;
import com.fintech.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TransactionController {

        private final TransactionService transactionService;

        // GET /api/transactions
        @GetMapping
        public ResponseEntity<ApiResponse<List<TransactionDTO>>> getAllTransactions(
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) String category,
                        @RequestParam(required = false) String type,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,

                        @RequestParam(required = false) BigDecimal minAmount,
                        @RequestParam(required = false) BigDecimal maxAmount) {

                try {

                        List<TransactionDTO> transactions;

                        boolean hasFilters = (search != null && !search.isBlank()) ||
                                        (category != null && !category.isBlank()) ||
                                        (type != null && !type.isBlank()) ||
                                        dateFrom != null ||
                                        dateTo != null ||
                                        minAmount != null ||
                                        maxAmount != null;

                        if (hasFilters) {

                                transactions = transactionService.searchTransactions(
                                                search,
                                                category,
                                                type,
                                                dateFrom,
                                                dateTo,
                                                minAmount,
                                                maxAmount);

                        } else {

                                transactions = transactionService.getAllTransactions();
                        }

                        return ResponseEntity.ok(ApiResponse.success(transactions));

                } catch (Exception e) {

                        log.error("Error fetching transactions", e);

                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error(
                                                        "Failed to fetch transactions: " + e.getMessage()));
                }
        }

        // POST /api/transactions
        @PostMapping
        public ResponseEntity<ApiResponse<TransactionDTO>> createTransaction(
                        @Valid @RequestBody TransactionDTO transactionDTO) {

                try {

                        TransactionDTO created = transactionService.createTransaction(transactionDTO);

                        return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(ApiResponse.success(
                                                        "Transaction created successfully",
                                                        created));

                } catch (Exception e) {

                        log.error("Error creating transaction", e);

                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error(
                                                        "Failed to create transaction: " + e.getMessage()));
                }
        }

        // DELETE /api/transactions/{id}
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteTransaction(
                        @PathVariable Long id) {

                try {

                        transactionService.deleteTransaction(id);

                        return ResponseEntity.ok(
                                        ApiResponse.success(
                                                        "Transaction deleted successfully",
                                                        null));

                } catch (RuntimeException e) {

                        log.error("Delete transaction {} failed: {}", id, e.getMessage());

                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(ApiResponse.error(e.getMessage()));

                } catch (Exception e) {

                        log.error("Error deleting transaction {}", id, e);

                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error(
                                                        "Failed to delete transaction: " + e.getMessage()));
                }
        }

        // GET /api/transactions/analytics
        @GetMapping("/analytics")
        public ResponseEntity<ApiResponse<AnalyticsDTO>> getAnalytics() {

                try {

                        AnalyticsDTO analytics = transactionService.getAnalytics();

                        return ResponseEntity.ok(
                                        ApiResponse.success(analytics));

                } catch (Exception e) {

                        log.error("Error computing analytics", e);

                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(ApiResponse.error(
                                                        "Failed to compute analytics: " + e.getMessage()));
                }
        }
}