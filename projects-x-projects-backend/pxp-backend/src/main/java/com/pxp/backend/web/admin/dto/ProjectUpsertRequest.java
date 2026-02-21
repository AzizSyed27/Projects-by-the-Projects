package com.pxp.backend.web.admin.dto;

import com.pxp.backend.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;

public record ProjectUpsertRequest(
  String slug,                 // optional; if missing we generate from title
  @NotBlank String projectTitle,
  String heroBlurb,
  String projectShortDesc,
  String projectLongDesc,
  String projectTags,          // comma-separated
  String cardImageUrl,
  String mainImageUrl,
  Integer displayOrder,
  ProjectStatus status,         // optional; default ACTIVE
  Long fundingGoalCents
) {}
