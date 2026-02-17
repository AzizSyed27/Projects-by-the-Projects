package com.pxp.backend.web;

import com.pxp.backend.service.DonationPaymentService;
import com.pxp.backend.web.dto.CreateDonationCheckoutRequest;
import com.pxp.backend.web.dto.CreateDonationCheckoutResponse;
import com.pxp.backend.web.dto.DonationSessionStatusResponse;
import com.stripe.exception.StripeException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

  private final DonationPaymentService payments;

  public DonationController(DonationPaymentService payments) {
    this.payments = payments;
  }

  @PostMapping("/checkout-session")
  public CreateDonationCheckoutResponse create(@RequestBody CreateDonationCheckoutRequest req) throws StripeException {
    return payments.createEmbeddedCheckout(req);
  }

  @GetMapping("/session-status")
  public DonationSessionStatusResponse status(@RequestParam String sessionId) {
    return payments.statusBySessionId(sessionId);
  }
}
