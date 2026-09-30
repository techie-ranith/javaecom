package com.example.demo.exception;

import com.example.demo.dto.ApiResponse;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private ResponseEntity<ApiResponse<Object>> r(HttpStatus s, String m) {
    return ResponseEntity.status(s).body(new ApiResponse<>(false, m, null));
  }

  @ExceptionHandler(NoSuchElementException.class)
  ResponseEntity<ApiResponse<Object>> notFound(Exception e) {
    return r(HttpStatus.NOT_FOUND, e.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  ResponseEntity<ApiResponse<Object>> conflict(Exception e) {
    return r(HttpStatus.CONFLICT, e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse<Object>> validation(MethodArgumentNotValidException e) {
    return r(
        HttpStatus.BAD_REQUEST,
        e.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(x -> x.getField() + ": " + x.getDefaultMessage())
            .orElse("Validation failed"));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiResponse<Object>> other(Exception e) {
    return r(HttpStatus.BAD_REQUEST, e.getMessage() == null ? "Request failed" : e.getMessage());
  }
}
