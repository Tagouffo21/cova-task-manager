package com.cova.taskmanager.config;

import com.cova.taskmanager.entity.Task;
import com.cova.taskmanager.entity.TaskPriority;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.entity.User;
import com.cova.taskmanager.repository.TaskRepository;
import com.cova.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Initialisation du compte démo pour les évaluateurs COVA...");

            User demoUser = User.builder()
                    .email("recruiter@cova.africa")
                    .password(passwordEncoder.encode("CovaRecruit2026!"))
                    .fullName("Recruteur COVA")
                    .build();

            User savedUser = userRepository.save(demoUser);

            Task task1 = Task.builder()
                    .title("Évaluation du candidat Full-Stack")
                    .description("Tester les fonctionnalités backend, frontend React et mobile Flutter du Task Manager.")
                    .status(TaskStatus.IN_PROGRESS)
                    .priority(TaskPriority.HIGH)
                    .dueDate(LocalDateTime.now().plusDays(2))
                    .user(savedUser)
                    .build();

            Task task2 = Task.builder()
                    .title("Vérification des tests unitaires et Swagger")
                    .description("Accéder à /swagger-ui.html et valider les endpoints RESTful.")
                    .status(TaskStatus.PENDING)
                    .priority(TaskPriority.MEDIUM)
                    .dueDate(LocalDateTime.now().plusDays(5))
                    .user(savedUser)
                    .build();

            Task task3 = Task.builder()
                    .title("Déploiement CI/CD Docker & GCP")
                    .description("Vérifier le workflow GitHub Actions et l'orchestration Docker Compose.")
                    .status(TaskStatus.COMPLETED)
                    .priority(TaskPriority.HIGH)
                    .dueDate(LocalDateTime.now().minusDays(1))
                    .user(savedUser)
                    .build();

            taskRepository.save(task1);
            taskRepository.save(task2);
            taskRepository.save(task3);

            log.info("Données de démonstration initialisées avec succès ! Email: recruiter@cova.africa");
        }
    }
}
