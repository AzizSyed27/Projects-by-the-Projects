package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "email_outbox")
public class EmailOutbox {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "to_email", nullable = false, length = 254)
  private String toEmail;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String subject;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String body;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private OutboxStatus status = OutboxStatus.PENDING;

  @Column(nullable = false)
  private Integer attempts = 0;

  @Column(name = "last_error", columnDefinition = "TEXT")
  private String lastError;

  @Column(name = "next_attempt_at", nullable = false)
  private OffsetDateTime nextAttemptAt;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "sent_at")
  private OffsetDateTime sentAt;

  @PrePersist
  void onCreate() {
    var now = OffsetDateTime.now();
    if (createdAt == null) createdAt = now;
    if (nextAttemptAt == null) nextAttemptAt = now;
  }

  public Long getId() { return id; }

  public String getToEmail() { return toEmail; }
  public void setToEmail(String toEmail) { this.toEmail = toEmail; }

  public String getSubject() { return subject; }
  public void setSubject(String subject) { this.subject = subject; }

  public String getBody() { return body; }
  public void setBody(String body) { this.body = body; }

  public OutboxStatus getStatus() { return status; }
  public void setStatus(OutboxStatus status) { this.status = status; }

  public Integer getAttempts() { return attempts; }
  public void setAttempts(Integer attempts) { this.attempts = attempts; }

  public String getLastError() { return lastError; }
  public void setLastError(String lastError) { this.lastError = lastError; }

  public OffsetDateTime getNextAttemptAt() { return nextAttemptAt; }
  public void setNextAttemptAt(OffsetDateTime nextAttemptAt) { this.nextAttemptAt = nextAttemptAt; }

  public OffsetDateTime getSentAt() { return sentAt; }
  public void setSentAt(OffsetDateTime sentAt) { this.sentAt = sentAt; }
}
