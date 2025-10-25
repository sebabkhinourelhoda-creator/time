import { supabase } from './supabaseClient'

// Shared status type for all content - SIMPLIFIED 3-STATUS SYSTEM
export type ContentStatus = 'pending' | 'rejected' | 'verified'

// Simple Video interfaces matching the new database structure
export interface VideoCategory {
  id: number
  name: string
  description?: string
}

export interface Video {
  id: number
  title: string
  description: string
  thumbnail_url?: string
  duration?: string
  category_id: number
  category_name?: string
  status: ContentStatus
  user_id: number
  author_name?: string
  video_url: string
  comment_count?: number
  created_at: string
}

export interface VideoComment {
  id: number
  video_id: number
  user_id?: number
  comment: string
  author_name?: string
  guest_name?: string
  guest_role?: 'doctor' | 'user'
  created_at: string
}

// Fetch video categories (reusing document_categories)
export async function fetchVideoCategories(): Promise<VideoCategory[]> {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching video categories:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in fetchVideoCategories:', error)
    return []
  }
}

// Fetch videos with category and author info
export async function fetchVideos(categoryId?: number, status: string = 'approved'): Promise<Video[]> {
  try {
    let query = (supabase as any)
      .from('videos')
      .select(`
        *,
        document_categories(name),
        users(username, full_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (categoryId && categoryId > 0) {
      query = query.eq('category_id', categoryId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching videos:', error)
      return []
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail_url: item.thumbnail_url,
      duration: item.duration,
      category_id: item.category_id,
      category_name: item.document_categories?.name,
      status: item.status,
      user_id: item.user_id,
      author_name: item.users?.full_name || item.users?.username,
      video_url: item.video_url,
      created_at: item.created_at
    }))
  } catch (error) {
    console.error('Error in fetchVideos:', error)
    return []
  }
}

// Fetch user's videos (for dashboard)
export async function fetchUserVideos(userId: number): Promise<Video[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('videos')
      .select(`
        *,
        document_categories(name),
        users(username, full_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user videos:', error)
      return []
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail_url: item.thumbnail_url,
      duration: item.duration,
      category_id: item.category_id,
      category_name: item.document_categories?.name,
      status: item.status,
      user_id: item.user_id,
      author_name: item.users?.full_name || item.users?.username,
      video_url: item.video_url,
      created_at: item.created_at
    }))
  } catch (error) {
    console.error('Error in fetchUserVideos:', error)
    return []
  }
}

// Fetch comments for a specific video
export async function fetchVideoComments(videoId: number): Promise<VideoComment[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('video_comments')
      .select(`
        *,
        users(username, full_name)
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching video comments:', error)
      return []
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      video_id: item.video_id,
      user_id: item.user_id,
      comment: item.comment,
      author_name: item.users?.full_name || item.users?.username || item.guest_name,
      guest_name: item.guest_name,
      guest_role: item.guest_role,
      created_at: item.created_at
    }))
  } catch (error) {
    console.error('Error in fetchVideoComments:', error)
    return []
  }
}

// Add a new video
export async function addVideo(video: {
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
  duration?: string
  category_id: number
  user_id: number
}): Promise<{ success: boolean; video?: any; error?: string }> {
  try {
    const { data, error } = await (supabase as any)
      .from('videos')
      .insert([video])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding video:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, video: data }
  } catch (error) {
    console.error('Error in addVideo:', error)
    return { success: false, error: 'Failed to add video' }
  }
}

// Add a comment to a video (authenticated user)
export async function addVideoComment(comment: {
  video_id: number
  user_id: number
  comment: string
}): Promise<{ success: boolean; comment?: any; error?: string }> {
  try {
    const { data, error } = await (supabase as any)
      .from('video_comments')
      .insert([comment])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding comment:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, comment: data }
  } catch (error) {
    console.error('Error in addVideoComment:', error)
    return { success: false, error: 'Failed to add comment' }
  }
}

// Add a guest comment to a video
export async function addGuestVideoComment(comment: {
  video_id: number
  guest_name: string
  guest_role: 'doctor' | 'user'
  comment: string
}): Promise<{ success: boolean; comment?: any; error?: string }> {
  try {
    const { data, error } = await (supabase as any)
      .from('video_comments')
      .insert([{
        video_id: comment.video_id,
        comment: comment.comment,
        user_id: null, // No user_id for guest comments
        guest_name: comment.guest_name,
        guest_role: comment.guest_role
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding guest comment:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, comment: data }
  } catch (error) {
    console.error('Error in addGuestVideoComment:', error)
    return { success: false, error: 'Failed to add comment' }
  }
}

// Delete a video
export async function deleteVideo(videoId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('videos')
      .delete()
      .eq('id', videoId)
    
    if (error) {
      console.error('Error deleting video:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in deleteVideo:', error)
    return { success: false, error: 'Failed to delete video' }
  }
}

// Update video status (approve/reject)
export async function updateVideoStatus(videoId: number, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('videos')
      .update({ status })
      .eq('id', videoId)
    
    if (error) {
      console.error('Error updating video status:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateVideoStatus:', error)
    return { success: false, error: 'Failed to update video status' }
  }
}