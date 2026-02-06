package com.pxp.backend.r2.dto;

import com.pxp.backend.r2.UploadPurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PresignUploadRequest(
  @NotBlank String projectSlug,
  @NotNull UploadPurpose purpose,
  @NotBlank String originalFileName,
  @NotBlank String contentType
) {}
