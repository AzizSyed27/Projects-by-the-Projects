package com.pxp.backend.web.admin;

import com.pxp.backend.r2.R2UploadService;
import com.pxp.backend.r2.dto.PresignUploadRequest;
import com.pxp.backend.r2.dto.PresignUploadResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

  private final R2UploadService service;

  public AdminUploadController(R2UploadService service) {
    this.service = service;
  }

  @PostMapping("/presign")
  public PresignUploadResponse presign(@Valid @RequestBody PresignUploadRequest req) {
    return service.presignImageUpload(req.projectSlug(), req.purpose(), req.originalFileName(), req.contentType());
  }
}
