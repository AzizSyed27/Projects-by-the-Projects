package com.pxp.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  private final Key key;
  private final long expiresMinutes;

  public JwtService(
    @Value("${pxp.jwt.secret}") String secret,
    @Value("${pxp.jwt.expires-minutes}") long expiresMinutes
  ) {
    // secret must be long enough for HMAC-SHA (use 32+ chars)
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expiresMinutes = expiresMinutes;
  }

  public String generateToken(String username, String role) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(expiresMinutes * 60);

    return Jwts.builder()
      .subject(username)
      .claims(Map.of("role", role))
      .issuedAt(Date.from(now))
      .expiration(Date.from(exp))
      .signWith(key)
      .compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parser()
      .verifyWith((javax.crypto.SecretKey) key)
      .build()
      .parseSignedClaims(token);
  }

  public long getExpiresMinutes() {
    return expiresMinutes;
  }
}
