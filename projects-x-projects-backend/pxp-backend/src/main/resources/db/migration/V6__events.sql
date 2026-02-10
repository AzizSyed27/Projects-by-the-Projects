CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  short_desc TEXT,
  location VARCHAR(200),
  event_date DATE NOT NULL,
  image_url TEXT,
  tags TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_date ON events(event_date);
