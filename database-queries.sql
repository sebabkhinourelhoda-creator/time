-- Check the documents table structure and constraints
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'documents' 
ORDER BY ordinal_position;

-- Check all constraints on the documents table
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'documents'::regclass;

-- Specifically check the status column constraint
SELECT 
    conname,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'documents'::regclass 
  AND conname LIKE '%status%';

-- Check what values are currently in the status column
SELECT DISTINCT status, COUNT(*) as count
FROM documents 
GROUP BY status
ORDER BY status;

-- Check the specific document that's failing (ID 12)
SELECT id, title, status, created_at, updated_at
FROM documents 
WHERE id = 12;