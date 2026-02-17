package com.pxp.backend.repo;

import com.pxp.backend.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
  Optional<Donation> findByStripeSessionId(String stripeSessionId);
}