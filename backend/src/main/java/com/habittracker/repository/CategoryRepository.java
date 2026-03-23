package com.habittracker.repository;

import com.habittracker.model.Category;
import com.habittracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrderByNameAsc(User user);
    Optional<Category> findByIdAndUser(Long id, User user);
    boolean existsByUserAndNameIgnoreCase(User user, String name);
}
