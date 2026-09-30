package com.example.demo.service;

import com.example.demo.dto.AuthDtos.*;
import com.example.demo.entity.User;
import com.example.demo.entity.User.Role;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final SecretKey key;

  @Value("${app.jwt.expiration}")
  long expiration;

  public AuthService(
      UserRepository u, PasswordEncoder e, @Value("${app.jwt.secret}") String secret) {
    users = u;
    encoder = e;
    key = Keys.hmacShaKeyFor(secret.getBytes());
  }

  public AuthResponse register(Register r) {
    if (users.findByEmail(r.email()).isPresent())
      throw new IllegalArgumentException("Email already registered");
    User u =
        User.builder()
            .name(r.name())
            .email(r.email())
            .phone(r.phone())
            .password(encoder.encode(r.password()))
            .role(Role.CUSTOMER)
            .build();
    users.save(u);
    return token(u);
  }

  public AuthResponse login(Login r) {
    User u =
        users
            .findByEmail(r.email())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    if (!encoder.matches(r.password(), u.password))
      throw new IllegalArgumentException("Invalid credentials");
    return token(u);
  }

  private AuthResponse token(User u) {
    String t =
        Jwts.builder()
            .subject(u.email)
            .claim("role", u.role.name())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(key)
            .compact();
    return new AuthResponse(t, u.role.name(), u.email, u.name);
  }
}
