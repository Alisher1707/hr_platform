-- =============================================
-- 004: ARIZALAR JADVALI (Kanban Board)
-- =============================================

-- Application status enum for Kanban
CREATE TYPE application_status AS ENUM (
  'KELDI',          -- Yangi ariza tushdi
  'QOSHILDI',       -- HR ko''rib chiqdi, qabul qilindi
  'SHARTNOMA'       -- Shartnoma imzolandi
);

CREATE TABLE applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
  status        application_status NOT NULL DEFAULT 'KELDI',
  position      VARCHAR(200),
  notes         TEXT,
  order_index   INTEGER DEFAULT 0,
  assigned_to   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Kanban board queries (most important)
CREATE INDEX idx_applications_status ON applications(status, order_index);

-- Index for employee lookup
CREATE INDEX idx_applications_employee ON applications(employee_id);

-- Index for assigned HR queries
CREATE INDEX idx_applications_assigned ON applications(assigned_to);

-- Index for recent applications
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Comment on table
COMMENT ON TABLE applications IS 'Ishga qabul qilish arizalari (Kanban kartalari)';

-- Comments on columns
COMMENT ON COLUMN applications.id IS 'Ariza UUID identifikatori';
COMMENT ON COLUMN applications.employee_id IS 'Bog''langan ishchi';
COMMENT ON COLUMN applications.status IS 'Ariza holati (KELDI, QOSHILDI, SHARTNOMA)';
COMMENT ON COLUMN applications.position IS 'Lavozim nomi';
COMMENT ON COLUMN applications.notes IS 'HR izohi';
COMMENT ON COLUMN applications.order_index IS 'Ustun ichidagi tartib (Drag & Drop uchun)';
COMMENT ON COLUMN applications.assigned_to IS 'Tayinlangan HR xodim';
