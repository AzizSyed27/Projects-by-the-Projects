package com.pxp.backend.web;

import com.pxp.backend.entity.DonationStatus;
import com.pxp.backend.repo.DonationRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {

  private final DonationRepository donationRepo;

  @Value("${stripe.webhook-secret}")
  private String webhookSecret;

  public StripeWebhookController(DonationRepository donationRepo) {
    this.donationRepo = donationRepo;
  }

  @PostMapping("/webhook")
  public ResponseEntity<String> webhook(
    @RequestBody String payload,
    @RequestHeader("Stripe-Signature") String sigHeader
  ) {
    final Event event;
    try {
      event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
    } catch (SignatureVerificationException e) {
      return ResponseEntity.status(400).body("Invalid signature");
    }

    switch (event.getType()) {
      case "checkout.session.completed" -> handleCheckoutCompleted(event);
      case "checkout.session.expired" -> handleCheckoutExpired(event);
      case "checkout.session.async_payment_failed" -> handleAsyncFailed(event);
      default -> { /* ignore */ }
    }

    return ResponseEntity.ok("ok");
  }

  private void handleCheckoutCompleted(Event event) {
    StripeObject obj = event.getDataObjectDeserializer().getObject().orElse(null);
    if (!(obj instanceof Session session)) return;

    String sessionId = session.getId();

    var dOpt = donationRepo.findByStripeSessionId(sessionId);
    if (dOpt.isEmpty()) return;

    var d = dOpt.get();
    if (d.getStatus() == DonationStatus.PAID) return; // idempotent

    // Stripe is source of truth
    if (session.getAmountTotal() != null) d.setAmountCents(session.getAmountTotal());
    if (session.getCurrency() != null) d.setCurrency(session.getCurrency());

    d.setStripePaymentIntentId(session.getPaymentIntent());

    if (session.getCustomerDetails() != null) {
      d.setCustomerEmail(session.getCustomerDetails().getEmail());
    }

    d.setStatus(DonationStatus.PAID);
    d.setPaidAt(OffsetDateTime.now());
    donationRepo.save(d);
  }

  private void handleCheckoutExpired(Event event) {
    StripeObject obj = event.getDataObjectDeserializer().getObject().orElse(null);
    if (!(obj instanceof Session session)) return;

    donationRepo.findByStripeSessionId(session.getId()).ifPresent(d -> {
      if (d.getStatus() == DonationStatus.PAID) return;
      d.setStatus(DonationStatus.EXPIRED);
      donationRepo.save(d);
    });
  }

  private void handleAsyncFailed(Event event) {
    StripeObject obj = event.getDataObjectDeserializer().getObject().orElse(null);
    if (!(obj instanceof Session session)) return;

    donationRepo.findByStripeSessionId(session.getId()).ifPresent(d -> {
      if (d.getStatus() == DonationStatus.PAID) return;
      d.setStatus(DonationStatus.FAILED);
      donationRepo.save(d);
    });
  }
}
