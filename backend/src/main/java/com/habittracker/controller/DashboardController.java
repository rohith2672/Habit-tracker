package com.habittracker.controller;

import com.habittracker.dto.habit.HabitResponse;
import com.habittracker.model.User;
import com.habittracker.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User user) {
        List<HabitResponse> habits = habitService.getActiveHabits(user);

        long completedToday = habits.stream()
            .filter(h -> Boolean.TRUE.equals(h.getCompletedToday()))
            .count();

        return ResponseEntity.ok(Map.of(
            "habits", habits,
            "totalHabits", habits.size(),
            "completedToday", completedToday,
            "completionRate", habits.isEmpty() ? 0 : (completedToday * 100.0 / habits.size())
        ));
    }
}
