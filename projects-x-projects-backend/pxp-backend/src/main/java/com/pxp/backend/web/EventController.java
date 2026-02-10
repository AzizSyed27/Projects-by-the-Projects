package com.pxp.backend.web;

import com.pxp.backend.entity.Event;
import com.pxp.backend.entity.EventStatus;
import com.pxp.backend.repo.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

  private final EventRepository repo;

  public EventController(EventRepository repo) {
    this.repo = repo;
  }

  public record EventCardResponse(
    Long id,
    String title,
    String shortDesc,
    String location,
    LocalDate eventDate,
    String imageUrl,
    String tags,
    EventStatus status
  ) {}

  // default: UPCOMING
  @GetMapping
  public List<EventCardResponse> list(@RequestParam(required = false) EventStatus status) {
    EventStatus st = (status == null) ? EventStatus.UPCOMING : status;

    List<Event> events = (st == EventStatus.PASSED)
      ? repo.findByStatusOrderByEventDateDescIdDesc(st)
      : repo.findByStatusOrderByEventDateAscIdAsc(st);

    // public should never show drafts
    if (st == EventStatus.DRAFT) return List.of();

    return events.stream().map(this::toCard).toList();
  }

  private EventCardResponse toCard(Event e) {
    return new EventCardResponse(
      e.getId(),
      e.getTitle(),
      e.getShortDesc(),
      e.getLocation(),
      e.getEventDate(),
      e.getImageUrl(),
      e.getTags(),
      e.getStatus()
    );
  }
}
