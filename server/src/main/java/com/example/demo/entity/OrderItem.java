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
public class OrderItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public int quantity;
  public BigDecimal unitPrice;
  @ManyToOne public Order order;
  @ManyToOne public Product product;
}
