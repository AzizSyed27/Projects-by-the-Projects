package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "admin_users")
public class AdminUser {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 80)
  private String username;

  @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
  private String passwordHash;

  @Column(nullable = false, length = 30)
  private String role = "ADMIN";

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "last_login_at")
  private OffsetDateTime lastLoginAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) createdAt = OffsetDateTime.now();
  }

  public Long getId() { return id; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public OffsetDateTime getLastLoginAt() { return lastLoginAt; }
  public void setLastLoginAt(OffsetDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
