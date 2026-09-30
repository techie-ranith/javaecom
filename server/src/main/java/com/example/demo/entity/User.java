package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(unique = true, nullable = false)
  public String email;

  public String password, name, phone, address;

  @Enumerated(EnumType.STRING)
  public Role role = Role.CUSTOMER;

  public boolean enabled = true;

  public enum Role {
    CUSTOMER,
    ADMIN
  }
}
