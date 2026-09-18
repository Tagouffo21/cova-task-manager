package com.cova.taskmanager.controller;

import com.cova.taskmanager.dto.TaskRequest;
import com.cova.taskmanager.dto.TaskResponse;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.security.UserPrincipal;
import com.cova.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints de gestion CRUD des tâches")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Liste des tâches de l'utilisateur connecté avec filtres (statut & recherche)")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search) {
        List<TaskResponse> tasks = taskService.getTasksForUser(currentUser, status, search);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'une tâche par son ID")
    public ResponseEntity<TaskResponse> getTaskById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        TaskResponse task = taskService.getTaskById(currentUser, id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    @Operation(summary = "Création d'une nouvelle tâche")
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse createdTask = taskService.createTask(currentUser, request);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modification d'une tâche existante")
    public ResponseEntity<TaskResponse> updateTask(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse updatedTask = taskService.updateTask(currentUser, id, request);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Suppression d'une tâche par son ID")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        taskService.deleteTask(currentUser, id);
        return ResponseEntity.noContent().build();
    }
}
