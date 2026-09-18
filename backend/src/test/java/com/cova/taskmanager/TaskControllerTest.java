package com.cova.taskmanager;

import com.cova.taskmanager.dto.AuthResponse;
import com.cova.taskmanager.dto.RegisterRequest;
import com.cova.taskmanager.dto.TaskRequest;
import com.cova.taskmanager.entity.TaskPriority;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    private String jwtToken;

    @BeforeEach
    public void setUp() {
        String email = "taskuser_" + System.currentTimeMillis() + "@example.com";
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(email)
                .password("Password123!")
                .fullName("Task Test User")
                .build();
        AuthResponse authResponse = authService.register(registerRequest);
        this.jwtToken = authResponse.getToken();
    }

    @Test
    public void testTaskCrudFlow() throws Exception {
        // 1. Création d'une tâche
        TaskRequest createRequest = TaskRequest.builder()
                .title("Acheter du café COVA")
                .description("Prendre du bon café pour l'équipe de dev")
                .status(TaskStatus.PENDING)
                .priority(TaskPriority.HIGH)
                .build();

        String responseStr = mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Acheter du café COVA"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andReturn().getResponse().getContentAsString();

        Long taskId = objectMapper.readTree(responseStr).get("id").asLong();

        // 2. Récupération des tâches (filtrage et recherche)
        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + jwtToken)
                        .param("status", "PENDING")
                        .param("search", "café"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(taskId))
                .andExpect(jsonPath("$[0].title").value("Acheter du café COVA"));

        // 3. Modification de la tâche (passage en COMPLETED)
        TaskRequest updateRequest = TaskRequest.builder()
                .title("Acheter du café COVA - Fait")
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.HIGH)
                .build();

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.title").value("Acheter du café COVA - Fait"));

        // 4. Suppression de la tâche
        mockMvc.perform(delete("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 5. Vérification qu'elle a bien été supprimée
        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }
}
