package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.service.CatalogService;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CatalogController {
  final CatalogService s;

  CatalogController(CatalogService s) {
    this.s = s;
  }

  @GetMapping("/products")
  ApiResponse<Page<ProductDto>> products(
      @RequestParam(defaultValue = "") String q,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String gender,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(defaultValue = "false") boolean featured,
      Pageable page) {
    return ApiResponse.ok(s.search(q, category, gender, minPrice, maxPrice, featured, page));
  }

  @GetMapping("/products/{id}")
  ApiResponse<ProductDto> product(@PathVariable Long id) {
    return ApiResponse.ok(s.get(id));
  }

  @GetMapping("/products/{id}/reviews")
  ApiResponse<List<ReviewDto>> reviews(@PathVariable Long id) {
    return ApiResponse.ok(s.reviews(id));
  }

  @GetMapping("/categories")
  ApiResponse<List<CategoryDto>> categories() {
    return ApiResponse.ok(s.categories());
  }
}
