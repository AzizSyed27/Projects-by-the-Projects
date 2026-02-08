package com.pxp.backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TokenService {
  private final SecureRandom rnd = new SecureRandom();

  public String newToken() {
    byte[] buf = new byte[32];
    rnd.nextBytes(buf);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
  }
}
