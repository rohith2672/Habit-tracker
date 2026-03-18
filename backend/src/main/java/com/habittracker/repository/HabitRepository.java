package com.habittracker.repository;

import com.habittracker.model.Habit;
import com.habittracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndIsActiveTrue(User user);
    List<Habit> findByUser(User user);
    Optional<Habit> findByIdAndUser(Long id, User user);
}
