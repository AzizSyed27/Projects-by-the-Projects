package com.pxp.backend.web.admin;

import com.pxp.backend.entity.Event;
import com.pxp.backend.entity.EventStatus;
import com.pxp.backend.repo.EventRepository;
import com.pxp.backend.service.EventNotificationService;
import com.pxp.backend.web.admin.dto.AdminEventResponse;
import com.pxp.backend.web.admin.dto.EventUpsertRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

  private final EventRepository repo;
  private final EventNotificationService notify;

  public AdminEventController(EventRepository repo, EventNotificationService notify) {
    this.repo = repo;
    this.notify = notify;
  }

  @GetMapping
  public List<AdminEventResponse> listAll() {
    return repo.findAll().stream().map(this::toResp).toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AdminEventResponse create(@Valid @RequestBody EventUpsertRequest req) {
    Event e = new Event();
    e.setTitle(req.title());
    e.setShortDesc(req.shortDesc());
    e.setLocation(req.location());
    e.setEventDate(req.eventDate());
    e.setImageUrl(req.imageUrl());
    e.setTags(req.tags());

    EventStatus st = (req.status() == null) ? EventStatus.DRAFT : req.status();
    e.setStatus(st);

    Event saved = repo.save(e);

    // Notify only when UPCOMING
    if (saved.getStatus() == EventStatus.UPCOMING) {
      notify.notifyUpcoming(saved);
    }

    return toResp(saved);
  }

  @PutMapping("/{id}")
  public AdminEventResponse update(@PathVariable Long id, @Valid @RequestBody EventUpsertRequest req) {
    Event e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Event not found"));

    EventStatus before = e.getStatus();

    e.setTitle(req.title());
    e.setShortDesc(req.shortDesc());
    e.setLocation(req.location());
    e.setEventDate(req.eventDate());
    e.setImageUrl(req.imageUrl());
    e.setTags(req.tags());
    if (req.status() != null) e.setStatus(req.status());

    Event saved = repo.save(e);

    // Notify only on transition -> UPCOMING
    if (before != EventStatus.UPCOMING && saved.getStatus() == EventStatus.UPCOMING) {
      notify.notifyUpcoming(saved);
    }

    return toResp(saved);
  }

  @PatchMapping("/{id}/status")
  public AdminEventResponse setStatus(@PathVariable Long id, @RequestParam EventStatus status) {
    Event e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Event not found"));

    EventStatus before = e.getStatus();
    e.setStatus(status);

    Event saved = repo.save(e);

    if (before != EventStatus.UPCOMING && saved.getStatus() == EventStatus.UPCOMING) {
      notify.notifyUpcoming(saved);
    }

    return toResp(saved);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    // Optional: You can restrict deletes to DRAFT only (recommended).
    repo.deleteById(id);
  }

  private AdminEventResponse toResp(Event e) {
    return new AdminEventResponse(
      e.getId(),
      e.getTitle(),
      e.getShortDesc(),
      e.getLocation(),
      e.getEventDate(),
      e.getImageUrl(),
      e.getTags(),
      e.getStatus(),
      e.getCreatedAt()
    );
  }
}
