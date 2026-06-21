-- =============================================
-- 005: ARIZALAR TARIXI (Audit Log)
-- =============================================

CREATE TABLE application_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID REFERENCES applications(id) ON DELETE CASCADE,
  changed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  old_status      application_status,
  new_status      application_status,
  comment         TEXT,
  changed_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding history by application
CREATE INDEX idx_history_application ON application_history(application_id, changed_at DESC);

-- Index for finding changes by user
CREATE INDEX idx_history_user ON application_history(changed_by);

-- Index for status change queries
CREATE INDEX idx_history_status ON application_history(old_status, new_status);

-- Comment on table
COMMENT ON TABLE application_history IS 'Arizalar o''zgarishlar tarixi (Audit log)';

-- Comments on columns
COMMENT ON COLUMN application_history.id IS 'Tarix yozuvi UUID identifikatori';
COMMENT ON COLUMN application_history.application_id IS 'Ariza ID';
COMMENT ON COLUMN application_history.changed_by IS 'O''zgartirish qilgan foydalanuvchi';
COMMENT ON COLUMN application_history.old_status IS 'Oldingi holat';
COMMENT ON COLUMN application_history.new_status IS 'Yangi holat';
COMMENT ON COLUMN application_history.comment IS 'Qo''shimcha izoh';
COMMENT ON COLUMN application_history.changed_at IS 'O''zgartirilgan vaqt';
