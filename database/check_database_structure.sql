-- Check database structure and foreign key constraints

-- 1. Check if users table exists and has data
SELECT 'users table' as table_name, COUNT(*) as record_count FROM users;

-- 2. Check if videos table exists and has the foreign key properly set
SELECT 'videos table' as table_name, COUNT(*) as record_count FROM videos;

-- 3. Check current user data
SELECT id, email, username, full_name FROM users ORDER BY id;

-- 4. Check videos and their user references
SELECT v.id, v.title, v.user_id, u.email, u.full_name 
FROM videos v 
LEFT JOIN users u ON v.user_id = u.id;

-- 5. Check if there are any orphaned videos (videos without valid user_id)
SELECT v.id, v.title, v.user_id 
FROM videos v 
LEFT JOIN users u ON v.user_id = u.id 
WHERE u.id IS NULL;

-- 6. Show foreign key constraints on videos table
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='videos';