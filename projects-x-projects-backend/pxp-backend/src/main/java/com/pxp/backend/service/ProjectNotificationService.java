package com.pxp.backend.service;

import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.SubscriberStatus;
import com.pxp.backend.repo.SubscriberRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ProjectNotificationService {
	
	

  private final SubscriberRepository subscriberRepo;
  private final EmailOutboxService outbox;
  private final EmailTemplateService templates;
  
  @Value("${pxp.site-url}") private String siteUrl;

  public ProjectNotificationService(SubscriberRepository subscriberRepo, EmailOutboxService outbox, EmailTemplateService templates) {
	  this.subscriberRepo = subscriberRepo;
	  this.outbox = outbox;
	  this.templates = templates;
  }

  public void notifyNewProject(Project project) {
	  var subs = subscriberRepo.findByStatus(SubscriberStatus.ACTIVE);

	  for (var s : subs) {
	    String unsubLink = siteUrlNoSlash() + "/subscribe/unsubscribe?token=" + s.getUnsubscribeToken();
	    var email = templates.newProject(project, unsubLink);
	    outbox.queueHtml(s.getEmail(), email.subject(), email.textBody(), email.htmlBody(), email.listUnsubscribe());
	  }
  }
  
  private String siteUrlNoSlash() {
	  return siteUrl.endsWith("/") ? siteUrl.substring(0, siteUrl.length() - 1) : siteUrl;
	}
}
