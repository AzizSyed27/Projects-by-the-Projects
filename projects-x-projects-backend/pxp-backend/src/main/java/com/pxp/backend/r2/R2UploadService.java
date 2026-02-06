package com.pxp.backend.r2;

import com.pxp.backend.config.R2Properties;
import com.pxp.backend.r2.dto.PresignUploadResponse;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
public class R2UploadService {

  private final R2Properties props;
  private final S3Presigner presigner;

  public R2UploadService(R2Properties props, S3Presigner presigner) {
    this.props = props;
    this.presigner = presigner;
  }

  public PresignUploadResponse presignImageUpload(String projectSlug, UploadPurpose purpose, String originalFileName, String contentType) {
    validateImageContentType(contentType);

    String ext = fileExtension(originalFileName, contentType);
    String key = "projects/" + safeSlug(projectSlug) + "/" + purpose.name().toLowerCase() + "/" +
      UUID.randomUUID() + ext;

    // Restricting Content-Type is recommended for presigned URLs :contentReference[oaicite:11]{index=11}
    PutObjectRequest putReq = PutObjectRequest.builder()
      .bucket(props.getBucket())
      .key(key)
      .contentType(contentType)
      .build();

    Duration ttl = Duration.ofMinutes(props.getPresignMinutes());

    PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
      .signatureDuration(ttl)
      .putObjectRequest(putReq)
      .build();

    String uploadUrl = presigner.presignPutObject(presignReq).url().toString();

    String publicUrl = props.publicBaseUrlNoSlash() + "/" + key;

    return new PresignUploadResponse(
      key,
      uploadUrl,
      publicUrl,
      "PUT",
      Map.of("Content-Type", contentType),
      props.getPresignMinutes()
    );
  }

  private void validateImageContentType(String contentType) {
    if (contentType == null) throw new IllegalArgumentException("contentType is required");
    if (!contentType.startsWith("image/")) throw new IllegalArgumentException("Only image uploads are allowed");

    // allowlist common web-safe images
    if (!(contentType.equals("image/png")
		|| contentType.equals("image/jpg")
      || contentType.equals("image/jpeg")
      || contentType.equals("image/webp")
      || contentType.equals("image/gif"))) {
      throw new IllegalArgumentException("Unsupported image type: " + contentType);
    }
  }

  private String safeSlug(String s) {
    return s.toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
  }

  private String fileExtension(String originalName, String contentType) {
    String lower = originalName == null ? "" : originalName.toLowerCase();
    if (lower.endsWith(".png")) return ".png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
    if (lower.endsWith(".webp")) return ".webp";
    if (lower.endsWith(".gif")) return ".gif";

    // fallback based on contentType
    return switch (contentType) {
      case "image/png" -> ".png";
      case "image/jpeg" -> ".jpg";
      case "image/webp" -> ".webp";
      case "image/gif" -> ".gif";
      default -> "";
    };
  }
}
