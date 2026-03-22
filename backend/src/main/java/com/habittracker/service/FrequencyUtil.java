package com.habittracker.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class FrequencyUtil {

    public static boolean isDueOn(String frequency, LocalDate date) {
        if (frequency == null || frequency.isBlank() || frequency.equalsIgnoreCase("daily")) {
            return true;
        }
        Set<DayOfWeek> days = parseDays(frequency);
        return days.contains(date.getDayOfWeek());
    }

    public static LocalDate prevDueDate(String frequency, LocalDate from) {
        LocalDate candidate = from.minusDays(1);
        for (int i = 0; i < 7; i++) {
            if (isDueOn(frequency, candidate)) return candidate;
            candidate = candidate.minusDays(1);
        }
        return candidate;
    }

    public static LocalDate nextDueDate(String frequency, LocalDate from) {
        LocalDate candidate = from.plusDays(1);
        for (int i = 0; i < 7; i++) {
            if (isDueOn(frequency, candidate)) return candidate;
            candidate = candidate.plusDays(1);
        }
        return candidate;
    }

    public static List<LocalDate> dueDatesInRange(String frequency, LocalDate start, LocalDate end) {
        List<LocalDate> result = new java.util.ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            if (isDueOn(frequency, current)) {
                result.add(current);
            }
            current = current.plusDays(1);
        }
        return result;
    }

    public static String normalise(String frequency) {
        if (frequency == null || frequency.isBlank()) return "daily";
        String upper = frequency.strip().toUpperCase();
        if (upper.equals("DAILY")) return "daily";
        return upper;
    }

    private static Set<DayOfWeek> parseDays(String frequency) {
        return Arrays.stream(frequency.split(","))
            .map(String::trim)
            .map(String::toUpperCase)
            .map(DayOfWeek::valueOf)
            .collect(Collectors.toSet());
    }
}
