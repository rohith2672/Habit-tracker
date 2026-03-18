package com.habittracker;

import com.habittracker.model.Habit;
import com.habittracker.model.HabitEntry;
import com.habittracker.model.User;
import com.habittracker.repository.HabitEntryRepository;
import com.habittracker.service.StreakService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    private HabitEntryRepository habitEntryRepository;

    @InjectMocks
    private StreakService streakService;

    private Habit habit;

    @BeforeEach
    void setup() {
        User user = User.builder().id(1L).email("test@test.com").username("tester").passwordHash("x").build();
        habit = Habit.builder()
            .id(1L)
            .user(user)
            .name("Test habit")
            .isActive(true)
            .createdAt(LocalDateTime.now().minusDays(30))
            .build();
    }

    private HabitEntry entry(LocalDate date) {
        return HabitEntry.builder().habit(habit).completedOn(date).createdAt(LocalDateTime.now()).build();
    }

    @Test
    void currentStreak_noEntries_returnsZero() {
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit)).thenReturn(List.of());
        assertThat(streakService.currentStreak(habit)).isZero();
    }

    @Test
    void currentStreak_completedToday_returnsOne() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(entry(today)));
        assertThat(streakService.currentStreak(habit)).isEqualTo(1);
    }

    @Test
    void currentStreak_consecutiveDaysIncludingToday_returnsCorrectCount() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(
                entry(today),
                entry(today.minusDays(1)),
                entry(today.minusDays(2))
            ));
        assertThat(streakService.currentStreak(habit)).isEqualTo(3);
    }

    @Test
    void currentStreak_gapInDays_streakBroken() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(
                entry(today),
                entry(today.minusDays(2)) // gap!
            ));
        assertThat(streakService.currentStreak(habit)).isEqualTo(1);
    }

    @Test
    void currentStreak_lastEntryWasYesterday_countsStreak() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(
                entry(today.minusDays(1)),
                entry(today.minusDays(2))
            ));
        assertThat(streakService.currentStreak(habit)).isEqualTo(2);
    }

    @Test
    void currentStreak_olderThanYesterday_returnsZero() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(entry(today.minusDays(2))));
        assertThat(streakService.currentStreak(habit)).isZero();
    }

    @Test
    void longestStreak_multipleSegments_returnsMax() {
        LocalDate today = LocalDate.now();
        when(habitEntryRepository.findByHabitOrderByCompletedOnDesc(habit))
            .thenReturn(List.of(
                entry(today),
                entry(today.minusDays(1)),
                // gap
                entry(today.minusDays(5)),
                entry(today.minusDays(6)),
                entry(today.minusDays(7))
            ));
        assertThat(streakService.longestStreak(habit)).isEqualTo(3);
    }
}
