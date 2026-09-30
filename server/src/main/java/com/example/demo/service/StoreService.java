package com.example.demo.service;

import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.entity.*;
import com.example.demo.mapper.StoreMapper;
import com.example.demo.repository.*;
import java.math.*;
import java.time.*;
import java.util.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreService {
  final UserRepository u;
  final ProductRepository p;
  final CartItemRepository c;
  final WishlistItemRepository w;
  final ReviewRepository r;
  final OrderRepository o;
  final StoreMapper m;

  StoreService(
      UserRepository u,
      ProductRepository p,
      CartItemRepository c,
      WishlistItemRepository w,
      ReviewRepository r,
      OrderRepository o,
      StoreMapper m) {
    this.u = u;
    this.p = p;
    this.c = c;
    this.w = w;
    this.r = r;
    this.o = o;
    this.m = m;
  }

  User me(Authentication a) {
    return u.findByEmail(a.getName()).orElseThrow();
  }

  public CartDto cart(Authentication a) {
    var xs = c.findByCustomerId(me(a).id);
    var ds =
        xs.stream()
            .map(
                i ->
                    new CartItemDto(
                        i.id,
                        m.product(i.product),
                        i.quantity,
                        i.product.price.multiply(BigDecimal.valueOf(i.quantity))))
            .toList();
    return new CartDto(
        ds, ds.stream().map(CartItemDto::lineTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
  }

  @Transactional
  public CartDto updateCart(Authentication a, Long itemId, int q) {
    var i = c.findById(itemId).orElseThrow();
    if (!i.customer.id.equals(me(a).id)) throw new SecurityException("Not owner");
    if (q < 1 || q > i.product.stock) throw new IllegalArgumentException("Invalid quantity");
    i.quantity = q;
    c.save(i);
    return cart(a);
  }

  @Transactional
  public void removeCart(Authentication a, Long itemId) {
    var i = c.findById(itemId).orElseThrow();
    if (!i.customer.id.equals(me(a).id)) throw new SecurityException("Not owner");
    c.delete(i);
  }

  @Transactional
  public CartDto add(Authentication a, Long id, int q) {
    if (q < 1) throw new IllegalArgumentException("Quantity must be positive");
    User x = me(a);
    Product z = p.findById(id).orElseThrow();
    var i =
        c.findByCustomerIdAndProductId(x.id, id)
            .orElse(CartItem.builder().customer(x).product(z).quantity(0).build());
    if (i.quantity + q > z.stock) throw new IllegalArgumentException("Insufficient stock");
    i.quantity += q;
    c.save(i);
    return cart(a);
  }

  public List<WishlistItemDto> wishlist(Authentication a) {
    return w.findByCustomerId(me(a).id).stream()
        .map(i -> new WishlistItemDto(i.id, m.product(i.product)))
        .toList();
  }

  @Transactional
  public List<WishlistItemDto> addWish(Authentication a, Long productId) {
    User x = me(a);
    Product z = p.findById(productId).orElseThrow();
    if (w.findByCustomerIdAndProductId(x.id, productId).isEmpty()) {
      w.save(WishlistItem.builder().customer(x).product(z).build());
    }
    return wishlist(a);
  }

  @Transactional
  public void removeWish(Authentication a, Long productId) {
    var i = w.findByCustomerIdAndProductId(me(a).id, productId).orElseThrow();
    w.delete(i);
  }

  @Transactional
  public OrderDto order(Authentication a, String address, String phone, String payment) {
    User x = me(a);
    var items = c.findByCustomerId(x.id);
    if (items.isEmpty()) throw new IllegalArgumentException("Cart is empty");
    Order o =
        Order.builder()
            .customer(x)
            .status(OrderStatus.PENDING)
            .shippingAddress(address)
            .shippingPhone(phone)
            .paymentMethod(payment)
            .createdAt(Instant.now())
            .total(BigDecimal.ZERO)
            .build();
    for (var i : items) {
      if (i.quantity > i.product.stock) throw new IllegalArgumentException("Insufficient stock");
      i.product.stock -= i.quantity;
      OrderItem oi =
          OrderItem.builder()
              .order(o)
              .product(i.product)
              .quantity(i.quantity)
              .unitPrice(i.product.price)
              .build();
      o.items.add(oi);
      o.total = o.total.add(i.product.price.multiply(BigDecimal.valueOf(i.quantity)));
    }
    o = oRepo(o);
    c.deleteAll(items);
    return m.order(o);
  }

  Order oRepo(Order o) {
    return this.o.save(o);
  }

  public List<OrderDto> orders(Authentication a) {
    return o.findAll().stream().filter(x -> x.customer.id.equals(me(a).id)).map(m::order).toList();
  }

  public OrderDto order(Authentication a, Long id) {
    var x = o.findById(id).orElseThrow();
    if (!x.customer.id.equals(me(a).id)) throw new SecurityException("Not owner");
    return m.order(x);
  }

  @Transactional
  public ReviewDto review(Authentication a, Long id, ReviewRequest q) {
    User x = me(a);
    Product z = p.findById(id).orElseThrow();
    Review v =
        r.findByCustomerIdAndProductId(x.id, id)
            .orElse(Review.builder().customer(x).product(z).build());
    v.rating = q.rating();
    v.comment = q.comment();
    v.createdAt = Instant.now();
    return m.review(r.save(v));
  }
}
