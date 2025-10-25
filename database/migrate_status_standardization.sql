-- =============================================
-- STATUS STANDARDIZATION MIGRATION - 3 STATUS SYSTEM
-- =============================================

-- This script standardizes status values across documents and videos
-- to create a unified 3-status content management system:
-- PENDING → REJECTED → VERIFIED

-- =============================================
-- 1. BACKUP CURRENT STATUS VALUES
-- =============================================

-- Check current document status distribution
SELECT 'BEFORE MIGRATION - Documents Status Distribution' as operation;
SELECT status, COUNT(*) as count 
FROM documents 
GROUP BY status 
ORDER BY status;

-- Check current video status distribution  
SELECT 'BEFORE MIGRATION - Videos Status Distribution' as operation;
SELECT status, COUNT(*) as count 
FROM videos 
GROUP BY status 
ORDER BY status;

-- =============================================
-- 2. STANDARDIZE TO 3-STATUS SYSTEM
-- =============================================

-- Update documents to use 3-status system
UPDATE documents 
SET status = 'verified' 
WHERE status IN ('accepted', 'approved');

UPDATE documents 
SET status = 'rejected' 
WHERE status = 'refused';

-- Note: 'pending' remains unchanged

-- Update videos to use 3-status system  
UPDATE videos 
SET status = 'verified' 
WHERE status = 'approved';

-- Note: 'pending' and 'rejected' remain unchanged

-- =============================================
-- 3. VERIFY CHANGES
-- =============================================

-- Check updated document status distribution
SELECT 'AFTER MIGRATION - Documents Status Distribution' as operation;
SELECT status, COUNT(*) as count 
FROM documents 
GROUP BY status 
ORDER BY status;

-- Check updated video status distribution
SELECT 'AFTER MIGRATION - Videos Status Distribution' as operation;
SELECT status, COUNT(*) as count 
FROM videos 
GROUP BY status 
ORDER BY status;

-- =============================================
-- 4. ADD STATUS CONSTRAINTS (3-status system)
-- =============================================

-- Add check constraints to ensure only valid status values
-- Documents constraint
ALTER TABLE documents 
DROP CONSTRAINT IF EXISTS check_documents_status;
ALTER TABLE documents 
ADD CONSTRAINT check_documents_status 
CHECK (status IN ('pending', 'rejected', 'verified'));

-- Videos constraint  
ALTER TABLE videos 
DROP CONSTRAINT IF EXISTS check_videos_status;
ALTER TABLE videos 
ADD CONSTRAINT check_videos_status 
CHECK (status IN ('pending', 'rejected', 'verified'));

-- =============================================
-- 5. CREATE STATUS SUMMARY VIEWS
-- =============================================

-- Create a view for content moderation dashboard
DROP VIEW IF EXISTS content_status_summary;
CREATE OR REPLACE VIEW content_status_summary AS
SELECT 
  'documents' as content_type,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY 'documents'), 2) as percentage
FROM documents 
GROUP BY status

UNION ALL

SELECT 
  'videos' as content_type,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY 'videos'), 2) as percentage
FROM videos 
GROUP BY status

ORDER BY content_type, status;

-- =============================================
-- 6. VERIFICATION QUERIES
-- =============================================

-- Show the unified status summary
SELECT 'UNIFIED 3-STATUS SUMMARY' as operation;
SELECT * FROM content_status_summary;

-- Check for any potential orphaned status values
SELECT 'ORPHANED STATUS CHECK' as operation;
SELECT 'documents' as table_name, status, COUNT(*) as count
FROM documents 
WHERE status NOT IN ('pending', 'rejected', 'verified')
GROUP BY status

UNION ALL

SELECT 'videos' as table_name, status, COUNT(*) as count  
FROM videos
WHERE status NOT IN ('pending', 'rejected', 'verified')
GROUP BY status;

-- =============================================
-- 7. ROLLBACK SCRIPT (In case needed)
-- =============================================

/*
-- ROLLBACK SCRIPT - Run only if you need to revert changes

-- Revert documents status changes
UPDATE documents SET status = 'accepted' WHERE status = 'verified';
UPDATE documents SET status = 'refused' WHERE status = 'rejected';

-- Revert videos status changes  
UPDATE videos SET status = 'approved' WHERE status = 'verified';

-- Remove constraints
ALTER TABLE documents DROP CONSTRAINT IF EXISTS check_documents_status;
ALTER TABLE videos DROP CONSTRAINT IF EXISTS check_videos_status;

-- Drop view
DROP VIEW IF EXISTS content_status_summary;
*/

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

SELECT 'STATUS STANDARDIZATION MIGRATION COMPLETED' as status,
       NOW() as completed_at;