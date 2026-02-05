package com.pxp.backend.repository;

import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.ProjectStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	@EntityGraph(attributePaths = {"tags"})
    List<Project> findByStatusOrderByDisplayOrderAscCreatedAtDesc(ProjectStatus status);
	
	@EntityGraph(attributePaths = {"tags"})
	List<Project> findAll();

    Optional<Project> findBySlug(String slug);

    @EntityGraph(attributePaths = {"images", "tags"})
    Optional<Project> findWithImagesAndTagsBySlug(String slug);
}
