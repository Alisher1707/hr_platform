-- Migration: Add SINOV_MUDDATI status to applications
-- Date: 2026-07-01
-- Description: Add new status for trial period between QOSHILDI and SHARTNOMA

-- Add SINOV_MUDDATI to the application_status ENUM type
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'SINOV_MUDDATI';

-- Update the comment to reflect new status
COMMENT ON TYPE application_status IS 'Ariza holatlari: KELDI, QOSHILDI, SINOV_MUDDATI, SHARTNOMA, RAD_ETILDI';

-- Migration completed successfully
SELECT 'SINOV_MUDDATI status added to application_status enum' AS migration_result;
