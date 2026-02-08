package com.pxp.backend.service;

import com.pxp.backend.entity.Subscriber;
import com.pxp.backend.entity.SubscriberStatus;
import com.pxp.backend.repo.SubscriberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class SubscriberService {

  private final SubscriberRepository repo;
  private final TokenService tokens;
  private final EmailOutboxService outbox;

  @Value("${pxp.site-url}")
  private String siteUrl;

  public SubscriberService(SubscriberRepository repo, TokenService tokens, EmailOutboxService outbox) {
    this.repo = repo;
    this.tokens = tokens;
    this.outbox = outbox;
  }

  public void subscribe(String emailRaw) {
    String email = normalizeEmail(emailRaw);

    var existing = repo.findByEmailIgnoreCase(email).orElse(null);

    if (existing != null) {
      if (existing.getStatus() == SubscriberStatus.ACTIVE) {
        return; // already subscribed
      }
      if (existing.getStatus() == SubscriberStatus.PENDING) {
        // resend verify
        sendVerify(existing);
        return;
      }
      // UNSUBSCRIBED -> re-subscribe
      existing.setStatus(SubscriberStatus.PENDING);
      existing.setUnsubscribedAt(null);
      existing.setVerifyToken(tokens.newToken());
      // keep same unsubscribe token (or regenerate; either works)
      repo.save(existing);
      sendVerify(existing);
      return;
    }

    Subscriber s = new Subscriber();
    s.setEmail(email);
    s.setStatus(SubscriberStatus.PENDING);
    s.setVerifyToken(tokens.newToken());
    s.setUnsubscribeToken(tokens.newToken());
    repo.save(s);

    sendVerify(s);
  }

  public boolean verify(String token) {
    var s = repo.findByVerifyToken(token).orElse(null);
    if (s == null) return false;
    if (s.getStatus() == SubscriberStatus.ACTIVE) return true;

    s.setStatus(SubscriberStatus.ACTIVE);
    s.setVerifiedAt(OffsetDateTime.now());
    s.setVerifyToken(null); // one-time
    repo.save(s);
    return true;
  }

  public boolean unsubscribe(String token) {
    var s = repo.findByUnsubscribeToken(token).orElse(null);
    if (s == null) return false;

    s.setStatus(SubscriberStatus.UNSUBSCRIBED);
    s.setUnsubscribedAt(OffsetDateTime.now());
    s.setVerifyToken(null);
    repo.save(s);
    return true;
  }

  private void sendVerify(Subscriber s) {
	  String verifyLink = siteUrlNoSlash() + "/subscribe/verify?token=" + s.getVerifyToken();
	  String unsubLink  = siteUrlNoSlash() + "/subscribe/unsubscribe?token=" + s.getUnsubscribeToken();

    String subject = "Confirm your subscription to Project X Projects";
    String body =
      "Hello,\n\n" +
      "Please confirm your subscription to Project X Projects updates:\n" +
      verifyLink + "\n\n" +
      "If you didn’t request this, you can ignore this email.\n\n" +
      "Unsubscribe at any time:\n" +
      unsubLink + "\n";

    outbox.queue(s.getEmail(), subject, body);
  }

  private String apiLink(String path) {
    String base = siteUrl.endsWith("/") ? siteUrl.substring(0, siteUrl.length() - 1) : siteUrl;
    // Assumption: your site and API are on the same domain in prod (or reverse-proxied).
    // In dev, you can set SITE_URL to http://localhost:8080 to test clicks.
    return base + path;
  }

  private String normalizeEmail(String e) {
    if (e == null) throw new IllegalArgumentException("Email is required");
    String email = e.trim().toLowerCase();
    if (!email.contains("@") || email.length() > 254) throw new IllegalArgumentException("Invalid email");
    return email;
  }
  
  private String siteUrlNoSlash() {
	  return siteUrl.endsWith("/") ? siteUrl.substring(0, siteUrl.length() - 1) : siteUrl;
	}
}
