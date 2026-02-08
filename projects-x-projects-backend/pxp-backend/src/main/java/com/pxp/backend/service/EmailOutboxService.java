package com.pxp.backend.service;

import com.pxp.backend.entity.EmailOutbox;
import com.pxp.backend.repo.EmailOutboxRepository;
import org.springframework.stereotype.Service;

@Service
public class EmailOutboxService {

  private final EmailOutboxRepository repo;

  public EmailOutboxService(EmailOutboxRepository repo) {
    this.repo = repo;
  }

  public void queue(String toEmail, String subject, String body) {
    EmailOutbox e = new EmailOutbox();
    e.setToEmail(toEmail);
    e.setSubject(subject);
    e.setBody(body);
    repo.save(e);
  }
}
