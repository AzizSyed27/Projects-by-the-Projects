package com.pxp.backend.web.dto;

public record ProjectImageDto(
  String url,
  String alt,
  String kind,
  int sortOrder
) {}
