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
  MessageCircle, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Video,
  FileText,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock comment type
interface Comment {
  id: number;
  comment: string;
  user_name?: string;
  guest_name?: string;
  guest_role?: 'doctor' | 'user';
  created_at: string;
  content_type: 'video' | 'document';
  content_id: number;
  content_title: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    comment: 'This is very informative and helpful for understanding cancer prevention strategies.',
    user_name: 'Dr. Sarah Johnson',
    created_at: '2024-10-24T10:30:00Z',
    content_type: 'video',
    content_id: 1,
    content_title: 'Cancer Prevention Guidelines Video'
  },
  {
    id: 2,
    comment: 'Could you provide more details about the immunotherapy side effects?',
    guest_name: 'John Doe',
    guest_role: 'user',
    created_at: '2024-10-23T15:45:00Z',
    content_type: 'video',
    content_id: 2,
    content_title: 'Immunotherapy Treatment Overview'
  },
  {
    id: 3,
    comment: 'Excellent research paper. The methodology is very thorough.',
    guest_name: 'Dr. Michael Chen',
    guest_role: 'doctor',
    created_at: '2024-10-22T09:20:00Z',
    content_type: 'document',
    content_id: 1,
    content_title: 'Cancer Research Study 2024'
  },
  {
    id: 4,
    comment: 'Thank you for sharing this valuable information with the community.',
    user_name: 'Jane Smith',
    created_at: '2024-10-21T14:10:00Z',
    content_type: 'document',
    content_id: 2,
    content_title: 'Patient Care Guidelines'
  },
  {
    id: 5,
    comment: 'This is spam content and should be removed immediately.',
    guest_name: 'Spam User',
    guest_role: 'user',
    created_at: '2024-10-20T11:00:00Z',
    content_type: 'video',
    content_id: 3,
    content_title: 'Medical Education Video'
  }
];

export default function AdminCommentManagement() {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const commentsData = await fetchAllComments();
      setTimeout(() => {
        setComments(mockComments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error Loading Comments',
        description: 'Failed to load comments list.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId);
    try {
      // TODO: Implement actual delete API call
      // await deleteComment(commentId);
      
      setTimeout(() => {
        setComments(comments.filter(c => c.id !== commentId));
        setDeletingCommentId(null);
        toast({
          title: 'Comment Deleted',
          description: 'Comment has been successfully removed from the system.',
        });
      }, 1000);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive'
      });
      setDeletingCommentId(null);
    }
  };

  const handleViewContent = (comment: Comment) => {
    // Navigate to the content (video or document)
    const baseUrl = comment.content_type === 'video' ? '/videos' : '/documents';
    window.open(`${baseUrl}#${comment.content_id}`, '_blank');
  };

  // Filter comments based on search and content type
  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comment.user_name && comment.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comment.guest_name && comment.guest_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      comment.content_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesContentType = selectedContentType === 'all' || comment.content_type === selectedContentType;
    
    return matchesSearch && matchesContentType;
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

  const getCommentAuthor = (comment: Comment) => {
    if (comment.user_name) {
      return { name: comment.user_name, type: 'registered', role: null };
    } else if (comment.guest_name) {
      return { name: comment.guest_name, type: 'guest', role: comment.guest_role };
    }
    return { name: 'Unknown', type: 'unknown', role: null };
  };

  const getContentIcon = (type: string) => {
    return type === 'video' ? Video : FileText;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading comments...</p>
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
            <MessageCircle className="h-5 w-5" />
            Comment Management
          </CardTitle>
          <CardDescription>
            Moderate user comments and maintain community standards.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search comments by content, author, or related content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Content</option>
                <option value="video">Videos Only</option>
                <option value="document">Documents Only</option>
              </select>
            </div>
          </div>

          {/* Comments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comment</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No comments found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComments.map((comment) => {
                    const author = getCommentAuthor(comment);
                    const ContentIcon = getContentIcon(comment.content_type);
                    
                    return (
                      <TableRow key={comment.id}>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-3">
                            {comment.comment}
                          </p>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {author.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Badge 
                                  variant={author.type === 'registered' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {author.type === 'registered' ? 'Registered' : 'Guest'}
                                </Badge>
                                {author.role && (
                                  <Badge variant="outline" className="text-xs">
                                    {author.role}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ContentIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {comment.content_title}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  comment.content_type === 'video' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'
                                }`}
                              >
                                {comment.content_type}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {formatDate(comment.created_at)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="View Content"
                              onClick={() => handleViewContent(comment)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="View Full Comment"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  disabled={deletingCommentId === comment.id}
                                >
                                  {deletingCommentId === comment.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this comment by <strong>{author.name}</strong>? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="my-4 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700 italic">
                                    "{comment.comment}"
                                  </p>
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Comment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {comments.length}
              </div>
              <div className="text-sm text-gray-600">Total Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {comments.filter(c => c.content_type === 'video').length}
              </div>
              <div className="text-sm text-gray-600">Video Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {comments.filter(c => c.content_type === 'document').length}
              </div>
              <div className="text-sm text-gray-600">Document Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {comments.filter(c => c.guest_name).length}
              </div>
              <div className="text-sm text-gray-600">Guest Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}