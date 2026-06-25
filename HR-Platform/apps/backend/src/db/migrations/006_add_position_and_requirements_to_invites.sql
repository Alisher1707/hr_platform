-- =============================================
-- 006: ADD POSITION AND REQUIREMENTS TO INVITES (IDEMPOTENT)
-- =============================================

ALTER TABLE invites ADD COLUMN IF NOT EXISTS position VARCHAR(200);
ALTER TABLE invites ADD COLUMN IF NOT EXISTS requirements JSONB;

COMMENT ON COLUMN invites.position IS 'Taklif qilinayotgan lavozim';
COMMENT ON COLUMN invites.requirements IS 'Tanlangan lavozim talablari va vazifalari (JSON formatida)';
