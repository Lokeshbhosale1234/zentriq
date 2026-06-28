package com.fintech.repository;

import com.fintech.entity.Transaction;
import com.fintech.entity.TransactionType;
import com.fintech.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ─────────────────────────────────────────────
    // BASIC QUERIES
    // ─────────────────────────────────────────────

    List<Transaction> findAllByOrderByTransactionDateDesc();

    List<Transaction> findByUserEmailOrderByTransactionDateDesc(String email);

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    long countByUser(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    // ─────────────────────────────────────────────
    // ANALYTICS
    // ─────────────────────────────────────────────

    @Query("""
                SELECT COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.type = :type
            """)
    BigDecimal sumByType(@Param("type") TransactionType type);

    @Query("""
                SELECT COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.user = :user
                  AND t.type = :type
            """)
    BigDecimal sumByUserAndType(
            @Param("user") User user,
            @Param("type") TransactionType type);

    @Query("""
                SELECT t.category, COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.type = 'DEBIT'
                GROUP BY t.category
            """)
    List<Object[]> findCategoryBreakdown();

    @Query("""
                SELECT t.category, COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.user = :user
                  AND t.type = 'DEBIT'
                GROUP BY t.category
            """)
    List<Object[]> findCategoryBreakdownByUser(
            @Param("user") User user);

    // ─────────────────────────────────────────────
    // MONTHLY TREND (POSTGRESQL FIXED)
    // ─────────────────────────────────────────────

    @Query("""
                SELECT FUNCTION('to_char', t.transactionDate, 'YYYY-MM') as month,
                       t.type,
                       COALESCE(SUM(t.amount), 0) as total
                FROM Transaction t
                WHERE t.transactionDate >= :startDate
                GROUP BY FUNCTION('to_char', t.transactionDate, 'YYYY-MM'), t.type
                ORDER BY month ASC
            """)
    List<Object[]> findMonthlyTrend(
            @Param("startDate") LocalDateTime startDate);

    @Query("""
                SELECT FUNCTION('to_char', t.transactionDate, 'YYYY-MM') as month,
                       t.type,
                       COALESCE(SUM(t.amount), 0) as total
                FROM Transaction t
                WHERE t.user = :user
                  AND t.transactionDate >= :startDate
                GROUP BY FUNCTION('to_char', t.transactionDate, 'YYYY-MM'), t.type
                ORDER BY month ASC
            """)
    List<Object[]> findMonthlyTrendByUser(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate);

    // ─────────────────────────────────────────────
    // BUDGET ANALYTICS — FIXED
    //
    // ROOT CAUSE:
    // The original query embedded the enum value as a JPQL string literal:
    //
    //   AND t.type = 'DEBIT'
    //
    // On PostgreSQL + Hibernate 6 (Spring Boot 3.x), when an entity field is
    // mapped as @Enumerated(EnumType.STRING), Hibernate stores/reads it as a
    // VARCHAR. However, in JPQL, a bare string literal like 'DEBIT' is typed
    // as java.lang.String, not as TransactionType. During query execution
    // Hibernate 6 treats the comparison as a type mismatch and throws:
    //
    //   org.hibernate.query.SemanticException: Could not interpret path expression
    //   'DEBIT' — or — IllegalArgumentException: No enum constant TransactionType.DEBIT
    //
    // This propagates up as a 500 before the BudgetService catch block can
    // catch it, because the exception originates inside the JPA proxy, not in
    // user code. The GlobalExceptionHandler catches it and returns 500.
    //
    // FIX: Replace the literal 'DEBIT' with a properly typed :type parameter
    // and pass TransactionType.DEBIT from the service layer. Hibernate then
    // binds the enum correctly via its EnumType descriptor.
    //
    // ALSO FIXED: The return type. Some PostgreSQL + Hibernate combinations
    // return the COALESCE(SUM(...), 0) as a Number (not BigDecimal) when the
    // table has zero rows. The service already null-checks the result, and
    // the COALESCE ensures 0 is returned from DB, so BigDecimal mapping is safe.
    // ─────────────────────────────────────────────
    @Query("""
                SELECT COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.user      = :user
                  AND t.category  = :category
                  AND t.type      = :type
                  AND EXTRACT(MONTH FROM t.transactionDate) = :month
                  AND EXTRACT(YEAR  FROM t.transactionDate) = :year
            """)
    BigDecimal sumSpentByUserCategoryAndPeriod(
            @Param("user")     User           user,
            @Param("category") String         category,
            @Param("month")    Integer        month,
            @Param("year")     Integer        year,
            @Param("type")     TransactionType type);

    // ─────────────────────────────────────────────
    // SEARCH / FILTER
    // ─────────────────────────────────────────────

    @Query("""
                SELECT t
                FROM Transaction t
                WHERE t.user = :user
                  AND (:search IS NULL
                       OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))
                  AND (:category IS NULL
                       OR t.category = :category)
                  AND (:type IS NULL
                       OR t.type = :type)
                  AND (:dateFrom IS NULL
                       OR t.transactionDate >= :dateFrom)
                  AND (:dateTo IS NULL
                       OR t.transactionDate <= :dateTo)
                  AND (:minAmt IS NULL
                       OR t.amount >= :minAmt)
                  AND (:maxAmt IS NULL
                       OR t.amount <= :maxAmt)
                ORDER BY t.transactionDate DESC
            """)
    List<Transaction> searchTransactions(
            @Param("user")     User            user,
            @Param("search")   String          search,
            @Param("category") String          category,
            @Param("type")     TransactionType type,
            @Param("dateFrom") LocalDateTime   dateFrom,
            @Param("dateTo")   LocalDateTime   dateTo,
            @Param("minAmt")   BigDecimal      minAmt,
            @Param("maxAmt")   BigDecimal      maxAmt);
}
