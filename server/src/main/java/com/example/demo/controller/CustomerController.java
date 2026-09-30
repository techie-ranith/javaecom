package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.service.StoreService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CustomerController {
  final StoreService s;

  CustomerController(StoreService s) {
    this.s = s;
  }

  @GetMapping("/cart")
  ApiResponse<CartDto> cart(Authentication a) {
    return ApiResponse.ok(s.cart(a));
  }

  @PostMapping("/cart/{productId}")
  ApiResponse<CartDto> add(
      @PathVariable Long productId,
      @RequestParam(defaultValue = "1") int quantity,
      Authentication a) {
    return ApiResponse.ok(s.add(a, productId, quantity));
  }

  @PostMapping("/cart/items")
  ApiResponse<CartDto> addItem(
      @RequestParam Long productId,
      @RequestParam(defaultValue = "1") int quantity,
      Authentication a) {
    return ApiResponse.ok(s.add(a, productId, quantity));
  }

  @PutMapping("/cart/items/{id}")
  ApiResponse<CartDto> update(@PathVariable Long id, @RequestParam int quantity, Authentication a) {
    return ApiResponse.ok(s.updateCart(a, id, quantity));
  }

  @DeleteMapping("/cart/items/{id}")
  ApiResponse<Void> remove(@PathVariable Long id, Authentication a) {
    s.removeCart(a, id);
    return ApiResponse.ok(null);
  }

  @GetMapping("/wishlist")
  ApiResponse<?> wishlist(Authentication a) {
    return ApiResponse.ok(s.wishlist(a));
  }

  @PostMapping("/wishlist/{productId}")
  ApiResponse<?> wish(@PathVariable Long productId, Authentication a) {
    return ApiResponse.ok("Wishlist updated", s.addWish(a, productId));
  }

  @DeleteMapping("/wishlist/{productId}")
  ApiResponse<Void> unwish(@PathVariable Long productId, Authentication a) {
    s.removeWish(a, productId);
    return ApiResponse.ok(null);
  }

  @PostMapping("/reviews/{productId}")
  ApiResponse<ReviewDto> review(
      @PathVariable Long productId, @RequestBody ReviewRequest q, Authentication a) {
    return ApiResponse.ok(s.review(a, productId, q));
  }

  @PostMapping("/orders")
  ApiResponse<OrderDto> order(
      @RequestParam String address,
      @RequestParam String phone,
      @RequestParam String payment,
      Authentication a) {
    return ApiResponse.ok(s.order(a, address, phone, payment));
  }

  @GetMapping("/orders")
  ApiResponse<?> orders(Authentication a) {
    return ApiResponse.ok(s.orders(a));
  }

  @GetMapping("/orders/{id}")
  ApiResponse<OrderDto> order(@PathVariable Long id, Authentication a) {
    return ApiResponse.ok(s.order(a, id));
  }
}
