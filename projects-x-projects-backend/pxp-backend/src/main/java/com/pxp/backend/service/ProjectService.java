package com.pxp.backend.service;

import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.ProjectStatus;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.web.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public List<ProjectCardDto> listByStatus(ProjectStatus status) {
    return projectRepository.findByStatusOrderByDisplayOrderAscCreatedAtDesc(status)
      .stream()
      .map(this::toCardDto)
      .toList();
  }

  public ProjectDetailDto getBySlug(String slug) {
    Project p = projectRepository.findBySlugWithImages(slug)
      .orElseThrow(() -> new IllegalArgumentException("Project not found"));

    return toDetailDto(p);
  }

  private ProjectCardDto toCardDto(Project p) {
    return new ProjectCardDto(
      p.getId(),
      p.getSlug(),
      p.getTitle(),
      p.getShortDesc(),
      p.getProjectTags(),
      p.getCardImageUrl(),
      p.getStatus() == ProjectStatus.COMPLETED
    );
  }

  private ProjectDetailDto toDetailDto(Project p) {
    var imgs = p.getImages().stream()
      .map(i -> new ProjectImageDto(i.getUrl(), i.getAlt(), i.getKind(), i.getSortOrder()))
      .toList();

    return new ProjectDetailDto(
      p.getId(),
      p.getSlug(),
      p.getTitle(),
      p.getHeroBlurb(),
      p.getLongDesc(),
      p.getProjectTags(),
      p.getMainImageUrl(),
      imgs,
      p.getStatus() == ProjectStatus.COMPLETED
    );
  }
}
