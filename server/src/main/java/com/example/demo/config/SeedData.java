package com.example.demo.config;

import com.example.demo.entity.Category;
import com.example.demo.entity.Coupon;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Product;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.CouponRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedData {

  @Bean
  CommandLineRunner seed(
      UserRepository users,
      CategoryRepository categories,
      ProductRepository products,
      ReviewRepository reviews,
      CouponRepository coupons,
      OrderRepository orders,
      PasswordEncoder encoder,
      @Value("${app.seed.enabled:true}") boolean enabled) {
    return args -> {
      if (!enabled || users.count() > 0) {
        return;
      }

      users.save(
          user(
              encoder,
              "Store Admin",
              "admin@aurelia.test",
              "Admin@123",
              User.Role.ADMIN,
              "0771000001",
              "12 Galle Road, Colombo"));
      User maya =
          users.save(
              user(
                  encoder,
                  "Maya Stone",
                  "maya@aurelia.test",
                  "Customer@123",
                  User.Role.CUSTOMER,
                  "0772000002",
                  "8 Flower Road, Colombo 07"));
      User noah =
          users.save(
              user(
                  encoder,
                  "Noah Reed",
                  "noah@aurelia.test",
                  "Customer@123",
                  User.Role.CUSTOMER,
                  "0773000003",
                  "44 Kandy Road, Kandy"));
      User iris =
          users.save(
              user(
                  encoder,
                  "Iris Vale",
                  "iris@aurelia.test",
                  "Customer@123",
                  User.Role.CUSTOMER,
                  "0774000004",
                  "3 Beach Road, Galle"));

      Map<String, Category> catalog = new LinkedHashMap<>();
      catalog.put("Women", category(categories, "Women", "Fragrances composed for her."));
      catalog.put("Men", category(categories, "Men", "Fragrances composed for him."));
      catalog.put("Unisex", category(categories, "Unisex", "Scents meant to be shared."));
      catalog.put(
          "Gift sets", category(categories, "Gift sets", "Thoughtful sets, ready to give."));
      catalog.put("Signature", category(categories, "Signature", "The Aurelia signatures."));
      catalog.put(
          "New arrivals", category(categories, "New arrivals", "Just added to the collection."));

      Product nocturne =
          product(
              products,
              catalog,
              "Nocturne Amber",
              "Aurelia",
              "A warm, enveloping composition of amber, saffron and sandalwood.",
              "photo-1594035910387-fea47794261f",
              "Unisex",
              "Signature",
              16500,
              16,
              12,
              true,
              "50 ml");
      Product velvet =
          product(
              products,
              catalog,
              "Velvet Bloom",
              "Maison Élise",
              "A luminous floral with rose absolute, iris and soft musk.",
              "photo-1541643600914-78b084683601",
              "Women",
              "Women",
              14800,
              15,
              8,
              true,
              "50 ml");
      Product cedar =
          product(
              products,
              catalog,
              "Cedar Coast",
              "Atelier Noma",
              "Bright bergamot meets driftwood and vetiver in a modern classic.",
              "photo-1592945403244-b3fbafd7f539",
              "Men",
              "Men",
              13200,
              null,
              20,
              true,
              "50 ml");
      Product silk =
          product(
              products,
              catalog,
              "Silk Petals",
              "Aurelia",
              "Peony, pear and cashmere woods made for slow afternoons.",
              "photo-1563170351-be82bc888aa4",
              "Women",
              "Women",
              11900,
              17,
              4,
              false,
              "50 ml");
      Product rain =
          product(
              products,
              catalog,
              "After Rain",
              "Noma Studio",
              "Mineral notes, green fig and a trace of clean white cedar.",
              "photo-1523293182086-7651a899d37f",
              "Unisex",
              "Unisex",
              15500,
              null,
              15,
              false,
              "50 ml");
      Product golden =
          product(
              products,
              catalog,
              "Golden Hour",
              "Maison Élise",
              "A radiant veil of neroli, vanilla and golden sandalwood.",
              "photo-1590736704728-f4730bb30770",
              "Women",
              "New arrivals",
              17900,
              13,
              6,
              true,
              "50 ml");
      product(
          products,
          catalog,
          "Night Vetiver",
          "Atelier Noma",
          "Smoked vetiver, black pepper and a dry cedar heart.",
          "photo-1615634260167-c8cdede054de",
          "Men",
          "Men",
          14200,
          null,
          18,
          true,
          "100 ml");
      product(
          products,
          catalog,
          "White Iris",
          "Aurelia",
          "Powdery iris, violet leaf and a clean musk trail.",
          "photo-1595425970377-c970029bf94e",
          "Women",
          "Women",
          12800,
          10,
          11,
          false,
          "50 ml");
      product(
          products,
          catalog,
          "Linen Dusk",
          "Noma Studio",
          "Sun-warmed linen, tea and a whisper of ambergris.",
          "photo-1547887538-e3a2f32cb1cc",
          "Unisex",
          "Unisex",
          13600,
          null,
          9,
          true,
          "50 ml");
      Product ritual =
          product(
              products,
              catalog,
              "Ritual Set",
              "Aurelia",
              "Travel sizes of Nocturne Amber and Silk Petals, boxed together.",
              "photo-1610461888750-10bfc601b874",
              "Unisex",
              "Gift sets",
              24500,
              12,
              7,
              true,
              "Gift set");
      product(
          products,
          catalog,
          "Evening Trio",
          "Maison Élise",
          "Three evening florals in a linen gift box.",
          "photo-1588405748880-12d1d2a59f75",
          "Women",
          "Gift sets",
          28900,
          null,
          5,
          false,
          "Gift set");
      product(
          products,
          catalog,
          "Salt & Smoke",
          "Atelier Noma",
          "Sea salt, smoked birch and a citrus opening.",
          "photo-1594035910387-fea47794261f",
          "Men",
          "New arrivals",
          15800,
          8,
          14,
          true,
          "50 ml");

      review(reviews, maya, nocturne, 5, "Wonderful long lasting scent.");
      review(reviews, noah, nocturne, 5, "Warm without being heavy. My everyday signature.");
      review(reviews, iris, velvet, 4, "Beautiful and fresh. The rose stays soft.");
      review(reviews, maya, cedar, 5, "Clean cedar and bergamot. Feels like the coast.");
      review(reviews, noah, golden, 5, "Vanilla and neroli, bright all evening.");
      review(reviews, iris, silk, 4, "Light and pretty. A little goes a long way.");
      review(reviews, maya, rain, 5, "Green and mineral. Exactly like the name.");

      coupons.save(coupon("WELCOME10", 10, 5000, LocalDate.now().plusYears(1)));
      coupons.save(coupon("AURELIA15", 15, 10000, LocalDate.now().plusMonths(6)));
      coupons.save(coupon("GIFT20", 20, 20000, LocalDate.now().plusMonths(3)));

      order(
          orders,
          maya,
          OrderStatus.DELIVERED,
          "8 Flower Road, Colombo 07",
          "0772000002",
          "Card",
          12,
          nocturne,
          1);
      order(
          orders,
          noah,
          OrderStatus.PENDING,
          "44 Kandy Road, Kandy",
          "0773000003",
          "Cash on delivery",
          1,
          cedar,
          1);
      order(
          orders,
          iris,
          OrderStatus.SHIPPED,
          "3 Beach Road, Galle",
          "0774000004",
          "Card",
          3,
          ritual,
          1);
    };
  }

  private static User user(
      PasswordEncoder encoder,
      String name,
      String email,
      String password,
      User.Role role,
      String phone,
      String address) {
    return User.builder()
        .name(name)
        .email(email)
        .password(encoder.encode(password))
        .role(role)
        .phone(phone)
        .address(address)
        .enabled(true)
        .build();
  }

  private static Category category(CategoryRepository categories, String name, String description) {
    return categories.save(Category.builder().name(name).description(description).build());
  }

  private static Product product(
      ProductRepository products,
      Map<String, Category> catalog,
      String name,
      String brand,
      String description,
      String imageId,
      String gender,
      String category,
      int price,
      Integer discountPercent,
      int stock,
      boolean featured,
      String size) {
    Instant now = Instant.now();
    return products.save(
        Product.builder()
            .name(name)
            .brand(brand)
            .description(description)
            .imageUrl("https://images.unsplash.com/" + imageId + "?auto=format&fit=crop&w=900&q=85")
            .gender(gender)
            .size(size)
            .price(BigDecimal.valueOf(price))
            .discountPercent(discountPercent == null ? null : BigDecimal.valueOf(discountPercent))
            .stock(stock)
            .stockQuantity(stock)
            .active(true)
            .featured(featured)
            .category(catalog.get(category))
            .createdAt(now)
            .updatedAt(now)
            .build());
  }

  private static void review(
      ReviewRepository reviews, User customer, Product product, int rating, String comment) {
    reviews.save(
        Review.builder()
            .customer(customer)
            .product(product)
            .rating(rating)
            .comment(comment)
            .createdAt(Instant.now())
            .build());
  }

  private static Coupon coupon(String code, int percent, int minimum, LocalDate expiry) {
    return Coupon.builder()
        .code(code)
        .discountPercent(BigDecimal.valueOf(percent))
        .minimumOrderValue(BigDecimal.valueOf(minimum))
        .expiryDate(expiry)
        .active(true)
        .build();
  }

  private static void order(
      OrderRepository orders,
      User customer,
      OrderStatus status,
      String address,
      String phone,
      String payment,
      int daysAgo,
      Product product,
      int quantity) {
    Order order =
        Order.builder()
            .customer(customer)
            .status(status)
            .shippingAddress(address)
            .shippingPhone(phone)
            .paymentMethod(payment)
            .createdAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS))
            .total(product.price.multiply(BigDecimal.valueOf(quantity)))
            .items(new ArrayList<>())
            .build();
    order.items.add(
        OrderItem.builder()
            .order(order)
            .product(product)
            .quantity(quantity)
            .unitPrice(product.price)
            .build());
    orders.save(order);
  }
}
