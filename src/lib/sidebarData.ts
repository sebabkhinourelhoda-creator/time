import { supabase } from './supabaseClient';

export interface SidebarCounts {
  myDocuments: number;
  myVideos: number;
  totalDocuments: number;
  totalVideos: number;
  pendingDocuments: number;
  pendingVideos: number;
}

export async function fetchSidebarCounts(userId: number): Promise<SidebarCounts> {
  try {
    // Get user's document count
    const { count: myDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);

    // Get user's video count
    const { count: myVideos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);

    // Get total documents count (verified)
    const { count: totalDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');

    // Get total videos count (verified)
    const { count: totalVideos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');

    // Get pending documents count (for user)
    const { count: pendingDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'pending');

    // Get pending videos count (for user)
    const { count: pendingVideos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'pending');

    return {
      myDocuments: myDocuments || 0,
      myVideos: myVideos || 0,
      totalDocuments: totalDocuments || 0,
      totalVideos: totalVideos || 0,
      pendingDocuments: pendingDocuments || 0,
      pendingVideos: pendingVideos || 0
    };
  } catch (error) {
    console.error('Error fetching sidebar counts:', error);
    return {
      myDocuments: 0,
      myVideos: 0,
      totalDocuments: 0,
      totalVideos: 0,
      pendingDocuments: 0,
      pendingVideos: 0
    };
  }
}

export async function fetchUserCollaborations(userId: number): Promise<number> {
  try {
    // This would depend on your collaboration table structure
    // For now, we'll return a placeholder
    const { count } = await supabase
      .from('video_comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return 0;
  }
}