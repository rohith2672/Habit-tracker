package com.habittracker.service;

import com.habittracker.model.Habit;
import com.habittracker.model.HabitEntry;
import com.habittracker.repository.HabitEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final HabitEntryRepository habitEntryRepository;

    public int currentStreak(Habit habit) {
        List<HabitEntry> entries = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit);
        if (entries.isEmpty()) return 0;

        String frequency = habit.getFrequency();
        LocalDate today = LocalDate.now();

        // Find most recent due date <= today
        LocalDate mostRecentDue = today;
        if (!FrequencyUtil.isDueOn(frequency, today)) {
            mostRecentDue = FrequencyUtil.prevDueDate(frequency, today);
        }

        Set<LocalDate> completedDates = entries.stream()
            .map(HabitEntry::getCompletedOn)
            .collect(Collectors.toSet());

        // The most recent due date must be completed (or today can be missed — still valid if yesterday due date was done)
        LocalDate checkDate = entries.get(0).getCompletedOn();
        if (checkDate.isBefore(mostRecentDue.minusDays(0)) && !checkDate.equals(mostRecentDue)) {
            // Most recent entry is before the most recent due date
            // Check: was the previous due date hit?
            LocalDate prevDue = FrequencyUtil.prevDueDate(frequency, mostRecentDue);
            if (!completedDates.contains(mostRecentDue) && !completedDates.contains(prevDue)) {
                return 0;
            }
        }

        // Walk backwards counting streak
        int streak = 0;
        LocalDate expected = mostRecentDue;

        // Allow streak if today is a due date not yet completed (grace: streak counts if prev due was done)
        if (!completedDates.contains(expected)) {
            expected = FrequencyUtil.prevDueDate(frequency, expected);
        }

        while (completedDates.contains(expected)) {
            streak++;
            expected = FrequencyUtil.prevDueDate(frequency, expected);
            // Safety: don't go back further than habit creation
            if (habit.getCreatedAt() != null && expected.isBefore(habit.getCreatedAt().toLocalDate())) {
                break;
            }
        }

        return streak;
    }

    public int longestStreak(Habit habit) {
        List<HabitEntry> entries = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit);
        if (entries.isEmpty()) return 0;

        String frequency = habit.getFrequency();

        List<LocalDate> dates = entries.stream()
            .map(HabitEntry::getCompletedOn)
            .sorted()
            .toList();

        int longest = 1;
        int current = 1;

        for (int i = 1; i < dates.size(); i++) {
            LocalDate expectedNext = FrequencyUtil.nextDueDate(frequency, dates.get(i - 1));
            if (dates.get(i).equals(expectedNext)) {
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

        String frequency = habit.getFrequency();
        LocalDate createdDate = habit.getCreatedAt().toLocalDate();
        LocalDate today = LocalDate.now();

        long totalDueDays = FrequencyUtil.dueDatesInRange(frequency, createdDate, today).size();
        if (totalDueDays <= 0) return 0.0;

        return Math.min(100.0, (entries.size() * 100.0) / totalDueDays);
    }
}
