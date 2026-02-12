package com.pxp.backend.service;

import com.pxp.backend.entity.OutboxStatus;
import com.pxp.backend.repo.EmailOutboxRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.nio.charset.StandardCharsets;
	
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class EmailSenderJob {

  private final EmailOutboxRepository repo;
  private final JavaMailSender mailSender;

  @Value("${pxp.mail.from}")
  private String from;

  public EmailSenderJob(EmailOutboxRepository repo, JavaMailSender mailSender) {
    this.repo = repo;
    this.mailSender = mailSender;
  }

  // every 30 seconds
  @Scheduled(fixedDelay = 30000)
  @Transactional
  public void run() {
    var now = OffsetDateTime.now();
    var batch = repo.findDue(OutboxStatus.PENDING, now);

    int sent = 0;
    for (var e : batch) {
      if (sent >= 30) break; // safety cap per run

      try {
		  MimeMessage mm = mailSender.createMimeMessage();
		  MimeMessageHelper helper = new MimeMessageHelper(mm, true, StandardCharsets.UTF_8.name());
		
		  helper.setFrom(from); // e.g. "Project X Projects <info@projectsxprojects.ca>"
		  helper.setTo(e.getToEmail());
		  helper.setSubject(e.getSubject());
		
		  // text fallback + HTML if present
		  if (e.getHtmlBody() != null && !e.getHtmlBody().isBlank()) {
		    helper.setText(e.getBody(), e.getHtmlBody());
		  } else {
		    helper.setText(e.getBody(), false);
		  }
		
		  // Adds Gmail/Apple Mail “Unsubscribe” button if supported
		  if (e.getListUnsubscribe() != null && !e.getListUnsubscribe().isBlank()) {
		    mm.addHeader("List-Unsubscribe", "<" + e.getListUnsubscribe() + ">");
		  }
		
		  mailSender.send(mm);

        e.setStatus(OutboxStatus.SENT);
        e.setSentAt(OffsetDateTime.now());
        e.setLastError(null);
        sent++;
      } catch (Exception ex) {
        int attempts = (e.getAttempts() == null ? 0 : e.getAttempts()) + 1;
        e.setAttempts(attempts);
        e.setLastError(ex.getMessage());

        // basic exponential backoff, capped
        int minutes = Math.min(60, (int) Math.pow(2, Math.min(attempts, 6)));
        e.setNextAttemptAt(OffsetDateTime.now().plusMinutes(minutes));

        // after enough attempts, mark FAILED (keeps history)
        if (attempts >= 8) {
          e.setStatus(OutboxStatus.FAILED);
        }
      }
    }
  }
}
