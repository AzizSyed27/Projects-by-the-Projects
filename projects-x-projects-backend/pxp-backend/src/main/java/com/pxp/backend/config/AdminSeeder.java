package com.pxp.backend.config;

import com.pxp.backend.entity.AdminUser;
import com.pxp.backend.repo.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

  private final AdminUserRepository repo;
  private final PasswordEncoder encoder;

  @Value("${pxp.admin.username}") private String username;
  @Value("${pxp.admin.password}") private String password;

  public AdminSeeder(AdminUserRepository repo, PasswordEncoder encoder) {
    this.repo = repo;
    this.encoder = encoder;
  }

  @Override
  public void run(String... args) {
    if (repo.existsByUsername(username)) return;

    AdminUser admin = new AdminUser();
    admin.setUsername(username);
    admin.setPasswordHash(encoder.encode(password));
    admin.setRole("ADMIN");

    repo.save(admin);

    System.out.println("!!!!Seeded admin user: " + username);
  }
}
