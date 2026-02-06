package com.pxp.backend.r2.dto;

import java.util.Map;

public record PresignUploadResponse(
  String key,
  String uploadUrl,
  String publicUrl,
  String method,
  Map<String, String> requiredHeaders,
  int expiresMinutes
) {}
