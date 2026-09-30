package com.example.demo.service;

import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.entity.*;
import com.example.demo.mapper.StoreMapper;
import com.example.demo.repository.*;
import java.math.*;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
  final ProductRepository p;
  final CategoryRepository c;
  final OrderRepository o;
  final UserRepository u;
  final CouponRepository cp;
  final StoreMapper m;

  AdminService(
      ProductRepository p,
      CategoryRepository c,
      OrderRepository o,
      UserRepository u,
      CouponRepository cp,
      StoreMapper m) {
    this.p = p;
    this.c = c;
    this.o = o;
    this.u = u;
    this.cp = cp;
    this.m = m;
  }

  public DashboardDto dashboard() {
    var os = o.findAll();
    var sales =
        os.stream()
            .map(x -> x.total)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    return new DashboardDto(
        sales,
        os.size(),
        u.count(),
        p.count(),
        os.stream().filter(x -> x.status == OrderStatus.PENDING).count(),
        p.findAll().stream().filter(x -> x.stockQuantity < 5).count(),
        os.stream()
            .sorted((a, b) -> b.createdAt.compareTo(a.createdAt))
            .limit(10)
            .map(m::order)
            .toList());
  }

  public ProductDto save(ProductRequest q, Long id) {
    Product x = id == null ? new Product() : p.findById(id).orElseThrow();
    x.name = q.name();
    x.price = q.price();
    x.stock = q.stock();
    x.stockQuantity = q.stock();
    x.brand = q.brand();
    x.description = q.description();
    x.imageUrl = q.imageUrl();
    x.gender = q.gender();
    x.discountPercent = q.discountPercent();
    x.featured = q.featured();
    x.createdAt = x.createdAt == null ? java.time.Instant.now() : x.createdAt;
    x.updatedAt = java.time.Instant.now();
    if (q.categoryId() != null) x.category = c.findById(q.categoryId()).orElseThrow();
    return m.product(p.save(x));
  }

  public List<ProductDto> products(boolean activeOnly) {
    return p.findAll().stream()
        .filter(x -> !activeOnly || x.active)
        .map(m::product)
        .toList();
  }

  public List<OrderDto> orders() {
    return o.findAll().stream().map(m::order).toList();
  }

  public OrderDto status(Long id, OrderStatus s) {
    Order x = o.findById(id).orElseThrow();
    x.status = s;
    return m.order(o.save(x));
  }

  public void deleteProduct(Long id) {
    Product x = p.findById(id).orElseThrow();
    x.active = false;
    p.save(x);
  }

  public List<CategoryDto> categories() {
    return c.findAll().stream().map(m::category).toList();
  }

  public CategoryDto saveCategory(CategoryRequest q, Long id) {
    Category x = id == null ? new Category() : c.findById(id).orElseThrow();
    x.name = q.name();
    x.description = q.description();
    return m.category(c.save(x));
  }

  public void deleteCategory(Long id) {
    c.deleteById(id);
  }

  public List<CouponDto> coupons() {
    return cp.findAll().stream()
        .map(
            x ->
                new CouponDto(
                    x.id, x.code, x.discountPercent, x.minimumOrderValue, x.expiryDate, x.active))
        .toList();
  }

  public CouponDto saveCoupon(CouponRequest q, Long id) {
    Coupon x = id == null ? new Coupon() : cp.findById(id).orElseThrow();
    x.code = q.code();
    x.discountPercent = q.discountPercent();
    x.minimumOrderValue = q.minimumOrderValue();
    x.expiryDate = q.expiryDate();
    x.active = q.active();
    x = cp.save(x);
    return new CouponDto(
        x.id, x.code, x.discountPercent, x.minimumOrderValue, x.expiryDate, x.active);
  }

  public void deleteCoupon(Long id) {
    cp.deleteById(id);
  }

  public List<UserDto> customers() {
    return u.findAll().stream()
        .filter(x -> x.role == User.Role.CUSTOMER)
        .map(x -> new UserDto(x.id, x.name, x.email, x.phone, x.address, x.role, x.enabled))
        .toList();
  }
}
