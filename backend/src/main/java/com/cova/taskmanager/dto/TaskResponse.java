package com.cova.taskmanager.dto;

import com.cova.taskmanager.entity.TaskPriority;
import com.cova.taskmanager.entity.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
