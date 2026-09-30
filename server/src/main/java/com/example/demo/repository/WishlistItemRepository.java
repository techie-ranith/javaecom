package com.example.demo.repository;

import com.example.demo.entity.WishlistItem;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
  java.util.List<WishlistItem> findByCustomerId(Long id);

  java.util.Optional<WishlistItem> findByCustomerIdAndProductId(Long c, Long p);
}
