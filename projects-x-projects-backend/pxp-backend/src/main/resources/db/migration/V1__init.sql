CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
  enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_admin_users_username
  ON admin_users (username);


-- ---------- PROJECTS ----------
CREATE TABLE IF NOT EXISTS projects (
  id             BIGSERIAL PRIMARY KEY,
  slug           VARCHAR(120) NOT NULL,
  title          VARCHAR(180) NOT NULL,
  hero_blurb     VARCHAR(400),
  short_desc     VARCHAR(500),
  long_desc      TEXT,

  -- DRAFT | ACTIVE | COMPLETED
  status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',

  card_image_url TEXT,
  main_image_url TEXT,

  display_order  INT          NOT NULL DEFAULT 0,

  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ
);

ALTER TABLE projects
  ADD CONSTRAINT projects_status_chk
  CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED'));

CREATE UNIQUE INDEX IF NOT EXISTS ux_projects_slug
  ON projects (slug);

CREATE INDEX IF NOT EXISTS ix_projects_status_order
  ON projects (status, display_order, created_at DESC);


-- ---------- PROJECT IMAGES (gallery) ----------
CREATE TABLE IF NOT EXISTS project_images (
  id         BIGSERIAL PRIMARY KEY,
  project_id BIGINT      NOT NULL,
  url        TEXT        NOT NULL,
  alt        TEXT,
  kind       VARCHAR(20) NOT NULL DEFAULT 'GALLERY', -- optional: could be MAIN/GALLERY later
  sort_order INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_project_images_project
    FOREIGN KEY (project_id)
    REFERENCES projects (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_project_images_project_sort
  ON project_images (project_id, sort_order);


-- ---------- PROJECT TAGS ----------
CREATE TABLE IF NOT EXISTS project_tags (
  project_id BIGINT      NOT NULL,
  tag        VARCHAR(60) NOT NULL,

  CONSTRAINT pk_project_tags PRIMARY KEY (project_id, tag),
  CONSTRAINT fk_project_tags_project
    FOREIGN KEY (project_id)
    REFERENCES projects (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_project_tags_tag
  ON project_tags (tag);


-- ---------- SUBSCRIBERS ----------
CREATE TABLE IF NOT EXISTS subscribers (
  id                BIGSERIAL PRIMARY KEY,
  email             VARCHAR(254) NOT NULL,

  -- PENDING | ACTIVE | UNSUBSCRIBED
  status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING',

  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  confirmed_at      TIMESTAMPTZ,

  confirm_token     UUID,
  unsubscribe_token UUID         NOT NULL
);

ALTER TABLE subscribers
  ADD CONSTRAINT subscribers_status_chk
  CHECK (status IN ('PENDING', 'ACTIVE', 'UNSUBSCRIBED'));

-- Prevent duplicates like Test@x.com vs test@x.com
CREATE UNIQUE INDEX IF NOT EXISTS ux_subscribers_email_lower
  ON subscribers (LOWER(email));

CREATE UNIQUE INDEX IF NOT EXISTS ux_subscribers_unsubscribe_token
  ON subscribers (unsubscribe_token);

CREATE INDEX IF NOT EXISTS ix_subscribers_status
  ON subscribers (status);