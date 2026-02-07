package com.pxp.backend.web.admin.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ProjectImageReorderRequest {
    // full ordered list of image IDs for this project
    @NotNull
    public List<Long> orderedIds;
}
