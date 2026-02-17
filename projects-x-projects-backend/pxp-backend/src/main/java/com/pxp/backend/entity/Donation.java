package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "donations")
public class Donation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id")
  private Project project;

  @Column(name = "amount_cents", nullable = false)
  private Long amountCents;

  @Column(nullable = false, length = 3)
  private String currency = "cad";

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private DonationStatus status = DonationStatus.CREATED;

  @Column(name = "stripe_session_id", columnDefinition = "TEXT", unique = true)
  private String stripeSessionId;

  @Column(name = "stripe_payment_intent_id", columnDefinition = "TEXT")
  private String stripePaymentIntentId;

  @Column(name = "customer_email", length = 320)
  private String customerEmail;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "paid_at")
  private OffsetDateTime paidAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) createdAt = OffsetDateTime.now();
  }

  // getters/setters
  public Long getId() { return id; }

  public Project getProject() { return project; }
  public void setProject(Project project) { this.project = project; }

  public Long getAmountCents() { return amountCents; }
  public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }

  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }

  public DonationStatus getStatus() { return status; }
  public void setStatus(DonationStatus status) { this.status = status; }

  public String getStripeSessionId() { return stripeSessionId; }
  public void setStripeSessionId(String stripeSessionId) { this.stripeSessionId = stripeSessionId; }

  public String getStripePaymentIntentId() { return stripePaymentIntentId; }
  public void setStripePaymentIntentId(String stripePaymentIntentId) { this.stripePaymentIntentId = stripePaymentIntentId; }

  public String getCustomerEmail() { return customerEmail; }
  public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

  public OffsetDateTime getPaidAt() { return paidAt; }
  public void setPaidAt(OffsetDateTime paidAt) { this.paidAt = paidAt; }
}
