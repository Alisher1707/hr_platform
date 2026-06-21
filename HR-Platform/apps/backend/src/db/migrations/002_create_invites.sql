-- =============================================
-- 002: ADMIN TAKLIF HAVOLALARI JADVALI
-- =============================================

CREATE TABLE invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token         VARCHAR(64) UNIQUE NOT NULL,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  used_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used_at       TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast token lookups (most common operation)
CREATE INDEX idx_invites_token ON invites(token);

-- Index for finding invites by creator
CREATE INDEX idx_invites_created_by ON invites(created_by);

-- Index for active invites
CREATE INDEX idx_invites_active ON invites(is_active);

-- Composite index for finding valid invites
CREATE INDEX idx_invites_valid ON invites(token, is_active, expires_at);

-- Comment on table
COMMENT ON TABLE invites IS 'Admin ro''yxatdan o''tish uchun taklif havolalari';

-- Comments on columns
COMMENT ON COLUMN invites.token IS 'Noyob taklif tokeni (crypto.randomBytes)';
COMMENT ON COLUMN invites.created_by IS 'Taklif yaratgan SUPER_ADMIN';
COMMENT ON COLUMN invites.used_by IS 'Taklif orqali ro''yxatdan o''tgan foydalanuvchi';
COMMENT ON COLUMN invites.expires_at IS 'Token amal qilish muddati';
COMMENT ON COLUMN invites.used_at IS 'Token ishlatilgan vaqt';
COMMENT ON COLUMN invites.is_active IS 'Taklif aktiv yoki yo''qligini belgilaydi';
