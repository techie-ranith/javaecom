package com.example.demo.repository;

import com.example.demo.entity.User;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  java.util.Optional<User> findByEmail(String email);
}
