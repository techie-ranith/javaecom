package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.dto.AuthDtos.*;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService service;

  public AuthController(AuthService s) {
    service = s;
  }

  @PostMapping("/register")
  public ApiResponse<AuthResponse> register(@Valid @RequestBody Register r) {
    return ApiResponse.ok(service.register(r));
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@Valid @RequestBody Login r) {
    return ApiResponse.ok(service.login(r));
  }
}
