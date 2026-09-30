package com.example.demo.dto;

public record AuthDtos() {
  public record Register(String name, String email, String password, String phone) {}

  public record Login(String email, String password) {}

  public record Token(String token, String role, String email) {}

  public record AuthResponse(String token, String role, String email, String name) {}
}
