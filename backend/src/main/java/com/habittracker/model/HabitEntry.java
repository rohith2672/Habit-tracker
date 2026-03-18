package com.habittracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "habit_entries",
    uniqueConstraints = @UniqueConstraint(columnNames = {"habit_id", "completed_on"}),
    indexes = {
        @Index(name = "idx_entries_habit_id", columnList = "habit_id"),
        @Index(name = "idx_entries_completed_on", columnList = "completed_on")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Column(name = "completed_on", nullable = false)
    private LocalDate completedOn;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
