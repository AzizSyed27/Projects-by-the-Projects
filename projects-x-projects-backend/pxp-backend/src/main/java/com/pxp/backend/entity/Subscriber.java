package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "subscribers")
public class Subscriber {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 254)
  private String email;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private SubscriberStatus status = SubscriberStatus.PENDING;

  @Column(name = "verify_token", columnDefinition = "TEXT")
  private String verifyToken;

  @Column(name = "unsubscribe_token", nullable = false, columnDefinition = "TEXT")
  private String unsubscribeToken;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "verified_at")
  private OffsetDateTime verifiedAt;

  @Column(name = "unsubscribed_at")
  private OffsetDateTime unsubscribedAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) createdAt = OffsetDateTime.now();
  }

  public Long getId() { return id; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public SubscriberStatus getStatus() { return status; }
  public void setStatus(SubscriberStatus status) { this.status = status; }

  public String getVerifyToken() { return verifyToken; }
  public void setVerifyToken(String verifyToken) { this.verifyToken = verifyToken; }

  public String getUnsubscribeToken() { return unsubscribeToken; }
  public void setUnsubscribeToken(String unsubscribeToken) { this.unsubscribeToken = unsubscribeToken; }

  public OffsetDateTime getVerifiedAt() { return verifiedAt; }
  public void setVerifiedAt(OffsetDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

  public OffsetDateTime getUnsubscribedAt() { return unsubscribedAt; }
  public void setUnsubscribedAt(OffsetDateTime unsubscribedAt) { this.unsubscribedAt = unsubscribedAt; }
}
