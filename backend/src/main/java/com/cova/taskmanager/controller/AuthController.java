package com.cova.taskmanager.controller;

import com.cova.taskmanager.dto.AuthResponse;
import com.cova.taskmanager.dto.LoginRequest;
import com.cova.taskmanager.dto.RegisterRequest;
import com.cova.taskmanager.dto.UserResponse;
import com.cova.taskmanager.security.UserPrincipal;
import com.cova.taskmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints d'inscription, connexion et profil utilisateur")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur et obtention du jeton JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtenir le profil de l'utilisateur connecté")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse response = authService.getCurrentUserProfile(currentUser);
        return ResponseEntity.ok(response);
    }
}
