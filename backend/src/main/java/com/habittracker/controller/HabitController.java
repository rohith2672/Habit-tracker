package com.habittracker.controller;

import com.habittracker.dto.entry.CheckInRequest;
import com.habittracker.dto.habit.HabitRequest;
import com.habittracker.dto.habit.HabitResponse;
import com.habittracker.dto.habit.HabitStats;
import com.habittracker.model.User;
import com.habittracker.service.HabitEntryService;
import com.habittracker.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final HabitEntryService habitEntryService;

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getHabits(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(habitService.getActiveHabits(user));
    }

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody HabitRequest request
    ) {
        return ResponseEntity.ok(habitService.createHabit(user, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitResponse> getHabit(
        @AuthenticationPrincipal User user,
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(habitService.getHabit(user, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitResponse> updateHabit(
        @AuthenticationPrincipal User user,
        @PathVariable Long id,
        @Valid @RequestBody HabitRequest request
    ) {
        return ResponseEntity.ok(habitService.updateHabit(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
        @AuthenticationPrincipal User user,
        @PathVariable Long id
    ) {
        habitService.deleteHabit(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<HabitStats> getStats(
        @AuthenticationPrincipal User user,
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(habitService.getStats(user, id));
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<Map<String, Object>> checkIn(
        @AuthenticationPrincipal User user,
        @PathVariable Long id,
        @RequestBody(required = false) CheckInRequest request
    ) {
        return ResponseEntity.ok(habitEntryService.checkIn(user, id, request));
    }

    @DeleteMapping("/{id}/checkin")
    public ResponseEntity<Void> undoCheckIn(
        @AuthenticationPrincipal User user,
        @PathVariable Long id
    ) {
        habitEntryService.undoCheckIn(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<Map<String, Boolean>> getHistory(
        @AuthenticationPrincipal User user,
        @PathVariable Long id,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) Integer month
    ) {
        java.time.LocalDate now = java.time.LocalDate.now();
        int y = year != null ? year : now.getYear();
        int m = month != null ? month : now.getMonthValue();
        return ResponseEntity.ok(habitEntryService.getMonthHistory(user, id, y, m));
    }
}
