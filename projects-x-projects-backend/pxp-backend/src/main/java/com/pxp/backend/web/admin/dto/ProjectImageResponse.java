package com.pxp.backend.web.admin.dto;

public class ProjectImageResponse {
    public Long id;
    public String url;
    public String alt;
    public String kind;
    public Integer sortOrder;

    public static ProjectImageResponse of(Long id, String url, String alt, String kind, Integer sortOrder) {
        var r = new ProjectImageResponse();
        r.id = id;
        r.url = url;
        r.alt = alt;
        r.kind = kind;
        r.sortOrder = sortOrder;
        return r;
    }
}
