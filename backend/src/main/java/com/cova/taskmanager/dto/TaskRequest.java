package com.cova.taskmanager.dto;

import com.cova.taskmanager.entity.TaskPriority;
import com.cova.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequest {

    @NotBlank(message = "Le titre de la tâche est obligatoire")
    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDateTime dueDate;
}
