package com.pxp.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120, unique = true)
  private String slug;

  @Column(nullable = false, length = 180)
  private String title;

  @Column(name = "hero_blurb", length = 400)
  private String heroBlurb;

  @Column(name = "short_desc", length = 500)
  private String shortDesc;

  @Column(name = "long_desc", columnDefinition = "TEXT")
  private String longDesc;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProjectStatus status = ProjectStatus.ACTIVE;

  // comma-separated tags (user wants this)
  @Column(name = "project_tags", columnDefinition = "TEXT")
  private String projectTags;

  @Column(name = "card_image_url", columnDefinition = "TEXT")
  private String cardImageUrl;

  @Column(name = "main_image_url", columnDefinition = "TEXT")
  private String mainImageUrl;

  @Column(name = "display_order", nullable = false)
  private Integer displayOrder = 0;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @Column(name = "completed_at")
  private OffsetDateTime completedAt;

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder ASC, id ASC")
  private List<ProjectImage> images = new ArrayList<>();

  @PrePersist
  void onCreate() {
    var now = OffsetDateTime.now();
    if (createdAt == null) createdAt = now;
    if (updatedAt == null) updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = OffsetDateTime.now();
  }

  // getters/setters
  public Long getId() { return id; }

  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getHeroBlurb() { return heroBlurb; }
  public void setHeroBlurb(String heroBlurb) { this.heroBlurb = heroBlurb; }

  public String getShortDesc() { return shortDesc; }
  public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

  public String getLongDesc() { return longDesc; }
  public void setLongDesc(String longDesc) { this.longDesc = longDesc; }

  public ProjectStatus getStatus() { return status; }
  public void setStatus(ProjectStatus status) { this.status = status; }

  public String getProjectTags() { return projectTags; }
  public void setProjectTags(String projectTags) { this.projectTags = projectTags; }

  public String getCardImageUrl() { return cardImageUrl; }
  public void setCardImageUrl(String cardImageUrl) { this.cardImageUrl = cardImageUrl; }

  public String getMainImageUrl() { return mainImageUrl; }
  public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }

  public Integer getDisplayOrder() { return displayOrder; }
  public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }

  public OffsetDateTime getCompletedAt() { return completedAt; }
  public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

  public List<ProjectImage> getImages() { return images; }
}
