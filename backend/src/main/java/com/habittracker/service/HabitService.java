package com.habittracker.service;

import com.habittracker.dto.habit.HabitRequest;
import com.habittracker.dto.habit.HabitResponse;
import com.habittracker.dto.habit.HabitStats;
import com.habittracker.exception.ResourceNotFoundException;
import com.habittracker.model.Habit;
import com.habittracker.model.User;
import com.habittracker.repository.HabitEntryRepository;
import com.habittracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitEntryRepository habitEntryRepository;
    private final StreakService streakService;

    public List<HabitResponse> getActiveHabits(User user) {
        return habitRepository.findByUserAndIsActiveTrue(user).stream()
            .map(h -> toResponse(h, true))
            .collect(Collectors.toList());
    }

    public HabitResponse createHabit(User user, HabitRequest request) {
        Habit habit = Habit.builder()
            .user(user)
            .name(request.getName())
            .description(request.getDescription())
            .color(request.getColor() != null ? request.getColor() : "#6366f1")
            .icon(request.getIcon())
            .frequency(request.getFrequency() != null ? request.getFrequency() : "daily")
            .isActive(true)
            .build();

        return toResponse(habitRepository.save(habit), true);
    }

    public HabitResponse getHabit(User user, Long habitId) {
        Habit habit = findOwnedHabit(user, habitId);
        return toResponse(habit, true);
    }

    public HabitResponse updateHabit(User user, Long habitId, HabitRequest request) {
        Habit habit = findOwnedHabit(user, habitId);

        habit.setName(request.getName());
        if (request.getDescription() != null) habit.setDescription(request.getDescription());
        if (request.getColor() != null) habit.setColor(request.getColor());
        if (request.getIcon() != null) habit.setIcon(request.getIcon());
        if (request.getFrequency() != null) habit.setFrequency(request.getFrequency());

        return toResponse(habitRepository.save(habit), true);
    }

    @Transactional
    public void deleteHabit(User user, Long habitId) {
        Habit habit = findOwnedHabit(user, habitId);
        habit.setIsActive(false);
        habitRepository.save(habit);
    }

    public HabitStats getStats(User user, Long habitId) {
        Habit habit = findOwnedHabit(user, habitId);

        boolean completedToday = habitEntryRepository.existsByHabitAndCompletedOn(habit, LocalDate.now());
        int currentStreak = streakService.currentStreak(habit);
        int longestStreak = streakService.longestStreak(habit);
        double completionRate = streakService.completionRate(habit);
        int totalCompletions = habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit).size();

        return HabitStats.builder()
            .habitId(habit.getId())
            .habitName(habit.getName())
            .currentStreak(currentStreak)
            .longestStreak(longestStreak)
            .completionRate(Math.round(completionRate * 10.0) / 10.0)
            .totalCompletions(totalCompletions)
            .completedToday(completedToday)
            .build();
    }

    public Habit findOwnedHabit(User user, Long habitId) {
        return habitRepository.findByIdAndUser(habitId, user)
            .orElseThrow(() -> new ResourceNotFoundException("Habit not found: " + habitId));
    }

    private HabitResponse toResponse(Habit habit, boolean includeStreak) {
        boolean completedToday = habitEntryRepository.existsByHabitAndCompletedOn(habit, LocalDate.now());
        int currentStreak = includeStreak ? streakService.currentStreak(habit) : 0;

        return HabitResponse.builder()
            .id(habit.getId())
            .name(habit.getName())
            .description(habit.getDescription())
            .color(habit.getColor())
            .icon(habit.getIcon())
            .frequency(habit.getFrequency())
            .isActive(habit.getIsActive())
            .createdAt(habit.getCreatedAt())
            .updatedAt(habit.getUpdatedAt())
            .completedToday(completedToday)
            .currentStreak(currentStreak)
            .build();
    }
}
