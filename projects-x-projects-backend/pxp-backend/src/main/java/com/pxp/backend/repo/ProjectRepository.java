package com.pxp.backend.repo;

import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.ProjectStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

  List<Project> findByStatusOrderByDisplayOrderAscCreatedAtDesc(ProjectStatus status);

  @Query("select distinct p from Project p left join fetch p.images where p.slug = :slug")
  Optional<Project> findBySlugWithImages(@Param("slug") String slug);
}
