package com.pxp.backend.repo;

import com.pxp.backend.entity.Event;
import com.pxp.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
	
	List<Event> findByStatusOrderByEventDateAscIdAsc(EventStatus status);
	
	List<Event> findByStatusOrderByEventDateDescIdDesc(EventStatus status);
	
}
