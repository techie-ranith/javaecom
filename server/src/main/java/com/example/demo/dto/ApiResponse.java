package com.example.demo.dto;

public record ApiResponse<T>(boolean success, String message, T data) {
  public static <T> ApiResponse<T> ok(T d) {
    return new ApiResponse<>(true, "OK", d);
  }

  public static <T> ApiResponse<T> ok(String m, T d) {
    return new ApiResponse<>(true, m, d);
  }
}
