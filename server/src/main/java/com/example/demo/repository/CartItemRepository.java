package com.example.demo.repository;

import com.example.demo.entity.CartItem;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  java.util.List<CartItem> findByCustomerId(Long id);

  java.util.Optional<CartItem> findByCustomerIdAndProductId(Long c, Long p);
}
