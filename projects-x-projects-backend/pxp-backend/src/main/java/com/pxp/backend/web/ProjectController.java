package com.pxp.backend.web;

import com.pxp.backend.entity.ProjectStatus;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.service.ProjectService;
import com.pxp.backend.web.dto.ProjectCardDto;
import com.pxp.backend.web.dto.ProjectDetailDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;
  
  private final ProjectRepository projectRepo;

  public ProjectController(ProjectService projectService, ProjectRepository projectRepo) {
    this.projectService = projectService;
    this.projectRepo	= projectRepo;
  }

  // GET /api/projects?status=ACTIVE
  @GetMapping
  public List<ProjectCardDto> list(@RequestParam(defaultValue = "ACTIVE") ProjectStatus status) {
    return projectService.listByStatus(status);
  }

  // GET /api/projects/{slug}
  @GetMapping("/{slug}")
  public ProjectDetailDto bySlug(@PathVariable String slug) {
    return projectService.getBySlug(slug);
  }
  
  public record ProjectOption(Long id, String title) {}
  
  //Only ACTIVE projects show in the donate dropdown
  @GetMapping("/active-options")
  public List<ProjectOption> activeOptions() {
	  return projectRepo.findByStatusOrderByDisplayOrderAscIdAsc(ProjectStatus.ACTIVE)
		  .stream()
		  .map(p -> new ProjectOption(p.getId(), p.getTitle()))
		  .toList();
  }
}
