-- =============================================
-- 001: FOYDALANUVCHILAR JADVALI
-- =============================================

-- User role enum type
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'HR', 'EMPLOYEE');

-- Users table
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role NOT NULL DEFAULT 'ADMIN',
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Index for role-based queries
CREATE INDEX idx_users_role ON users(role);

-- Index for active users
CREATE INDEX idx_users_active ON users(is_active);

-- Comment on table
COMMENT ON TABLE users IS 'Tizim foydalanuvchilari - SUPER_ADMIN, ADMIN, HR, EMPLOYEE';

-- Comments on columns
COMMENT ON COLUMN users.id IS 'Foydalanuvchi UUID identifikatori';
COMMENT ON COLUMN users.email IS 'Noyob email manzil';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt bilan shifrlangan parol';
COMMENT ON COLUMN users.role IS 'Foydalanuvchi roli';
COMMENT ON COLUMN users.is_active IS 'Foydalanuvchi aktiv yoki yo''qligini belgilaydi';
