package com.fintech.budget;

import com.fintech.entity.Budget;
import com.fintech.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserOrderByYearDescMonthDescCategoryAsc(User user);

    List<Budget> findByUserAndMonthAndYearOrderByCategoryAsc(User user, Integer month, Integer year);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, String category, Integer month, Integer year);

    Optional<Budget> findByIdAndUser(Long id, User user);

    boolean existsByUserAndCategoryAndMonthAndYear(User user, String category, Integer month, Integer year);
}
