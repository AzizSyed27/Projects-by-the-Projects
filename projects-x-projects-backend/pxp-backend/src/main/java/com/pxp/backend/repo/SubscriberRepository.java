package com.pxp.backend.repo;

import com.pxp.backend.entity.Subscriber;
import com.pxp.backend.entity.SubscriberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
	
  Optional<Subscriber> findByEmailIgnoreCase(String email);
  
  Optional<Subscriber> findByVerifyToken(String token);
  
  Optional<Subscriber> findByUnsubscribeToken(String token);
  
  List<Subscriber> findByStatus(SubscriberStatus status);
  
}
