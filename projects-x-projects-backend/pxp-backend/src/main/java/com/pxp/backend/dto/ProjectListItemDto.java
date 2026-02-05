package com.pxp.backend.dto;

import java.util.List;

public record ProjectListItemDto(
        Long id,
        String slug,
        String title,
        String shortDesc,
        String cardImageUrl,
        List<String> tags,
        String status
) {}
