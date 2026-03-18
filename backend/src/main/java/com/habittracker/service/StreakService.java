package com.habittracker.service;

import com.habittracker.model.Habit;
import com.habittracker.model.HabitEntry;
import com.habittracker.repository.HabitEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final HabitEntryRepository habitEntryRepository;

    public int currentStreak(Habit habit) {
        List<HabitEntry> entries = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit);
        if (entries.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate checkDate = entries.get(0).getCompletedOn();

        // If the most recent entry isn't today or yesterday, streak is 0
        if (checkDate.isBefore(today.minusDays(1))) return 0;

        int streak = 0;
        LocalDate expected = today;

        // Allow streak to start from today or yesterday
        if (checkDate.equals(today)) {
            expected = today;
        } else {
            expected = today.minusDays(1);
        }

        for (HabitEntry entry : entries) {
            if (entry.getCompletedOn().equals(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else if (entry.getCompletedOn().isBefore(expected)) {
                break;
            }
        }

        return streak;
    }

    public int longestStreak(Habit habit) {
        List<HabitEntry> entries = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit);
        if (entries.isEmpty()) return 0;

        // Sort ascending for easier processing
        List<LocalDate> dates = entries.stream()
            .map(HabitEntry::getCompletedOn)
            .sorted()
            .toList();

        int longest = 1;
        int current = 1;

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(dates.get(i - 1).plusDays(1))) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }

        return longest;
    }

    public double completionRate(Habit habit) {
        List<HabitEntry> entries = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit);
        if (entries.isEmpty()) return 0.0;

        LocalDate createdDate = habit.getCreatedAt().toLocalDate();
        LocalDate today = LocalDate.now();
        long totalDays = createdDate.until(today.plusDays(1), java.time.temporal.ChronoUnit.DAYS);

        if (totalDays <= 0) return 0.0;

        return Math.min(100.0, (entries.size() * 100.0) / totalDays);
    }
}
