package com.pxp.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_tags")
public class ProjectTag {

    @EmbeddedId
    private ProjectTagId id = new ProjectTagId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    protected ProjectTag() {}

    public ProjectTag(Project project, String tag) {
        this.project = project;
        this.id.setTag(tag);
        // projectId is filled via @MapsId when the project has an id
    }

    public ProjectTagId getId() { return id; }
    public void setId(ProjectTagId id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getTag() { return id.getTag(); }
    public void setTag(String tag) { this.id.setTag(tag); }
}
