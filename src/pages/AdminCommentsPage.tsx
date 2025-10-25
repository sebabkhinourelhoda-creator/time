import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Shield, MessageCircle, User, Video } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';
import { supabase } from '@/lib/supabaseClient';

interface Comment {
  id: number;
  comment: string;
  video_id: number;
  user_id?: number;
  guest_name?: string;
  guest_role?: string;
  created_at: string;
  users?: {
    username: string;
    full_name: string;
  };
  videos?: {
    title: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'user' | 'guest'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    filterComments();
  }, [searchTerm, typeFilter, comments]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .select(`
          id,
          comment,
          video_id,
          user_id,
          guest_name,
          guest_role,
          created_at,
          users (username, full_name),
          videos (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error Loading Comments',
        description: 'Failed to load comments from database.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterComments = () => {
    let filtered = comments;

    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.users?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.videos?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'user') {
        filtered = filtered.filter(comment => comment.user_id !== null);
      } else if (typeFilter === 'guest') {
        filtered = filtered.filter(comment => comment.user_id === null);
      }
    }

    setFilteredComments(filtered);
  };

  const deleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from('video_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      setComments(comments.filter(comment => comment.id !== commentId));

      toast({
        title: 'Comment Deleted',
        description: 'Comment has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error Deleting Comment',
        description: 'Failed to delete comment.',
        variant: 'destructive'
      });
    }
  };

  const getCommentAuthor = (comment: Comment) => {
    if (comment.user_id && comment.users) {
      return {
        name: comment.users.full_name || comment.users.username,
        username: comment.users.username,
        type: 'user' as const
      };
    } else {
      return {
        name: comment.guest_name || 'Anonymous',
        username: null,
        type: 'guest' as const
      };
    }
  };

  const getAuthorBadge = (type: 'user' | 'guest', role?: string) => {
    if (type === 'user') {
      return <Badge variant="secondary">Registered User</Badge>;
    } else {
      return (
        <Badge variant="outline">
          Guest {role && `(${role})`}
        </Badge>
      );
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
              Comment Management
            </h1>
            <p className="text-gray-600 mt-2">
              Moderate and manage comments from users and guests.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by content, author, or video title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Comments</SelectItem>
                    <SelectItem value="user">User Comments</SelectItem>
                    <SelectItem value="guest">Guest Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Comments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({filteredComments.length})</CardTitle>
              <CardDescription>
                All comments posted on videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading comments...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comment</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.map((comment) => {
                      const author = getCommentAuthor(comment);
                      
                      return (
                        <TableRow key={comment.id}>
                          <TableCell>
                            <div className="max-w-md">
                              <p className="text-sm line-clamp-3">{comment.comment}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {author.type === 'user' ? (
                                <User className="h-4 w-4 text-blue-600" />
                              ) : (
                                <MessageCircle className="h-4 w-4 text-gray-600" />
                              )}
                              <div>
                                <div className="font-medium">{author.name}</div>
                                {author.username && (
                                  <div className="text-sm text-gray-500">@{author.username}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-gray-500" />
                              <span className="text-sm line-clamp-1">
                                {comment.videos?.title || 'Unknown Video'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getAuthorBadge(author.type, comment.guest_role)}
                          </TableCell>
                          <TableCell>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this comment? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteComment(comment.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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