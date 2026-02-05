package com.pxp.backend.dto;

import java.util.List;

public record ProjectDetailsDto(
        Long id,
        String slug,
        String title,
        String heroBlurb,
        String longDesc,
        String mainImageUrl,
        List<String> tags,
        List<ProjectImageDto> gallery
) {}
