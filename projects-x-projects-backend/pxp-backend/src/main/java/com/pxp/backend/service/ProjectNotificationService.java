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
  
  @Value("${pxp.site-url}") private String siteUrl;

  public ProjectNotificationService(SubscriberRepository subscriberRepo, EmailOutboxService outbox) {
    this.subscriberRepo = subscriberRepo;
    this.outbox = outbox;
  }

  public void notifyNewProject(Project project) {
    var subs = subscriberRepo.findByStatus(SubscriberStatus.ACTIVE);

    String subject = "New project underway: " + project.getTitle();
    String projectUrl = siteUrlNoSlash() + "/projects/" + project.getSlug();

    for (var s : subs) {
    	String unsubLink  = siteUrlNoSlash() + "/subscribe/unsubscribe?token=" + s.getUnsubscribeToken();
      String body =
        "Hello,\n\n" +
        "A new project is underway:\n" +
        project.getTitle() + "\n\n" +
        "View project:\n" +
        projectUrl + "\n\n" +
        "Unsubscribe:\n" +
        unsubLink + "\n";
      outbox.queue(s.getEmail(), subject, body);
    }
  }
  
  private String siteUrlNoSlash() {
	  return siteUrl.endsWith("/") ? siteUrl.substring(0, siteUrl.length() - 1) : siteUrl;
	}
}
