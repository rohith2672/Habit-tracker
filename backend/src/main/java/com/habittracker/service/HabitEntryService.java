package com.habittracker.service;

import com.habittracker.dto.entry.CheckInRequest;
import com.habittracker.model.Habit;
import com.habittracker.model.HabitEntry;
import com.habittracker.model.User;
import com.habittracker.repository.HabitEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitEntryService {

    private final HabitEntryRepository habitEntryRepository;
    private final HabitService habitService;

    @Transactional
    public Map<String, Object> checkIn(User user, Long habitId, CheckInRequest request) {
        Habit habit = habitService.findOwnedHabit(user, habitId);
        LocalDate today = LocalDate.now();

        if (habitEntryRepository.existsByHabitAndCompletedOn(habit, today)) {
            return Map.of("message", "Already checked in today", "completedOn", today);
        }

        HabitEntry entry = HabitEntry.builder()
            .habit(habit)
            .completedOn(today)
            .note(request != null ? request.getNote() : null)
            .build();

        habitEntryRepository.save(entry);
        return Map.of("message", "Checked in successfully", "completedOn", today);
    }

    @Transactional
    public void undoCheckIn(User user, Long habitId) {
        Habit habit = habitService.findOwnedHabit(user, habitId);
        LocalDate today = LocalDate.now();
        habitEntryRepository.deleteByHabitAndCompletedOn(habit, today);
    }

    public Map<String, Boolean> getMonthHistory(User user, Long habitId, int year, int month) {
        Habit habit = habitService.findOwnedHabit(user, habitId);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<HabitEntry> entries = habitEntryRepository
            .findByHabitAndCompletedOnBetweenOrderByCompletedOnAsc(habit, start, end);

        return entries.stream()
            .collect(Collectors.toMap(
                e -> e.getCompletedOn().toString(),
                e -> Boolean.TRUE
            ));
    }
}
