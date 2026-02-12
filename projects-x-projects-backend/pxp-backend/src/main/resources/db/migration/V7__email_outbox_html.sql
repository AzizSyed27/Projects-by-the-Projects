ALTER TABLE email_outbox
  ADD COLUMN IF NOT EXISTS html_body TEXT;

ALTER TABLE email_outbox
  ADD COLUMN IF NOT EXISTS list_unsubscribe TEXT;