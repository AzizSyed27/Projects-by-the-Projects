package com.pxp.backend.web.admin.dto;

public record LoginResponse(
  String token,
  String tokenType,
  long expiresMinutes
) {}
