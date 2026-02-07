package com.pxp.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pxp.backend.entity.ProjectImage;
import com.pxp.backend.repo.ProjectImageRepository;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.web.admin.dto.ProjectImageCreateRequest;
import com.pxp.backend.web.admin.dto.ProjectImageReorderRequest;
import com.pxp.backend.web.admin.dto.ProjectImageResponse;
import com.pxp.backend.web.admin.dto.ProjectImageUpdateRequest;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
public class ProjectImageService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;

    public ProjectImageService(ProjectRepository projectRepository, ProjectImageRepository projectImageRepository) {
        this.projectRepository = projectRepository;
        this.projectImageRepository = projectImageRepository;
    }

    public List<ProjectImageResponse> list(Long projectId) {
        ensureProjectExists(projectId);
        return projectImageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProjectImageResponse add(Long projectId, ProjectImageCreateRequest req) {
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));

        var img = new ProjectImage();
        img.setProject(project);
        img.setUrl(req.url.trim());
        img.setAlt(req.alt);

        String kind = (req.kind == null || req.kind.isBlank()) ? "GALLERY" : req.kind.trim().toUpperCase();
        img.setKind(kind);

        // If sortOrder not provided, append to end
        if (req.sortOrder == null) {
            long count = projectImageRepository.countByProjectId(projectId);
            img.setSortOrder((int) count);
        } else {
            img.setSortOrder(req.sortOrder);
        }

        var saved = projectImageRepository.save(img);
        return toResponse(saved);
    }

    @Transactional
    public ProjectImageResponse update(Long projectId, Long imageId, ProjectImageUpdateRequest req) {
        var img = projectImageRepository.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Image not found for project"));

        if (req.alt != null) img.setAlt(req.alt);
        if (req.kind != null && !req.kind.isBlank()) img.setKind(req.kind.trim().toUpperCase());
        if (req.sortOrder != null) img.setSortOrder(req.sortOrder);

        return toResponse(img);
    }

    @Transactional
    public void delete(Long projectId, Long imageId) {
        var img = projectImageRepository.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Image not found for project"));
        projectImageRepository.delete(img);
    }

    @Transactional
    public List<ProjectImageResponse> reorder(Long projectId, ProjectImageReorderRequest req) {
        ensureProjectExists(projectId);

        var existing = projectImageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
        var existingIds = existing.stream().map(ProjectImage::getId).collect(Collectors.toSet());

        if (req.orderedIds == null || req.orderedIds.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "orderedIds is required");
        }

        // must be same set (strict reorder)
        var requestedSet = new HashSet<>(req.orderedIds);
        if (!requestedSet.equals(existingIds)) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "orderedIds must contain exactly the image IDs belonging to this project");
        }

        // assign 0..n-1 in the requested order
        Map<Long, Integer> newOrder = new HashMap<>();
        for (int i = 0; i < req.orderedIds.size(); i++) newOrder.put(req.orderedIds.get(i), i);

        for (var img : existing) {
            img.setSortOrder(newOrder.get(img.getId()));
        }

        // return sorted by new order
        return projectImageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
    }

    private ProjectImageResponse toResponse(ProjectImage img) {
        return ProjectImageResponse.of(
                img.getId(),
                img.getUrl(),
                img.getAlt(),
                img.getKind(),
                img.getSortOrder()
        );
    }
}
