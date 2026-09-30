package com.example.demo.service;

import com.example.demo.dto.CatalogDtos.*;
import com.example.demo.entity.*;
import com.example.demo.mapper.StoreMapper;
import com.example.demo.repository.*;
import java.math.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class CatalogService {
  final ProductRepository p;
  final CategoryRepository c;
  final ReviewRepository r;
  final StoreMapper m;

  CatalogService(ProductRepository p, CategoryRepository c, ReviewRepository r, StoreMapper m) {
    this.p = p;
    this.c = c;
    this.r = r;
    this.m = m;
  }

  public Page<ProductDto> search(
      String q,
      String category,
      String gender,
      BigDecimal min,
      BigDecimal max,
      boolean featured,
      Pageable pg) {
    var all =
        p.findAll().stream()
            .filter(x -> x.active)
            .filter(
                x ->
                    q.isBlank()
                        || x.name.toLowerCase().contains(q.toLowerCase())
                        || (x.brand != null && x.brand.toLowerCase().contains(q.toLowerCase())))
            .filter(
                x ->
                    category == null
                        || x.category != null && x.category.name.equalsIgnoreCase(category))
            .filter(x -> gender == null || gender.equalsIgnoreCase(x.gender))
            .filter(x -> min == null || x.price.compareTo(min) >= 0)
            .filter(x -> max == null || x.price.compareTo(max) <= 0)
            .filter(x -> !featured || x.featured)
            .toList();
    int from = (int) pg.getOffset(), to = Math.min(from + pg.getPageSize(), all.size());
    return new PageImpl<>(
        (from >= all.size() ? List.<Product>of() : all.subList(from, to))
            .stream().map(m::product).toList(),
        pg,
        all.size());
  }

  public ProductDto get(Long id) {
    return m.product(
        p.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found")));
  }

  public List<CategoryDto> categories() {
    return c.findAll().stream().map(m::category).toList();
  }

  public List<ReviewDto> reviews(Long id) {
    return r.findAll().stream().filter(x -> x.product.id.equals(id)).map(m::review).toList();
  }
}
