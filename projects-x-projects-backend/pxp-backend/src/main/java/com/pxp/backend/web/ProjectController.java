package com.pxp.backend.web;

import com.pxp.backend.entity.ProjectStatus;
import com.pxp.backend.service.ProjectService;
import com.pxp.backend.web.dto.ProjectCardDto;
import com.pxp.backend.web.dto.ProjectDetailDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
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
}
