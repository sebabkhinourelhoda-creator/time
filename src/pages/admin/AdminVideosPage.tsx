import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Play, Trash2, Shield, Eye, MessageCircle } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';
import { supabase } from '@/lib/supabaseClient';
import { StatusBadge } from '@/components/StatusBadge';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: number;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  users?: {
    username: string;
    full_name: string;
  };
}

interface CommentCount {
  [key: number]: number;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [commentCounts, setCommentCounts] = useState<CommentCount>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [searchTerm, statusFilter, videos]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          user_id,
          status,
          created_at,
          users (username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const videos = data || [];
      setVideos(videos);
      
      // Load comment counts
      await loadCommentCounts(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Error Loading Videos',
        description: 'Failed to load videos from database.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCommentCounts = async (videos: Video[]) => {
    try {
      const counts: CommentCount = {};
      
      for (const video of videos) {
        const { count } = await supabase
          .from('video_comments')
          .select('*', { count: 'exact', head: true })
          .eq('video_id', video.id);
        
        counts[video.id] = count || 0;
      }
      
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error loading comment counts:', error);
    }
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.users?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(video => video.status === statusFilter);
    }

    setFilteredVideos(filtered);
  };

  const updateVideoStatus = async (videoId: number, newStatus: 'pending' | 'verified' | 'rejected') => {
    try {
      const { error } = await (supabase as any)
        .from('videos')
        .update({ status: newStatus })
        .eq('id', videoId);

      if (error) throw error;

      // Update local state
      setVideos(videos.map(video =>
        video.id === videoId ? { ...video, status: newStatus } : video
      ));

      toast({
        title: 'Status Updated',
        description: `Video status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating video status:', error);
      toast({
        title: 'Error Updating Status',
        description: 'Failed to update video status.',
        variant: 'destructive'
      });
    }
  };

  const deleteVideo = async (videoId: number) => {
    try {
      // Get video details first to get the file path
      const { data: video, error: fetchError } = await supabase
        .from('videos')
        .select('file_url')
        .eq('id', videoId)
        .single() as { data: { file_url: string } | null, error: any };

      if (fetchError) throw fetchError;

      // First delete related comments
      await supabase
        .from('video_comments')
        .delete()
        .eq('video_id', videoId);

      // Delete the video file from storage bucket if it exists
      if (video && video.file_url) {
        // Extract filename from URL (assuming URL structure: .../storage/v1/object/public/videos/filename)
        const urlParts = video.file_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('videos')
            .remove([fileName]);
          
          if (storageError) {
            console.warn('Error deleting video file from storage:', storageError);
            // Continue with database deletion even if storage deletion fails
          }
        }
      }

      // Then delete the video record from database
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      // Update local state
      setVideos(videos.filter(video => video.id !== videoId));

      toast({
        title: 'Video Deleted',
        description: 'Video file and database record have been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Error Deleting Video',
        description: 'Failed to delete video.',
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <AdminSidebar />
        
        {/* Main content with responsive left margin */}
        <div className="md:ml-64 pt-16 mt-16 p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              Video Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage video content, approvals, and moderation.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by title, description, or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Videos Table */}
          <Card>
            <CardHeader>
              <CardTitle>Videos ({filteredVideos.length})</CardTitle>
              <CardDescription>
                All videos uploaded to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading videos...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Video</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video) => {
                      return (
                        <TableRow key={video.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                {video.thumbnail_url ? (
                                  <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <Play className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium line-clamp-1">{video.title}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {video.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {video.users?.full_name || video.users?.username || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{video.users?.username || 'unknown'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={video.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-gray-500" />
                              <span>{commentCounts[video.id] || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(video.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={video.status}
                                onValueChange={(value: any) => updateVideoStatus(video.id, value)}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="verified">Verified</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>

                              <Button variant="outline" size="sm" asChild>
                                <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this video? This will also delete all associated comments. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteVideo(video.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}