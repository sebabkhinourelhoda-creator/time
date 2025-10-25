import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Video, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Play, 
  Calendar,
  User,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  fetchVideos, 
  fetchVideoComments, 
  Video as VideoType, 
  VideoComment 
} from '@/lib/videos';

export default function AdminVideoManagement() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [videoComments, setVideoComments] = useState<VideoComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      // Load all videos regardless of status for admin
      const videosData = await fetchVideos();
      console.log('Admin loaded videos:', videosData.length);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Error Loading Videos',
        description: 'Failed to load videos list.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVideoComments = async (videoId: number) => {
    setLoadingComments(true);
    try {
      const comments = await fetchVideoComments(videoId);
      setVideoComments(comments);
    } catch (error) {
      console.error('Error loading video comments:', error);
      toast({
        title: 'Error Loading Comments',
        description: 'Failed to load video comments.',
        variant: 'destructive'
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    setDeletingVideoId(videoId);
    try {
      // TODO: Implement actual delete API call
      // await deleteVideo(videoId);
      
      setTimeout(() => {
        setVideos(videos.filter(v => v.id !== videoId));
        setDeletingVideoId(null);
        toast({
          title: 'Video Deleted',
          description: 'Video has been successfully removed from the system.',
        });
      }, 1000);
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete video. Please try again.',
        variant: 'destructive'
      });
      setDeletingVideoId(null);
    }
  };

  const handleStatusChange = async (videoId: number, newStatus: string) => {
    try {
      // TODO: Implement actual status change API call
      // await updateVideoStatus(videoId, newStatus);
      
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, status: newStatus as any } : v
      ));
      
      toast({
        title: 'Status Updated',
        description: `Video status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating video status:', error);
      toast({
        title: 'Status Update Failed',
        description: 'Failed to update video status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleViewVideo = (video: VideoType) => {
    setSelectedVideo(video);
    loadVideoComments(video.id);
  };

  // Filter videos based on search and status
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.author_name && video.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Management
          </CardTitle>
          <CardDescription>
            Manage all videos, review submissions, and moderate content.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos by title, description, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Videos Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No videos found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {video.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {video.description}
                            </p>
                            {video.category_name && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {video.category_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          {video.author_name || 'Unknown'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <StatusBadge status={video.status} />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(video.created_at)}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Details"
                                onClick={() => handleViewVideo(video)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Video Details</DialogTitle>
                                <DialogDescription>
                                  Review video information and manage comments.
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedVideo && (
                                <div className="space-y-6">
                                  {/* Video Info */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Video Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div><strong>Title:</strong> {selectedVideo.title}</div>
                                        <div><strong>Author:</strong> {selectedVideo.author_name}</div>
                                        <div><strong>Category:</strong> {selectedVideo.category_name}</div>
                                        <div><strong>Status:</strong> <StatusBadge status={selectedVideo.status} /></div>
                                        <div><strong>Created:</strong> {formatDate(selectedVideo.created_at)}</div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Actions</h4>
                                      <div className="space-y-2">
                                        {selectedVideo.video_url && (
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.open(selectedVideo.video_url, '_blank')}
                                            className="w-full justify-start"
                                          >
                                            <Play className="h-4 w-4 mr-2" />
                                            Watch Video
                                          </Button>
                                        )}
                                        
                                        <div className="flex gap-1">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedVideo.id, 'verified')}
                                            disabled={selectedVideo.status === 'verified'}
                                            className="flex-1"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedVideo.id, 'rejected')}
                                            disabled={selectedVideo.status === 'rejected'}
                                            className="flex-1"
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                      {selectedVideo.description || 'No description provided.'}
                                    </p>
                                  </div>
                                  
                                  {/* Comments */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <MessageCircle className="h-4 w-4" />
                                      Comments ({videoComments.length})
                                    </h4>
                                    
                                    {loadingComments ? (
                                      <div className="text-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                      </div>
                                    ) : videoComments.length > 0 ? (
                                      <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {videoComments.map((comment) => (
                                          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <strong className="text-sm">
                                                  {comment.author_name || comment.guest_name}
                                                </strong>
                                                {comment.guest_role && (
                                                  <Badge variant="outline" className="text-xs">
                                                    {comment.guest_role}
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">
                                                  {formatDate(comment.created_at)}
                                                </span>
                                                <Button variant="ghost" size="sm" className="text-red-600">
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.comment}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 text-center py-4">
                                        No comments yet.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="ghost" size="sm" title="Edit Video">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Status Change Buttons */}
                          {video.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(video.id, 'verified')}
                                title="Approve Video"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(video.id, 'rejected')}
                                title="Reject Video"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                disabled={deletingVideoId === video.id}
                              >
                                {deletingVideoId === video.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "<strong>{video.title}</strong>"? 
                                  This action cannot be undone and will permanently remove the video and all its comments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Video
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {videos.filter(v => v.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {videos.filter(v => v.status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {videos.filter(v => v.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}