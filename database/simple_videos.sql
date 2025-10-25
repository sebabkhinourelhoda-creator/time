-- =============================================
-- Simple Video System Database - Compatible with existing structure
-- =============================================

-- =============================================
-- 1. VIDEO CATEGORIES (reuse existing document_categories)
-- =============================================
-- We'll reuse your existing document_categories table for video categories
-- Just add some video-specific categories:

INSERT INTO document_categories (name, description) VALUES
('Educational Videos', 'Medical educational video content'),
('Research Videos', 'Research presentation videos'),
('Patient Stories', 'Patient testimonial videos'),
('Medical Procedures', 'Step-by-step medical procedure videos'),
('Health Awareness', 'General health awareness videos')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. VIDEOS TABLE (Simple structure like documents)
-- =============================================
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,           -- Video file URL (like file_url in documents)
  thumbnail_url TEXT,                -- Video thumbnail image
  duration VARCHAR(10),              -- Duration like "12:45"
  category_id INTEGER REFERENCES document_categories(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected (like documents)
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_videos_category_id ON videos(category_id);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- =============================================
-- 3. VIDEO COMMENTS TABLE (Simple like document comments)
-- =============================================
CREATE TABLE video_comments (
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_video_comments_video_id ON video_comments(video_id);
CREATE INDEX idx_video_comments_user_id ON video_comments(user_id);
CREATE INDEX idx_video_comments_created_at ON video_comments(created_at DESC);

-- =============================================
-- 4. SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample videos (adjust user_id based on your users table)
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, category_id, status, user_id) VALUES
(
  'Understanding Cancer Prevention',
  'A comprehensive guide to cancer prevention methods and lifestyle changes.',
  'https://example.com/videos/cancer-prevention.mp4',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800',
  '15:30',
  (SELECT id FROM document_categories WHERE name = 'Educational Videos'),
  'approved',
  1
),
(
  'DNA Research Breakthrough 2025',
  'Latest findings in DNA research and genetic medicine.',
  'https://example.com/videos/dna-research.mp4', 
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800',
  '22:15',
  (SELECT id FROM document_categories WHERE name = 'Research Videos'),
  'approved',
  1
),
(
  'Patient Recovery Story',
  'Inspiring story of cancer recovery and treatment journey.',
  'https://example.com/videos/patient-story.mp4',
  'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=800', 
  '08:45',
  (SELECT id FROM document_categories WHERE name = 'Patient Stories'),
  'pending',
  1
);

-- Insert sample comments
INSERT INTO video_comments (video_id, user_id, comment) VALUES
(1, 1, 'Very informative video about cancer prevention. Thank you for sharing!'),
(1, 1, 'The lifestyle recommendations are very practical and easy to follow.'),
(2, 1, 'Exciting developments in DNA research. Looking forward to more updates.'),
(3, 1, 'Such an inspiring story. Gives hope to many patients going through similar journeys.');

-- =============================================
-- 5. USEFUL VIEWS FOR EASY QUERYING  
-- =============================================

-- View for approved videos with category info
CREATE VIEW approved_videos AS
SELECT 
  v.*,
  dc.name as category_name,
  u.username,
  u.full_name as author_name,
  COUNT(vc.id) as comment_count
FROM videos v
LEFT JOIN document_categories dc ON v.category_id = dc.id
LEFT JOIN users u ON v.user_id = u.id
LEFT JOIN video_comments vc ON v.id = vc.video_id
WHERE v.status = 'approved'
GROUP BY v.id, dc.name, u.username, u.full_name
ORDER BY v.created_at DESC;

-- =============================================
-- 6. FUNCTIONS FOR EASY DATA ACCESS
-- =============================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_videos_by_category(TEXT);

-- Function to get videos by category
CREATE OR REPLACE FUNCTION get_videos_by_category(category_name_param TEXT)
RETURNS TABLE(
    video_id INTEGER,
    title VARCHAR(500),
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration VARCHAR(10),
    author_name TEXT,
    comment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        v.description,
        v.video_url,
        v.thumbnail_url,
        v.duration,
        u.full_name,
        COUNT(vc.id)
    FROM videos v
    LEFT JOIN document_categories dc ON v.category_id = dc.id
    LEFT JOIN users u ON v.user_id = u.id
    LEFT JOIN video_comments vc ON v.id = vc.video_id
    WHERE v.status = 'approved'
    AND (category_name_param = 'all' OR dc.name = category_name_param)
    GROUP BY v.id, u.full_name
    ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_video_comments(INTEGER);

-- Function to get video comments
CREATE OR REPLACE FUNCTION get_video_comments(video_id_param INTEGER)
RETURNS TABLE(
    comment_id INTEGER,
    comment TEXT,
    author_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vc.id,
        vc.comment,
        u.full_name,
        vc.created_at
    FROM video_comments vc
    LEFT JOIN users u ON vc.user_id = u.id
    WHERE vc.video_id = video_id_param
    ORDER BY vc.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Script completed successfully!
-- =============================================

-- To verify installation, run:
SELECT 
  'Video system installed successfully!' as status,
  COUNT(*) as total_videos,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_videos,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_videos
FROM videos;