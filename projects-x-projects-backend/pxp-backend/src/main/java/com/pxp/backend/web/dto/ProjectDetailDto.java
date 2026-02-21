package com.pxp.backend.web.dto;

import java.util.List;

public record ProjectDetailDto(
  Long projectId,
  String slug,
  String projectTitle,
  String heroBlurb,
  String projectLongDesc,
  String projectTags,          // comma-separated
  String mainImageUrl,
  List<ProjectImageDto> projectImages,
  boolean isCompleted,
  Long fundingGoalCents
) {}
