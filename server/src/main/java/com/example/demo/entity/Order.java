package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Enumerated(EnumType.STRING)
  public OrderStatus status;

  public String shippingAddress, shippingPhone, paymentMethod;
  public BigDecimal total;
  public Instant createdAt;
  @ManyToOne public User customer;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
  public java.util.List<OrderItem> items = new java.util.ArrayList<>();
}
