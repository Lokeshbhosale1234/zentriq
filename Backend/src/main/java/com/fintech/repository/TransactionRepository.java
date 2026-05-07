package com.fintech.repository;

import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findAllByOrderByTransactionDateDesc();

    List<Transaction> findByUserEmailOrderByTransactionDateDesc(String email);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") TransactionType type);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'DEBIT' GROUP BY t.category")
    List<Object[]> findCategoryBreakdown();

    @Query("""
        SELECT FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m') as month,
               t.type,
               COALESCE(SUM(t.amount), 0) as total
        FROM Transaction t
        WHERE t.transactionDate >= :startDate
        GROUP BY FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m'), t.type
        ORDER BY month ASC
    """)
    List<Object[]> findMonthlyTrend(@Param("startDate") LocalDateTime startDate);
}
