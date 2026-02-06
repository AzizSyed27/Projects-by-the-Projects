package com.pxp.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(R2Properties.class)
public class R2Config {

  @Bean
  public S3Client r2S3Client(R2Properties props) {
    var creds = AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey());

    var s3cfg = S3Configuration.builder()
      .pathStyleAccessEnabled(true) // Cloudflare example uses path-style
      .build();

    return S3Client.builder()
      .endpointOverride(URI.create(props.s3Endpoint()))
      .credentialsProvider(StaticCredentialsProvider.create(creds))
      .region(Region.of("auto")) // required by SDK, not used by R2 
      .serviceConfiguration(s3cfg)
      .build();
  }

  @Bean
  public S3Presigner r2Presigner(R2Properties props) {
    var creds = AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey());

    var s3cfg = S3Configuration.builder()
      .pathStyleAccessEnabled(true)
      .build();

    return S3Presigner.builder()
      .endpointOverride(URI.create(props.s3Endpoint()))
      .credentialsProvider(StaticCredentialsProvider.create(creds))
      .region(Region.of("auto"))
      .serviceConfiguration(s3cfg)
      .build();
  }
}
