package com.pxp.backend.web.dto;

public record ProjectCardDto(
  Long projectId,
  String slug,
  String projectTitle,
  String projectShortDesc,
  String projectTags,   // comma-separated
  String cardImageUrl,
  boolean isCompleted,
  Long fundingGoalCents,
  Long eTransferAmountCents
) {}
