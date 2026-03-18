package com.habittracker.dto.habit;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HabitStats {
    private Long habitId;
    private String habitName;
    private Integer currentStreak;
    private Integer longestStreak;
    private Double completionRate;
    private Integer totalCompletions;
    private Boolean completedToday;
}
