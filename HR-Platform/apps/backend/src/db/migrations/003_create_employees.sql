-- =============================================
-- 003: ISHCHILAR JADVALI
-- =============================================

CREATE TABLE employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  address       TEXT,
  birth_date    DATE,
  experience    SMALLINT DEFAULT 0,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for name searches
CREATE INDEX idx_employees_name ON employees(last_name, first_name);

-- Index for finding employees by creator
CREATE INDEX idx_employees_created_by ON employees(created_by);

-- Index for birth_date queries (for age calculations)
CREATE INDEX idx_employees_birth_date ON employees(birth_date);

-- Index for recent employees
CREATE INDEX idx_employees_created_at ON employees(created_at DESC);

-- Comment on table
COMMENT ON TABLE employees IS 'Ishchilar ma''lumotlari (Admin tomonidan qo''shiladi)';

-- Comments on columns
COMMENT ON COLUMN employees.id IS 'Ishchi UUID identifikatori';
COMMENT ON COLUMN employees.first_name IS 'Ism';
COMMENT ON COLUMN employees.last_name IS 'Familiya';
COMMENT ON COLUMN employees.phone IS 'Telefon raqami';
COMMENT ON COLUMN employees.address IS 'Manzil';
COMMENT ON COLUMN employees.birth_date IS 'Tug''ilgan sana (yosh hisoblash uchun)';
COMMENT ON COLUMN employees.experience IS 'Ish staji (yil)';
COMMENT ON COLUMN employees.created_by IS 'Qo''shgan admin';
