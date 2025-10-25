-- =============================================
-- Update video_comments table to support guest comments
-- =============================================

-- Add guest comment columns
ALTER TABLE video_comments 
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN guest_name VARCHAR(100),
  ADD COLUMN guest_role VARCHAR(20) CHECK (guest_role IN ('doctor', 'user'));

-- Add constraint to ensure either user_id or guest_name is present
ALTER TABLE video_comments 
  ADD CONSTRAINT check_user_or_guest 
  CHECK (
    (user_id IS NOT NULL AND guest_name IS NULL AND guest_role IS NULL) OR
    (user_id IS NULL AND guest_name IS NOT NULL AND guest_role IS NOT NULL)
  );

-- Update existing comments to make sure they comply
UPDATE video_comments SET guest_name = NULL, guest_role = NULL WHERE user_id IS NOT NULL;