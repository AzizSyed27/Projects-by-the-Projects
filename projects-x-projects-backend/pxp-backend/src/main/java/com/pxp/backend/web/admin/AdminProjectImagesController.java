package com.pxp.backend.web.admin;


import com.pxp.backend.service.ProjectImageService;
import com.pxp.backend.web.admin.dto.ProjectImageCreateRequest;
import com.pxp.backend.web.admin.dto.ProjectImageReorderRequest;
import com.pxp.backend.web.admin.dto.ProjectImageResponse;
import com.pxp.backend.web.admin.dto.ProjectImageUpdateRequest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects/{projectId}/images")
public class AdminProjectImagesController {

    private final ProjectImageService projectImageService;

    public AdminProjectImagesController(ProjectImageService projectImageService) {
        this.projectImageService = projectImageService;
    }

    @GetMapping
    public List<ProjectImageResponse> list(@PathVariable Long projectId) {
        return projectImageService.list(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectImageResponse add(@PathVariable Long projectId, @Valid @RequestBody ProjectImageCreateRequest req) {
        return projectImageService.add(projectId, req);
    }

    @PatchMapping("/{imageId}")
    public ProjectImageResponse update(
            @PathVariable Long projectId,
            @PathVariable Long imageId,
            @RequestBody ProjectImageUpdateRequest req
    ) {
        return projectImageService.update(projectId, imageId, req);
    }

    @DeleteMapping("/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long projectId, @PathVariable Long imageId) {
        projectImageService.delete(projectId, imageId);
    }

    @PutMapping("/reorder")
    public List<ProjectImageResponse> reorder(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectImageReorderRequest req
    ) {
        return projectImageService.reorder(projectId, req);
    }
}

