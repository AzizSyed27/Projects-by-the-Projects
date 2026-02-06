CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  hero_blurb VARCHAR(400),
  short_desc VARCHAR(500),
  long_desc TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  project_tags TEXT,               -- comma-separated tags
  card_image_url TEXT,
  main_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_status_order
  ON projects(status, display_order, created_at);

CREATE TABLE project_images (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  kind VARCHAR(20) NOT NULL DEFAULT 'GALLERY',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_images_project ON project_images(project_id);
