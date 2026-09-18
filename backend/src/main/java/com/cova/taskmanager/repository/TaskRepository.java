package com.cova.taskmanager.repository;

import com.cova.taskmanager.entity.Task;
import com.cova.taskmanager.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:query IS NULL OR :query = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY t.createdAt DESC")
    List<Task> searchTasks(@Param("userId") Long userId,
                          @Param("status") TaskStatus status,
                          @Param("query") String query);
}
