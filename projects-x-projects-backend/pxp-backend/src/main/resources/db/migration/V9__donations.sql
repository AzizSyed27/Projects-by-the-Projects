CREATE TABLE donations (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NULL REFERENCES projects(id) ON DELETE SET NULL,

  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'cad',

  status VARCHAR(20) NOT NULL,

  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email VARCHAR(320),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_donations_project_id ON donations(project_id);
