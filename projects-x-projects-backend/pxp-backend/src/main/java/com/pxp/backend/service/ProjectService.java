package com.pxp.backend.service;

import com.pxp.backend.dto.ProjectDetailsDto;
import com.pxp.backend.dto.ProjectImageDto;
import com.pxp.backend.dto.ProjectListItemDto;
import com.pxp.backend.entity.Project;
import com.pxp.backend.entity.ProjectStatus;
import com.pxp.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) {
        this.repo = repo;
    }

    public List<ProjectListItemDto> listActive() {
        return repo.findByStatusOrderByDisplayOrderAscCreatedAtDesc(ProjectStatus.ACTIVE)
                .stream()
                .map(this::toListItem)
                .toList();
    }
    
    public List<ProjectListItemDto> listAll() {
        return repo.findAll()
                .stream()
                .map(this::toListItem)
                .toList();
    }

    public ProjectDetailsDto getBySlug(String slug) {
        Project p = repo.findWithImagesAndTagsBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        var tags = p.getTags().stream()
        		.map(t -> t.getId().getTag())
        		.distinct()
        		.toList();
        
        var gallery = p.getImages().stream()
                .filter(img -> "GALLERY".equalsIgnoreCase(img.getKind()))
                .map(img -> new ProjectImageDto(
                        img.getId(),
                        img.getUrl(),
                        img.getAlt(),
                        img.getSortOrder() == null ? 0 : img.getSortOrder()
                ))
                .toList();

        return new ProjectDetailsDto(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getHeroBlurb(),
                p.getLongDesc(),
                p.getMainImageUrl(),
                tags,
                gallery
        );
    }

    private ProjectListItemDto toListItem(Project p) {
        
    	var tags = p.getTags().stream()
    			.map(t -> t.getId().getTag())
    			.distinct()
    			.toList();
        
        return new ProjectListItemDto(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getShortDesc(),
                p.getCardImageUrl(),
                tags,
                p.getStatus().name()
        );
    }
}
