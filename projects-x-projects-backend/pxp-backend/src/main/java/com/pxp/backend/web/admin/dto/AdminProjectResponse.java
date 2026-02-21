package com.pxp.backend.web.admin.dto;

import com.pxp.backend.entity.ProjectStatus;

public record AdminProjectResponse(
  Long projectId,
  String slug,
  String projectTitle,
  String heroBlurb,
  String projectShortDesc,
  String projectLongDesc,
  String projectTags,
  String cardImageUrl,
  String mainImageUrl,
  Integer displayOrder,
  ProjectStatus status,
  boolean isCompleted,
  Long fundingGoalCents
) {}
