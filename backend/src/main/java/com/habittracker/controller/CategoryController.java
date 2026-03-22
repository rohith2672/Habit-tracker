package com.habittracker.controller;

import com.habittracker.dto.category.CategoryRequest;
import com.habittracker.dto.category.CategoryResponse;
import com.habittracker.model.User;
import com.habittracker.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getCategories(user));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.createCategory(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
        @AuthenticationPrincipal User user,
        @PathVariable Long id
    ) {
        categoryService.deleteCategory(user, id);
        return ResponseEntity.noContent().build();
    }
}
