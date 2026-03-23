package com.habittracker.service;

import com.habittracker.dto.category.CategoryRequest;
import com.habittracker.dto.category.CategoryResponse;
import com.habittracker.model.Category;
import com.habittracker.model.Habit;
import com.habittracker.model.User;
import com.habittracker.repository.CategoryRepository;
import com.habittracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final HabitRepository habitRepository;

    public List<CategoryResponse> getCategories(User user) {
        return categoryRepository.findByUserOrderByNameAsc(user).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(User user, CategoryRequest request) {
        if (categoryRepository.existsByUserAndNameIgnoreCase(user, request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists: " + request.getName());
        }
        Category category = Category.builder()
            .user(user)
            .name(request.getName().strip())
            .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(User user, Long id) {
        Category category = categoryRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        // Null out the category field on any habits using this category name
        List<Habit> habits = habitRepository.findByUserAndIsActiveTrue(user);
        for (Habit habit : habits) {
            if (category.getName().equals(habit.getCategory())) {
                habit.setCategory(null);
                habitRepository.save(habit);
            }
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .build();
    }
}
