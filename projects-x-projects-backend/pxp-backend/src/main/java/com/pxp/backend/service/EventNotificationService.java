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
  private final EmailTemplateService templates;

  @Value("${pxp.site-url}")
  private String siteUrl;

  @Value("${pxp.api-public-url:http://localhost:8080}")
  private String apiPublicUrl;

  public EventNotificationService(SubscriberRepository subscriberRepo, EmailOutboxService outbox, EmailTemplateService templates) {
	  this.subscriberRepo = subscriberRepo;
	  this.outbox = outbox;
	  this.templates = templates;
  }

  private String noSlash(String s){
    return s != null && s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
  }

  public void notifyUpcoming(Event event) {
	  var subs = subscriberRepo.findByStatus(SubscriberStatus.ACTIVE);

	  for (var s : subs) {
	    String unsubLink = noSlash(apiPublicUrl) + "/api/subscribers/unsubscribe?token=" + s.getUnsubscribeToken();
	    var email = templates.upcomingEvent(event, unsubLink);
	    outbox.queueHtml(s.getEmail(), email.subject(), email.textBody(), email.htmlBody(), email.listUnsubscribe());
	  }
  }
}

