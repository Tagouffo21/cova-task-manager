package com.cova.taskmanager.service.impl;

import com.cova.taskmanager.dto.TaskRequest;
import com.cova.taskmanager.dto.TaskResponse;
import com.cova.taskmanager.entity.Task;
import com.cova.taskmanager.entity.TaskPriority;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.entity.User;
import com.cova.taskmanager.exception.ResourceNotFoundException;
import com.cova.taskmanager.exception.UnauthorizedAccessException;
import com.cova.taskmanager.repository.TaskRepository;
import com.cova.taskmanager.repository.UserRepository;
import com.cova.taskmanager.security.UserPrincipal;
import com.cova.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForUser(UserPrincipal currentUser, TaskStatus status, String search) {
        List<Task> tasks = taskRepository.searchTasks(currentUser.getId(), status, search);
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UserPrincipal currentUser, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche introuvable avec l'ID : " + taskId));

        verifyOwnership(currentUser, task);

        return mapToTaskResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse createTask(UserPrincipal currentUser, TaskRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Task task = Task.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(UserPrincipal currentUser, Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche introuvable avec l'ID : " + taskId));

        verifyOwnership(currentUser, task);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(UserPrincipal currentUser, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche introuvable avec l'ID : " + taskId));

        verifyOwnership(currentUser, task);

        taskRepository.delete(task);
    }

    private void verifyOwnership(UserPrincipal currentUser, Task task) {
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à accéder ou modifier cette tâche.");
        }
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .userId(task.getUser().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
