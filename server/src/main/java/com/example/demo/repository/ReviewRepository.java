package com.example.demo.repository;

import com.example.demo.entity.Review;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
  java.util.Optional<Review> findByCustomerIdAndProductId(Long c, Long p);
}
