-- Check the constraint definition for status column
SELECT 
    conname,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'documents'::regclass 
  AND conname LIKE '%status%';

-- Alternative way to check constraint
SELECT 
    table_name,
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%status%' 
  AND table_name = 'documents';

-- See all check constraints on documents table
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE table_name = 'documents';

-- After you see the constraint, run this to fix it (UNCOMMENT THE LINE YOU NEED):

-- If the constraint only allows 'pending' and 'verified', this will add 'rejected':
-- ALTER TABLE documents DROP CONSTRAINT documents_status_check;
-- ALTER TABLE documents ADD CONSTRAINT documents_status_check CHECK (status IN ('pending', 'verified', 'rejected'));

-- Or if you want different status values, modify accordingly:
-- ALTER TABLE documents DROP CONSTRAINT documents_status_check;
-- ALTER TABLE documents ADD CONSTRAINT documents_status_check CHECK (status IN ('pending', 'approved', 'rejected'));