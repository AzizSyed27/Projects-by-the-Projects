CREATE TABLE subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  verify_token TEXT,
  unsubscribe_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_verify_token ON subscribers(verify_token);
CREATE INDEX idx_subscribers_unsub_token ON subscribers(unsubscribe_token);
