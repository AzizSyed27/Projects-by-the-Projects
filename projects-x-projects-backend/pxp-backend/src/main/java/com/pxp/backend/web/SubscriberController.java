package com.pxp.backend.web;

import com.pxp.backend.service.SubscriberService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/subscribers")
public class SubscriberController {

  private final SubscriberService service;

  public SubscriberController(SubscriberService service) {
    this.service = service;
  }

  public record SubscribeRequest(@NotBlank @Email String email) {}

  @PostMapping
  public java.util.Map<String, Object> subscribe(@RequestBody SubscribeRequest req) {
    service.subscribe(req.email());
    return java.util.Map.of(
      "ok", true,
      "message", "Check your email to confirm your subscription."
    );
  }

  // Clicked from email
  @GetMapping(value = "/verify", produces = MediaType.TEXT_HTML_VALUE)
  public String verify(@RequestParam String token) {
    boolean ok = service.verify(token);
    return """
      <html><body style="font-family:system-ui;padding:24px;">
        <h2>%s</h2>
        <p>You can close this tab.</p>
      </body></html>
    """.formatted(ok ? "Subscription confirmed" : "Invalid or expired link");
  }

  @GetMapping(value = "/unsubscribe", produces = MediaType.TEXT_HTML_VALUE)
  public String unsubscribe(@RequestParam String token) {
    boolean ok = service.unsubscribe(token);
    return """
      <html><body style="font-family:system-ui;padding:24px;">
        <h2>%s</h2>
        <p>You can close this tab.</p>
      </body></html>
    """.formatted(ok ? "You’ve been unsubscribed" : "Invalid link");
  }
  
  @PostMapping("/verify")
  public java.util.Map<String, Object> verifyJson(@RequestBody java.util.Map<String, String> body) {
    String token = body.get("token");
    boolean ok = service.verify(token);
    return java.util.Map.of(
      "ok", ok,
      "message", ok ? "Subscription confirmed." : "Invalid or expired link."
    );
  }

  @PostMapping("/unsubscribe")
  public java.util.Map<String, Object> unsubscribeJson(@RequestBody java.util.Map<String, String> body) {
    String token = body.get("token");
    boolean ok = service.unsubscribe(token);
    return java.util.Map.of(
      "ok", ok,
      "message", ok ? "You have been unsubscribed." : "Invalid link."
    );
  }
  
  
  
  
}
