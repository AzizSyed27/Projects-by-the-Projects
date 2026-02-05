package com.pxp.backend.dto;

public record ProjectImageDto(
        Long id,
        String url,
        String alt,
        int sortOrder
) {}
