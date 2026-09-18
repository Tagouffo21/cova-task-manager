package com.cova.taskmanager.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Endpoint de bienvenue de l'API")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Message de bienvenue et statut de l'API")
    public ResponseEntity<Map<String, Object>> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "COVA Task Manager REST API");
        response.put("version", "1.0.0");
        response.put("swaggerDocumentation", "/swagger-ui.html");
        return ResponseEntity.ok(response);
    }
}
