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
public class Coupon {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(unique = true)
  public String code;

  public BigDecimal discountPercent, minimumOrderValue;
  public java.time.LocalDate expiryDate;
  public boolean active = true;
}
