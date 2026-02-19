package com.pxp.backend.service;

import com.pxp.backend.entity.Donation;
import com.pxp.backend.entity.DonationStatus;
import com.pxp.backend.repo.DonationRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class DonationReceiptService {

  private final DonationRepository donationRepo;
  private final EmailOutboxService outbox;
  private final EmailTemplateService templates;

  public DonationReceiptService(DonationRepository donationRepo, EmailOutboxService outbox, EmailTemplateService templates) {
    this.donationRepo = donationRepo;
    this.outbox = outbox;
    this.templates = templates;
  }

  public void queueReceiptIfNeeded(Donation d) {
    if (d == null) return;
    if (d.getStatus() != DonationStatus.PAID) return;
    if (d.getCustomerEmail() == null || d.getCustomerEmail().isBlank()) return;
    if (d.getReceiptEmailSentAt() != null) return; 

    String projectTitle = (d.getProject() != null) ? d.getProject().getTitle() : null;

    var email = templates.donationReceipt(
      d.getCustomerEmail(),
      d.getAmountCents(),
      d.getCurrency(),
      projectTitle
    );

    outbox.queueHtml(d.getCustomerEmail(), email.subject(), email.textBody(), email.htmlBody(), null);

    d.setReceiptEmailSentAt(OffsetDateTime.now());
    donationRepo.save(d);
  }
}
