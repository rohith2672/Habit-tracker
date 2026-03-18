package com.habittracker.repository;

import com.habittracker.model.Habit;
import com.habittracker.model.HabitEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitEntryRepository extends JpaRepository<HabitEntry, Long> {
    List<HabitEntry> findByHabitOrderByCompletedOnDesc(Habit habit);
    List<HabitEntry> findByHabitAndCompletedOnBetweenOrderByCompletedOnAsc(
        Habit habit, LocalDate start, LocalDate end);
    Optional<HabitEntry> findByHabitAndCompletedOn(Habit habit, LocalDate completedOn);
    boolean existsByHabitAndCompletedOn(Habit habit, LocalDate completedOn);
    void deleteByHabitAndCompletedOn(Habit habit, LocalDate completedOn);
}
