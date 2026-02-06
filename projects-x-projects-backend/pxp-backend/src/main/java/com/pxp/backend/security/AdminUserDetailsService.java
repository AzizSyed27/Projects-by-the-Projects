package com.pxp.backend.security;

import com.pxp.backend.repo.AdminUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserDetailsService implements UserDetailsService {

  private final AdminUserRepository repo;

  public AdminUserDetailsService(AdminUserRepository repo) {
    this.repo = repo;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var admin = repo.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

    return new User(
      admin.getUsername(),
      admin.getPasswordHash(),
      List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))
    );
  }
}
