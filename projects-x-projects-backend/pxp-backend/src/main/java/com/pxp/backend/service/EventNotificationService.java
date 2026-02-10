package com.pxp.backend.service;

import com.pxp.backend.entity.Event;
import com.pxp.backend.entity.SubscriberStatus;
import com.pxp.backend.repo.SubscriberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EventNotificationService {

  private final SubscriberRepository subscriberRepo;
  private final EmailOutboxService outbox;

  @Value("${pxp.site-url}")
  private String siteUrl;

  @Value("${pxp.api-public-url:http://localhost:8080}")
  private String apiPublicUrl;

  public EventNotificationService(SubscriberRepository subscriberRepo, EmailOutboxService outbox) {
    this.subscriberRepo = subscriberRepo;
    this.outbox = outbox;
  }

  private String noSlash(String s){
    return s != null && s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
  }

  public void notifyUpcoming(Event event) {
    var subs = subscriberRepo.findByStatus(SubscriberStatus.ACTIVE);

    String subject = "Upcoming event: " + event.getTitle();

    String dateStr = event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
    String where = (event.getLocation() == null || event.getLocation().isBlank()) ? "Location TBD" : event.getLocation();

    // since you don’t have per-event pages, send them to your site section (adjust later)
    String viewLink = noSlash(siteUrl) + "/projects";
    String unsubBase = noSlash(apiPublicUrl) + "/api/subscribers/unsubscribe?token=";

    for (var s : subs) {
      String body =
        "Hello,\n\n" +
        "We have an upcoming event:\n\n" +
        event.getTitle() + "\n" +
        dateStr + "\n" +
        where + "\n\n" +
        (event.getShortDesc() != null ? event.getShortDesc() + "\n\n" : "") +
        "See details on our website:\n" +
        viewLink + "\n\n" +
        "Unsubscribe:\n" +
        unsubBase + s.getUnsubscribeToken() + "\n";

      outbox.queue(s.getEmail(), subject, body);
    }
  }
}

