package com.pxp.backend.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pxp.backend.entity.ProjectImage;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {
	
	List<ProjectImage> findByProjectIdOrderBySortOrderAscIdAsc(Long projectId);
	
    Optional<ProjectImage> findByIdAndProjectId(Long id, Long projectId);
    
    long countByProjectId(Long projectId);
	
}
