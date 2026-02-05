package com.pxp.backend.controller;

import com.pxp.backend.dto.ProjectDetailsDto;
import com.pxp.backend.dto.ProjectListItemDto;
import com.pxp.backend.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectListItemDto> listActive() {
        return service.listAll();
    }

    @GetMapping("/{slug}")
    public ProjectDetailsDto getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }
}
