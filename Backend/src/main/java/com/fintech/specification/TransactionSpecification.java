package com.fintech.specification;

import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionType;
import com.fintech.entity.User;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionSpecification {

        public static Specification<Transaction> filterTransactions(
                        User user,
                        String search,
                        String category,
                        TransactionType type,
                        LocalDateTime dateFrom,
                        LocalDateTime dateTo,
                        BigDecimal minAmount,
                        BigDecimal maxAmount) {

                return (root, query, cb) -> {

                        var predicate = cb.conjunction();

                        // Current user
                        predicate = cb.and(predicate,
                                        cb.equal(root.get("user"), user));

                        // Search title
                        if (search != null && !search.isBlank()) {
                                predicate = cb.and(
                                                predicate,
                                                cb.like(
                                                                cb.lower(root.get("title")),
                                                                "%" + search.toLowerCase() + "%"));
                        }

                        // Category
                        if (category != null && !category.isBlank()) {
                                predicate = cb.and(
                                                predicate,
                                                cb.equal(root.get("category"), category));
                        }

                        // Type
                        if (type != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.equal(root.get("type"), type));
                        }

                        // Date From
                        if (dateFrom != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("transactionDate"),
                                                                dateFrom));
                        }

                        // Date To
                        if (dateTo != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("transactionDate"),
                                                                dateTo));
                        }

                        // Minimum Amount
                        if (minAmount != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("amount"),
                                                                minAmount));
                        }

                        // Maximum Amount
                        if (maxAmount != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("amount"),
                                                                maxAmount));
                        }

                        query.orderBy(
                                        cb.desc(root.get("transactionDate")));

                        return predicate;
                };
        }
}