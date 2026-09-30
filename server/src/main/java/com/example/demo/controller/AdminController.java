package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.entity.OrderStatus;
import com.example.demo.service.AdminService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  final AdminService s;

  AdminController(AdminService s) {
    this.s = s;
  }

  @GetMapping("/dashboard")
  ApiResponse<DashboardDto> dashboard() {
    return ApiResponse.ok(s.dashboard());
  }

  @GetMapping("/orders")
  ApiResponse<List<OrderDto>> orders() {
    return ApiResponse.ok(s.orders());
  }

  @PutMapping("/orders/{id}/status")
  ApiResponse<OrderDto> status(@PathVariable Long id, @RequestParam OrderStatus status) {
    return ApiResponse.ok(s.status(id, status));
  }

  @GetMapping("/sales")
  ApiResponse<DashboardDto> sales() {
    return ApiResponse.ok(s.dashboard());
  }

  @GetMapping("/products")
  ApiResponse<List<ProductDto>> products(
      @RequestParam(defaultValue = "false") boolean activeOnly) {
    return ApiResponse.ok(s.products(activeOnly));
  }

  @PostMapping("/products")
  ApiResponse<ProductDto> create(@Valid @RequestBody ProductRequest q) {
    return ApiResponse.ok(s.save(q, null));
  }

  @PutMapping("/products/{id}")
  ApiResponse<ProductDto> update(@PathVariable Long id, @Valid @RequestBody ProductRequest q) {
    return ApiResponse.ok(s.save(q, id));
  }

  @DeleteMapping("/products/{id}")
  ApiResponse<Void> delete(@PathVariable Long id) {
    s.deleteProduct(id);
    return ApiResponse.ok(null);
  }

  @GetMapping("/customers")
  ApiResponse<List<UserDto>> customers() {
    return ApiResponse.ok(s.customers());
  }

  @GetMapping("/categories")
  ApiResponse<List<CategoryDto>> categories() {
    return ApiResponse.ok(s.categories());
  }

  @PostMapping("/categories")
  ApiResponse<CategoryDto> category(@Valid @RequestBody CategoryRequest q) {
    return ApiResponse.ok(s.saveCategory(q, null));
  }

  @PutMapping("/categories/{id}")
  ApiResponse<CategoryDto> categoryUpdate(
      @PathVariable Long id, @Valid @RequestBody CategoryRequest q) {
    return ApiResponse.ok(s.saveCategory(q, id));
  }

  @DeleteMapping("/categories/{id}")
  ApiResponse<Void> categoryDelete(@PathVariable Long id) {
    s.deleteCategory(id);
    return ApiResponse.ok(null);
  }

  @GetMapping("/coupons")
  ApiResponse<List<CouponDto>> coupons() {
    return ApiResponse.ok(s.coupons());
  }

  @PostMapping("/coupons")
  ApiResponse<CouponDto> coupon(@Valid @RequestBody CouponRequest q) {
    return ApiResponse.ok(s.saveCoupon(q, null));
  }

  @PutMapping("/coupons/{id}")
  ApiResponse<CouponDto> couponUpdate(@PathVariable Long id, @Valid @RequestBody CouponRequest q) {
    return ApiResponse.ok(s.saveCoupon(q, id));
  }

  @DeleteMapping("/coupons/{id}")
  ApiResponse<Void> couponDelete(@PathVariable Long id) {
    s.deleteCoupon(id);
    return ApiResponse.ok(null);
  }
}
