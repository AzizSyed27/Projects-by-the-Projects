package com.pxp.backend.web.admin.dto;

import com.pxp.backend.entity.EventStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record AdminEventResponse(
  Long id,
  String title,
  String shortDesc,
  String location,
  LocalDate eventDate,
  String imageUrl,
  String tags,
  EventStatus status,
  OffsetDateTime createdAt
) {}
