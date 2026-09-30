package com.example.demo.mapper;

import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.entity.*;
import java.math.*;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {
  public ProductDto product(Product p) {
    BigDecimal d = p.discountPercent == null ? BigDecimal.ZERO : p.discountPercent;
    return new ProductDto(
        p.id,
        p.name,
        p.brand,
        p.description,
        p.imageUrl,
        p.gender,
        p.price,
        p.price.multiply(BigDecimal.ONE.subtract(d.divide(BigDecimal.valueOf(100)))),
        p.discountPercent,
        p.stock,
        p.featured,
        p.active,
        p.category == null ? null : p.category.id,
        p.category == null ? null : p.category.name);
  }

  public CategoryDto category(Category c) {
    return new CategoryDto(c.id, c.name, c.description);
  }

  public ReviewDto review(Review r) {
    return new ReviewDto(r.id, r.rating, r.comment, r.customer.name, r.product.id);
  }

  public OrderDto order(Order o) {
    return new OrderDto(
        o.id,
        o.status,
        o.total,
        o.shippingAddress,
        o.shippingPhone,
        o.paymentMethod,
        o.createdAt,
        o.items.stream()
            .map(i -> new OrderItemDto(i.id, product(i.product), i.quantity, i.unitPrice))
            .toList());
  }
}
