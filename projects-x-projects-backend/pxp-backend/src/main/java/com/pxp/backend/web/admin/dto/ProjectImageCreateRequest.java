package com.pxp.backend.web.admin.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectImageCreateRequest {
    @NotBlank
    public String url;

    public String alt;

    // default "GALLERY" if null/blank
    public String kind;

    // optional; if null we append to the end
    public Integer sortOrder;
}
