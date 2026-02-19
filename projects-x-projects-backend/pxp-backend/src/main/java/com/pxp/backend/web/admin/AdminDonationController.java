package com.pxp.backend.web.admin;

import com.pxp.backend.entity.Donation;
import com.pxp.backend.entity.DonationStatus;
import com.pxp.backend.repo.DonationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/donations")
public class AdminDonationController {

  private final DonationRepository repo;

  public AdminDonationController(DonationRepository repo) {
    this.repo = repo;
  }

  public record DonationRow(
    Long id,
    String createdAt,
    Long amountCents,
    String currency,
    String status,
    Long projectId,
    String projectTitle,
    String customerEmail,
    String stripeSessionId
  ) {}

  public record DonationStats(
    Long totalPaidCents,
    Long countPaid
  ) {}

  @GetMapping
  public List<DonationRow> list(
    @RequestParam(required = false) String status,
    @RequestParam(required = false) Long projectId
  ) {
    var sort = Sort.by(Sort.Direction.DESC, "createdAt");

    List<Donation> list = repo.findAll(sort);

    // Simple filtering in-memory for MVP (fast to ship).
    // If you want pagination + DB-side filtering next, we can upgrade immediately.
    if (status != null && !status.isBlank()) {
      list = list.stream()
        .filter(d -> d.getStatus() != null && d.getStatus().name().equalsIgnoreCase(status))
        .toList();
    }

    if (projectId != null) {
      list = list.stream()
        .filter(d -> d.getProject() != null && projectId.equals(d.getProject().getId()))
        .toList();
    }

    return list.stream().map(d -> new DonationRow(
      d.getId(),
      d.getCreatedAt() != null ? d.getCreatedAt().toString() : "",
      d.getAmountCents(),
      d.getCurrency(),
      d.getStatus() != null ? d.getStatus().name() : "",
      d.getProject() != null ? d.getProject().getId() : null,
      d.getProject() != null ? d.getProject().getTitle() : "General",
      d.getCustomerEmail(),
      d.getStripeSessionId()
    )).toList();
  }

  @GetMapping("/stats")
  public DonationStats stats(
    @RequestParam(required = false) Long projectId,
    @RequestParam(required = false) String fromDate, // YYYY-MM-DD
    @RequestParam(required = false) String toDate    // YYYY-MM-DD
  ) {
    ZoneId zone = ZoneId.of("America/Toronto");
    OffsetDateTime from = null;
    OffsetDateTime to = null;

    if (fromDate != null && !fromDate.isBlank()) {
      LocalDate d = LocalDate.parse(fromDate);
      from = d.atStartOfDay(zone).toOffsetDateTime();
    }

    if (toDate != null && !toDate.isBlank()) {
      LocalDate d = LocalDate.parse(toDate);
      to = d.atTime(LocalTime.MAX).atZone(zone).toOffsetDateTime();
    }

    long pid = (projectId == null) ? -1L : projectId;

    Long total = repo.sumPaid(DonationStatus.PAID, pid, from, to);
    Long count = repo.countPaid(DonationStatus.PAID, pid, from, to);
    
    return new DonationStats(total == null ? 0L : total, count == null ? 0L : count);
  }
}
