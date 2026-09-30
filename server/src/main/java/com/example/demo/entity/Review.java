package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public int rating;
  public String comment;
  public Instant createdAt;
  @ManyToOne public User customer;
  @ManyToOne public Product product;
}
