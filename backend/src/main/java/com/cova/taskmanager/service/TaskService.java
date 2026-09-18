package com.cova.taskmanager.service;

import com.cova.taskmanager.dto.TaskRequest;
import com.cova.taskmanager.dto.TaskResponse;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.security.UserPrincipal;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getTasksForUser(UserPrincipal currentUser, TaskStatus status, String search);
    TaskResponse getTaskById(UserPrincipal currentUser, Long taskId);
    TaskResponse createTask(UserPrincipal currentUser, TaskRequest taskRequest);
    TaskResponse updateTask(UserPrincipal currentUser, Long taskId, TaskRequest taskRequest);
    void deleteTask(UserPrincipal currentUser, Long taskId);
}
