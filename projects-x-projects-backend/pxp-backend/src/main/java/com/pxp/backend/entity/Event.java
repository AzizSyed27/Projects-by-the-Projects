package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "events")
public class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 160)
  private String title;

  @Column(name = "short_desc", columnDefinition = "TEXT")
  private String shortDesc;

  @Column(length = 200)
  private String location;

  @Column(name = "event_date", nullable = false)
  private LocalDate eventDate;

  @Column(name = "image_url", columnDefinition = "TEXT")
  private String imageUrl;

  @Column(columnDefinition = "TEXT")
  private String tags; // comma-separated

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private EventStatus status = EventStatus.DRAFT;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) createdAt = OffsetDateTime.now();
  }

  public Long getId() { return id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getShortDesc() { return shortDesc; }
  public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public LocalDate getEventDate() { return eventDate; }
  public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  public String getTags() { return tags; }
  public void setTags(String tags) { this.tags = tags; }

  public EventStatus getStatus() { return status; }
  public void setStatus(EventStatus status) { this.status = status; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
}
