# 🎥 Simple Video System Setup Guide

## 📋 **What You Need to Do**

### 1. **Run the Database Script**
Copy and paste the content from `database/simple_videos.sql` into your Supabase SQL editor and run it. This will:
- ✅ Reuse your existing `document_categories` table for video categories
- ✅ Create the `videos` table (simple structure like documents)
- ✅ Create the `video_comments` table
- ✅ Add sample data for testing
- ✅ Create useful views and functions

### 2. **Replace Your Video Files**
Replace these files with the new simplified versions:

**Library File:**
- Replace `src/lib/videos.ts` with `src/lib/videos-simple.ts` (or rename)

**Page Files:**
- Replace `src/pages/VideoManagement.tsx` with `src/pages/VideoManagement-Simple.tsx` (or rename)
- Replace `src/pages/VideosExplore.tsx` with `src/pages/VideosExplore-Simple.tsx` (or rename)

## 🗄️ **Database Structure**

### **Tables Created:**

1. **videos** (Main video table - simple like documents)
   - `id` - Primary key
   - `title` - Video title  
   - `description` - Video description
   - `video_url` - Video file URL *(like file_url in documents)*
   - `thumbnail_url` - Thumbnail image
   - `duration` - Duration like "12:45"
   - `category_id` - Links to document_categories
   - `status` - pending/approved/rejected *(like documents)*
   - `user_id` - Who uploaded it
   - `created_at` - When uploaded
   - `updated_at` - Last modified

2. **video_comments** (Simple comments)
   - `id` - Primary key
   - `video_id` - Which video
   - `user_id` - Who commented  
   - `comment` - The comment text
   - `created_at` - When commented

3. **document_categories** *(Reused for videos)*
   - Your existing table with added video categories

## 🚀 **Features Included**

### **For Users (VideoManagement page):**
- ✅ Upload videos with URL, thumbnail, duration, category
- ✅ View their own videos with status (pending/approved/rejected)
- ✅ Search and filter their videos
- ✅ Delete videos
- ✅ Simple upload form (like document upload)

### **For Public (VideosExplore page):**
- ✅ View all approved videos
- ✅ Search videos by title, description, author
- ✅ Filter by category  
- ✅ Beautiful video cards with thumbnails
- ✅ Click to play videos

### **API Functions Available:**
```typescript
// Get categories (reuses document_categories)
fetchVideoCategories()

// Get approved videos for public viewing
fetchVideos(categoryId?, status = 'approved')

// Get user's videos for dashboard
fetchUserVideos(userId)

// Get comments for a video
fetchVideoComments(videoId)

// Upload new video
addVideo(videoData)

// Delete video
deleteVideo(videoId)

// Add comment to video
addVideoComment(commentData)

// Update video status (approve/reject)
updateVideoStatus(videoId, status)
```

## 📝 **Sample Data**

The script includes sample videos:
- "Understanding Cancer Prevention" (Educational)
- "DNA Research Breakthrough 2025" (Research) 
- "Patient Recovery Story" (Patient Stories)

## 🔧 **Configuration**

Make sure your `.env` has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 **How It Works**

1. **User uploads video:** Fills form with title, description, video URL, thumbnail, duration, category
2. **Status starts as "pending":** Admin can approve/reject later  
3. **Approved videos show publicly:** In VideosExplore page
4. **Comments system:** Users can comment on videos
5. **Simple like documents:** Same pattern as your document system

## 🔄 **Next Steps After Setup**

1. Run the database script
2. Replace the files
3. Test uploading a video
4. Test viewing videos on explore page  
5. Test comments functionality
6. Add admin approval workflow if needed

## 🎨 **Customization Options**

- Add video analytics (views, likes)
- Add video playlists
- Add video ratings
- Add video tags
- Add video transcripts
- Add video chapters

The system is designed to be simple but extensible! 🚀