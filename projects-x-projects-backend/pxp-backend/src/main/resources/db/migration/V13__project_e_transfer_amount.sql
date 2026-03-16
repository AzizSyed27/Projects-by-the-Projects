ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS etransfer_amount_cents BIGINT NOT NULL DEFAULT 0;

-- Optional safety
ALTER TABLE projects
  ADD CONSTRAINT chk_projects_etransfer_nonneg
  CHECK (etransfer_amount_cents >= 0);