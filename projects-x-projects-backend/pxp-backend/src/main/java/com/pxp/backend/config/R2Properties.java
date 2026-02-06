package com.pxp.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Validated
@ConfigurationProperties(prefix = "pxp.r2")
public class R2Properties {

  @NotBlank private String accountId;
  @NotBlank private String bucket;
  @NotBlank private String accessKey;
  @NotBlank private String secretKey;
  @NotBlank private String publicBaseUrl;

  @Min(1) private int presignMinutes = 15;

  public String getAccountId() { return accountId; }
  public void setAccountId(String accountId) { this.accountId = accountId; }

  public String getBucket() { return bucket; }
  public void setBucket(String bucket) { this.bucket = bucket; }

  public String getAccessKey() { return accessKey; }
  public void setAccessKey(String accessKey) { this.accessKey = accessKey; }

  public String getSecretKey() { return secretKey; }
  public void setSecretKey(String secretKey) { this.secretKey = secretKey; }

  public String getPublicBaseUrl() { return publicBaseUrl; }
  public void setPublicBaseUrl(String publicBaseUrl) { this.publicBaseUrl = publicBaseUrl; }

  public int getPresignMinutes() { return presignMinutes; }
  public void setPresignMinutes(int presignMinutes) { this.presignMinutes = presignMinutes; }

  public String s3Endpoint() {
    // Cloudflare S3-compatible endpoint:
    // https://<ACCOUNT_ID>.r2.cloudflarestorage.com :contentReference[oaicite:8]{index=8}
    return "https://" + accountId + ".r2.cloudflarestorage.com";
  }

  public String publicBaseUrlNoSlash() {
    return publicBaseUrl.endsWith("/") ? publicBaseUrl.substring(0, publicBaseUrl.length() - 1) : publicBaseUrl;
  }
}
