package com.habittracker.dto.habit;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private String frequency;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean completedToday;
    private Integer currentStreak;
}
