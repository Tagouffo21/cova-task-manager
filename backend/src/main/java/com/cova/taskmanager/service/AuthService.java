package com.cova.taskmanager.service;

import com.cova.taskmanager.dto.AuthResponse;
import com.cova.taskmanager.dto.LoginRequest;
import com.cova.taskmanager.dto.RegisterRequest;
import com.cova.taskmanager.dto.UserResponse;
import com.cova.taskmanager.security.UserPrincipal;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserResponse getCurrentUserProfile(UserPrincipal currentUser);
}
