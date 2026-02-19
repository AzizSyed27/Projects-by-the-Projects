package com.pxp.backend.repo;

import com.pxp.backend.entity.Donation;
import com.pxp.backend.entity.DonationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
	
  Optional<Donation> findByStripeSessionId(String stripeSessionId);
  
  @Query("""
		  select coalesce(sum(d.amountCents), 0)
		  from Donation d
		  where d.status = :paid
		    and (:projectId = -1 or d.project.id = :projectId)
		    and d.createdAt >= coalesce(:from, d.createdAt)
		    and d.createdAt <= coalesce(:to, d.createdAt)
		""")
	Long sumPaid(
	  @Param("paid") DonationStatus paid,
	  @Param("projectId") long projectId,      // use primitive so it can't be null
	  @Param("from") OffsetDateTime from,
	  @Param("to") OffsetDateTime to
	);

	@Query("""
		  select count(d)
		  from Donation d
		  where d.status = :paid
		    and (:projectId = -1 or d.project.id = :projectId)
		    and d.createdAt >= coalesce(:from, d.createdAt)
		    and d.createdAt <= coalesce(:to, d.createdAt)
		""")
	Long countPaid(
	  @Param("paid") DonationStatus paid,
	  @Param("projectId") long projectId,
	  @Param("from") OffsetDateTime from,
	  @Param("to") OffsetDateTime to
	);
}