package com.pxp.backend.security;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;

  public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
    this.jwtAuthFilter = jwtAuthFilter;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	http
	  .cors(cors -> {})
	  .csrf(csrf -> csrf.disable())
	  .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	  .authorizeHttpRequests(auth -> auth
		
		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
		
		// public endpoints
		.requestMatchers("/api/projects/**").permitAll()
		.requestMatchers("/api/admin/auth/login").permitAll()
		
		// admin endpoints
		.requestMatchers("/api/admin/**").hasRole("ADMIN")
		
		//for subscription service
		.requestMatchers("/api/subscribers/**").permitAll()
		.requestMatchers("/api/events/**").permitAll()
		.requestMatchers("/api/admin/events/**").hasRole("ADMIN")
		
		.anyRequest().permitAll()
      );

    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }
}
