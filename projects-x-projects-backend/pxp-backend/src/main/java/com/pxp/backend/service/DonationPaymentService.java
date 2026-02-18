package com.pxp.backend.service;

import com.pxp.backend.entity.Donation;
import com.pxp.backend.entity.DonationStatus;
import com.pxp.backend.repo.DonationRepository;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.web.dto.CreateDonationCheckoutRequest;
import com.pxp.backend.web.dto.CreateDonationCheckoutResponse;
import com.pxp.backend.web.dto.DonationSessionStatusResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DonationPaymentService {

  private final DonationRepository donationRepo;
  private final ProjectRepository projectRepo;

  @Value("${pxp.site-url}")
  private String siteUrl;

  @Value("${stripe.currency:cad}")
  private String defaultCurrency;

  public DonationPaymentService(DonationRepository donationRepo, ProjectRepository projectRepo) {
    this.donationRepo = donationRepo;
    this.projectRepo = projectRepo;
  }

  private String noSlash(String s) {
    return (s != null && s.endsWith("/")) ? s.substring(0, s.length() - 1) : s;
  }

  public CreateDonationCheckoutResponse createEmbeddedCheckout(CreateDonationCheckoutRequest req) throws StripeException {
    if (req == null || req.amountCents == null) throw new IllegalArgumentException("amountCents is required");

    long amount = req.amountCents;
    if (amount < 100) throw new IllegalArgumentException("Minimum donation is $1.00");
    if (amount > 5_000_000) throw new IllegalArgumentException("Maximum donation is $50,000.00");

    String currency = (req.currency == null || req.currency.isBlank()) ? defaultCurrency : req.currency.toLowerCase();

    Donation d = new Donation();
    d.setAmountCents(amount);
    d.setCurrency(currency);
    d.setStatus(DonationStatus.PENDING);

    if (req.projectId != null) {
      var p = projectRepo.findById(req.projectId).orElseThrow(() -> new IllegalArgumentException("Project not found"));
      d.setProject(p);
    }

    d = donationRepo.save(d);

    String returnUrl = noSlash(siteUrl) + "/donate/complete?session_id={CHECKOUT_SESSION_ID}";

    String productName = (d.getProject() != null)
      ? ("Donation to " + d.getProject().getTitle())
      : "Donation to Projects X Projects";

    SessionCreateParams.LineItem.PriceData.ProductData productData =
      SessionCreateParams.LineItem.PriceData.ProductData.builder()
        .setName(productName)
        .build();

    SessionCreateParams.LineItem.PriceData priceData =
      SessionCreateParams.LineItem.PriceData.builder()
        .setCurrency(currency)
        .setUnitAmount(amount)
        .setProductData(productData)
        .build();

    SessionCreateParams.LineItem lineItem =
      SessionCreateParams.LineItem.builder()
        .setQuantity(1L)
        .setPriceData(priceData)
        .build();

    SessionCreateParams.Builder builder = SessionCreateParams.builder()
      .setMode(SessionCreateParams.Mode.PAYMENT)
      .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
      .setReturnUrl(returnUrl)
      .setRedirectOnCompletion(SessionCreateParams.RedirectOnCompletion.IF_REQUIRED)
      .addLineItem(lineItem)
      .setClientReferenceId(String.valueOf(d.getId()))
      .putMetadata("donationId", String.valueOf(d.getId()));
    
    SessionCreateParams.PaymentIntentData.Builder pid = SessionCreateParams.PaymentIntentData.builder()
	    .putMetadata("donationId", String.valueOf(d.getId()));

    if (d.getProject() != null) {
      pid.putMetadata("projectId", String.valueOf(d.getProject().getId()));
      pid.putMetadata("projectTitle", d.getProject().getTitle());
    }
    
    builder.setPaymentIntentData(pid.build());

    Session session = Session.create(builder.build());

    d.setStripeSessionId(session.getId());
    donationRepo.save(d);

    // client_secret is what the browser needs for embedded checkout
    return new CreateDonationCheckoutResponse(d.getId(), session.getId(), session.getClientSecret());
  }

  public DonationSessionStatusResponse statusBySessionId(String sessionId) {
    var d = donationRepo.findByStripeSessionId(sessionId).orElse(null);
    if (d == null) throw new IllegalArgumentException("Donation not found for sessionId");
    return new DonationSessionStatusResponse(d.getStatus().name(), d.getAmountCents(), d.getCurrency());
  }
}