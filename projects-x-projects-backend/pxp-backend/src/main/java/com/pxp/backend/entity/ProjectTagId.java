package com.pxp.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProjectTagId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "tag", length = 60)
    private String tag;

    public ProjectTagId() {}

    public ProjectTagId(Long projectId, String tag) {
        this.projectId = projectId;
        this.tag = tag;
    }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectTagId that)) return false;
        return Objects.equals(projectId, that.projectId) && Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectId, tag);
    }
}
