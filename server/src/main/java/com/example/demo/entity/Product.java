package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    indexes = {
      @Index(name = "idx_product_name", columnList = "name"),
      @Index(name = "idx_product_active", columnList = "active")
    })
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public String name, brand, description, imageUrl, gender, size;
  public BigDecimal price, discountPercent, discountPrice;
  public int stock, stockQuantity;
  public boolean active = true, featured = false;
  public java.time.Instant createdAt, updatedAt;
  @ManyToOne public Category category;
}
