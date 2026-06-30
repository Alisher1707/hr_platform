-- =============================================
-- 007: ADD RAD ETILDI STATUS TO APPLICATION_STATUS ENUM
-- =============================================

-- Add 'RAD_ETILDI' to the existing application_status enum
ALTER TYPE application_status ADD VALUE 'RAD_ETILDI';

-- Comment on the new status
COMMENT ON TYPE application_status IS 'Ariza holatlari: KELDI, QOSHILDI, SHARTNOMA, RAD_ETILDI';
