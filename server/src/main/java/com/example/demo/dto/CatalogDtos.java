package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.*;

public record CatalogDtos() {
  public record ProductDto(
      Long id,
      String name,
      String brand,
      String description,
      String imageUrl,
      String gender,
      BigDecimal price,
      BigDecimal discountPrice,
      BigDecimal discountPercent,
      int stock,
      boolean featured,
      boolean active,
      Long categoryId,
      String categoryName) {}

  public record ProductRequest(
      @NotBlank String name,
      @NotNull @Positive BigDecimal price,
      @Min(0) int stock,
      String brand,
      String description,
      String imageUrl,
      String gender,
      BigDecimal discountPercent,
      boolean featured,
      Long categoryId) {}

  public record CategoryDto(Long id, String name, String description) {}

  public record CategoryRequest(@NotBlank String name, String description) {}

  public record CartItemDto(Long id, ProductDto product, int quantity, BigDecimal lineTotal) {}

  public record CartDto(List<CartItemDto> items, BigDecimal total) {}

  public record WishlistItemDto(Long id, ProductDto product) {}

  public record ReviewDto(
      Long id, int rating, String comment, String customerName, Long productId) {}

  public record ReviewRequest(@Min(1) @Max(5) int rating, @NotBlank String comment) {}

  public record OrderItemDto(Long id, ProductDto product, int quantity, BigDecimal unitPrice) {}

  public record OrderDto(
      Long id,
      com.example.demo.entity.OrderStatus status,
      BigDecimal total,
      String shippingAddress,
      String shippingPhone,
      String paymentMethod,
      java.time.Instant createdAt,
      List<OrderItemDto> items) {}

  public record CouponDto(
      Long id,
      String code,
      BigDecimal discountPercent,
      BigDecimal minimumOrderValue,
      java.time.LocalDate expiryDate,
      boolean active) {}

  public record CouponRequest(
      @NotBlank String code,
      @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal discountPercent,
      @DecimalMin("0") BigDecimal minimumOrderValue,
      java.time.LocalDate expiryDate,
      boolean active) {}

  public record UserDto(
      Long id,
      String name,
      String email,
      String phone,
      String address,
      com.example.demo.entity.User.Role role,
      boolean enabled) {}

  public record DashboardDto(
      BigDecimal totalSales,
      long totalOrders,
      long totalCustomers,
      long totalProducts,
      long pendingOrders,
      long lowStockProducts,
      List<OrderDto> recentOrders) {}
}
