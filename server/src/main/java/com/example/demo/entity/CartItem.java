package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public int quantity;
  @ManyToOne public User customer;
  @ManyToOne public Product product;
}
