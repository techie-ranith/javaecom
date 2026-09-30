package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {
  private final SecretKey key;

  public JwtFilter(@Value("${app.jwt.secret}") String s) {
    key = Keys.hmacShaKeyFor(s.getBytes());
  }

  protected void doFilterInternal(HttpServletRequest r, HttpServletResponse p, FilterChain c)
      throws ServletException, IOException {
    String h = r.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer "))
      try {
        Claims x =
            Jwts.parser().verifyWith(key).build().parseSignedClaims(h.substring(7)).getPayload();
        var a =
            new UsernamePasswordAuthenticationToken(
                x.getSubject(), null, List.of(new SimpleGrantedAuthority("ROLE_" + x.get("role"))));
        SecurityContextHolder.getContext().setAuthentication(a);
      } catch (Exception ignored) {
      }
    c.doFilter(r, p);
  }
}
