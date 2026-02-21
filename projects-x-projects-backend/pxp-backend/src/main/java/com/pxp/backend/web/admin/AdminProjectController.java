package com.pxp.backend.web.admin;

import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.ProjectStatus;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.service.ProjectNotificationService;
import com.pxp.backend.web.admin.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.time.OffsetDateTime;
import java.util.Locale;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

  private final ProjectRepository projectRepo;
  
  private final ProjectNotificationService notify;

  public AdminProjectController(ProjectRepository projectRepo, ProjectNotificationService notify) {
    this.projectRepo = projectRepo;
    this.notify = notify;
    
  }

  @GetMapping
  public java.util.List<AdminProjectResponse> listAll() {
    return projectRepo.findAll().stream().map(this::toResp).toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AdminProjectResponse create(@Valid @RequestBody ProjectUpsertRequest req) {
    Project p = new Project();

    p.setTitle(req.projectTitle());
    p.setHeroBlurb(req.heroBlurb());
    p.setShortDesc(req.projectShortDesc());
    p.setLongDesc(req.projectLongDesc());
    p.setProjectTags(req.projectTags());
    p.setCardImageUrl(req.cardImageUrl());
    p.setMainImageUrl(req.mainImageUrl());
    p.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);
    p.setFundingGoalCents(req.fundingGoalCents());

    ProjectStatus st = req.status() != null ? req.status() : ProjectStatus.ACTIVE;
    p.setStatus(st);
    if (st == ProjectStatus.COMPLETED) p.setCompletedAt(OffsetDateTime.now());

    String slug = (req.slug() == null || req.slug().isBlank()) ? slugify(req.projectTitle()) : slugify(req.slug());
    p.setSlug(makeUniqueSlug(slug));
    
    Project saved = projectRepo.save(p);
    if (saved.getStatus() == ProjectStatus.ACTIVE) {
      notify.notifyNewProject(saved);
    }

    return toResp(saved);
  }

  @PutMapping("/{id}")
  public AdminProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectUpsertRequest req) {
    Project p = projectRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found"));

    p.setTitle(req.projectTitle());
    p.setHeroBlurb(req.heroBlurb());
    p.setShortDesc(req.projectShortDesc());
    p.setLongDesc(req.projectLongDesc());
    p.setProjectTags(req.projectTags());
    p.setCardImageUrl(req.cardImageUrl());
    p.setMainImageUrl(req.mainImageUrl());
    p.setFundingGoalCents(req.fundingGoalCents());
    if (req.displayOrder() != null) p.setDisplayOrder(req.displayOrder());

    if (req.status() != null) {
      p.setStatus(req.status());
      if (req.status() == ProjectStatus.COMPLETED && p.getCompletedAt() == null) {
        p.setCompletedAt(OffsetDateTime.now());
      }
      if (req.status() != ProjectStatus.COMPLETED) {
        p.setCompletedAt(null);
      }
    }

    // optional: allow slug change
    if (req.slug() != null && !req.slug().isBlank()) {
      String desired = slugify(req.slug());
      if (!desired.equals(p.getSlug())) {
        p.setSlug(makeUniqueSlug(desired));
      }
    }

    return toResp(projectRepo.save(p));
  }

  @PatchMapping("/{id}/status")
  public AdminProjectResponse setStatus(@PathVariable Long id, @RequestParam ProjectStatus status) {
    Project p = projectRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found"));

    p.setStatus(status);
    if (status == ProjectStatus.COMPLETED) {
      if (p.getCompletedAt() == null) p.setCompletedAt(OffsetDateTime.now());
    } else {
      p.setCompletedAt(null);
    }

    return toResp(projectRepo.save(p));
  }

  private AdminProjectResponse toResp(Project p) {
    return new AdminProjectResponse(
      p.getId(),
      p.getSlug(),
      p.getTitle(),
      p.getHeroBlurb(),
      p.getShortDesc(),
      p.getLongDesc(),
      p.getProjectTags(),
      p.getCardImageUrl(),
      p.getMainImageUrl(),
      p.getDisplayOrder(),
      p.getStatus(),
      p.getStatus() == ProjectStatus.COMPLETED,
      p.getFundingGoalCents()
    );
  }

  private String slugify(String input) {
    String nowhitespace = input.trim().replaceAll("\\s+", "-");
    String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
    String slug = normalized.replaceAll("[^\\w-]", "").toLowerCase(Locale.ROOT);
    slug = slug.replaceAll("[-_]{2,}", "-").replaceAll("^-|-$", "");
    return slug.isBlank() ? "project" : slug;
  }

  private String makeUniqueSlug(String base) {
    String slug = base;
    int i = 2;
    while (projectRepo.findBySlugWithImages(slug).isPresent()) {
      slug = base + "-" + i;
      i++;
    }
    return slug;
  }
}
