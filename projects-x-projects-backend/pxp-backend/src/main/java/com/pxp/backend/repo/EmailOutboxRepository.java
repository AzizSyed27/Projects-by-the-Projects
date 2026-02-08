package com.pxp.backend.repo;

import com.pxp.backend.entity.EmailOutbox;
import com.pxp.backend.entity.OutboxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;

public interface EmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {

  @Query("""
    select e from EmailOutbox e
    where e.status = :status
      and e.nextAttemptAt <= :now
    order by e.nextAttemptAt asc, e.id asc
  """)
  List<EmailOutbox> findDue(OutboxStatus status, OffsetDateTime now);
}
