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

    // ── Basic queries ─────────────────────────────────────────────────────────

    List<Transaction> findAllByOrderByTransactionDateDesc();

    List<Transaction> findByUserEmailOrderByTransactionDateDesc(String email);

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    long countByUser(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    // ── Type sums ─────────────────────────────────────────────────────────────

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

    // ── Category breakdown ────────────────────────────────────────────────────
    //
    //  FIX: replaced string literal 'DEBIT' with typed :type parameter.
    //
    //  BROKEN (original):
    //    AND t.type = 'DEBIT'
    //  The literal 'DEBIT' is typed as java.lang.String in JPQL.
    //  Hibernate 6 (Spring Boot 3.x) enforces strict type-safety: it cannot
    //  compare a TransactionType enum column against a plain String literal
    //  without an explicit cast. This throws:
    //    org.hibernate.query.SemanticException
    //    (wrapped as InvalidDataAccessResourceUsageException → HTTP 500)
    //
    //  FIXED: pass TransactionType.DEBIT as a :type parameter so Hibernate
    //  binds it correctly via EnumType.
    //
    @Query("""
                SELECT t.category, COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.type = :type
                GROUP BY t.category
            """)
    List<Object[]> findCategoryBreakdown(
            @Param("type") TransactionType type);

    @Query("""
                SELECT t.category, COALESCE(SUM(t.amount), 0)
                FROM Transaction t
                WHERE t.user = :user
                  AND t.type = :type
                GROUP BY t.category
            """)
    List<Object[]> findCategoryBreakdownByUser(
            @Param("user") User user,
            @Param("type") TransactionType type);

    // ── Monthly trend ─────────────────────────────────────────────────────────

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

    // ── Budget analytics ──────────────────────────────────────────────────────

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
            @Param("user")     User            user,
            @Param("category") String          category,
            @Param("month")    Integer         month,
            @Param("year")     Integer         year,
            @Param("type")     TransactionType type);

    // ── Search / filter ───────────────────────────────────────────────────────

    // FIX: nativeQuery with PostgreSQL :: cast operators.
    // JPQL fails on null typed params (BigDecimal/enum/LocalDateTime) because
    // PostgreSQL prepared statements need the type of every param including nulls.
    // ::numeric, ::text, ::timestamp tell PostgreSQL the type even when value is null.
    // User changed to userId (Long) because native queries can't traverse JPA relations.
    // TransactionType changed to typeStr (String) — pass the enum name e.g. "DEBIT".
    @Query(value = """
                SELECT t.* FROM transactions t
                WHERE t.user_id = :userId
                  AND (:search::text     IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search::text, '%')))
                  AND (:category::text   IS NULL OR t.category = :category::text)
                  AND (:typeStr::text    IS NULL OR t.type = :typeStr::text)
                  AND (:dateFrom::timestamp IS NULL OR t.transaction_date >= :dateFrom::timestamp)
                  AND (:dateTo::timestamp   IS NULL OR t.transaction_date <= :dateTo::timestamp)
                  AND (:minAmt::numeric  IS NULL OR t.amount >= :minAmt::numeric)
                  AND (:maxAmt::numeric  IS NULL OR t.amount <= :maxAmt::numeric)
                ORDER BY t.transaction_date DESC
            """, nativeQuery = true)
    List<Transaction> searchTransactions(
            @Param("userId")   Long   userId,
            @Param("search")   String search,
            @Param("category") String category,
            @Param("typeStr")  String typeStr,
            @Param("dateFrom") String dateFrom,
            @Param("dateTo")   String dateTo,
            @Param("minAmt")   String minAmt,
            @Param("maxAmt")   String maxAmt);
}
