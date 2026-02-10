package com.pxp.backend.web.admin.dto;

import com.pxp.backend.entity.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record EventUpsertRequest(
  @NotBlank String title,
  String shortDesc,
  String location,
  @NotNull LocalDate eventDate,
  String imageUrl,
  String tags,          // comma-separated
  EventStatus status    // optional; default DRAFT
) {}
