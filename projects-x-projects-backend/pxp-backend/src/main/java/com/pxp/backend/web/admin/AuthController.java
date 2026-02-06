package com.pxp.backend.web.admin;

import com.pxp.backend.repo.AdminUserRepository;
import com.pxp.backend.security.JwtService;
import com.pxp.backend.web.admin.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

  private final AuthenticationManager authManager;
  private final JwtService jwtService;
  private final AdminUserRepository adminRepo;

  public AuthController(AuthenticationManager authManager, JwtService jwtService, AdminUserRepository adminRepo) {
    this.authManager = authManager;
    this.jwtService = jwtService;
    this.adminRepo = adminRepo;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
    Authentication auth = authManager.authenticate(
      new UsernamePasswordAuthenticationToken(req.username(), req.password())
    );

    // update last_login_at
    adminRepo.findByUsername(req.username()).ifPresent(a -> {
      a.setLastLoginAt(OffsetDateTime.now());
      adminRepo.save(a);
    });

    // role is ROLE_ADMIN
    String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority().replace("ROLE_", "")).orElse("ADMIN");

    String token = jwtService.generateToken(req.username(), role);
    return ResponseEntity.ok(new LoginResponse(token, "Bearer", jwtService.getExpiresMinutes()));
  }
}
