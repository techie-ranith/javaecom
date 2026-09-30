package com.example.demo.repository;

import com.example.demo.entity.Product;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
  java.util.List<Product> findByActiveTrueAndNameContainingIgnoreCase(String name);
}
