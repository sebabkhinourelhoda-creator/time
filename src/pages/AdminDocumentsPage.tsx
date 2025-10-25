import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, FileText, Trash2, Shield, Eye, Download } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';
import { supabase } from '@/lib/supabaseClient';
import { StatusBadge } from '@/components/StatusBadge';

interface Document {
  id: number;
  title: string;
  description: string;
  file_url: string;
  category_id: number;
  user_id: number;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  users?: {
    username: string;
    full_name: string;
  };
  document_categories?: {
    name: string;
  };
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, statusFilter, documents]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          document_categories (name),
          users (username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error Loading Documents',
        description: 'Failed to load documents from database.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.users?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  };

  const updateDocumentStatus = async (documentId: number, newStatus: 'pending' | 'verified' | 'rejected') => {
    try {
      const { error } = await (supabase as any)
        .from('documents')
        .update({ status: newStatus })
        .eq('id', documentId);

      if (error) throw error;

      // Update local state
      setDocuments(documents.map(doc =>
        doc.id === documentId ? { ...doc, status: newStatus } : doc
      ));

      toast({
        title: 'Status Updated',
        description: `Document status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: 'Error Updating Status',
        description: 'Failed to update document status.',
        variant: 'destructive'
      });
    }
  };

  const deleteDocument = async (documentId: number) => {
    try {
      // Get document details first to get the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', documentId)
        .single() as { data: { file_url: string } | null, error: any };

      if (fetchError) throw fetchError;

      // Delete the document file from storage bucket if it exists
      if (document && document.file_url) {
        // Extract filename from URL (assuming URL structure: .../storage/v1/object/public/documents/filename)
        const urlParts = document.file_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([fileName]);
          
          if (storageError) {
            console.warn('Error deleting document file from storage:', storageError);
            // Continue with database deletion even if storage deletion fails
          }
        }
      }

      // Then delete the document record from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentId));

      toast({
        title: 'Document Deleted',
        description: 'Document file and database record have been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error Deleting Document',
        description: 'Failed to delete document.',
        variant: 'destructive'
      });
    }
  };

  const getFileTypeIcon = (categoryName: string) => {
    const category = categoryName.toLowerCase();
    if (category.includes('research') || category.includes('paper')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    } else if (category.includes('guide') || category.includes('tutorial')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else if (category.includes('fact') || category.includes('info')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    } else if (category.includes('case') || category.includes('study')) {
      return <FileText className="h-5 w-5 text-purple-600" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatFileSize = (url: string) => {
    // This would need to be implemented based on how file sizes are stored
    return 'Unknown size';
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <AdminSidebar />
        
        <div className="md:ml-64 pt-20 p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              Document Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage document content, approvals, and moderation.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter documents</CardDescription>
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

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              <CardDescription>
                All documents uploaded to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading documents...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => {
                      return (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getFileTypeIcon(document.document_categories?.name || 'Unknown')}
                              <div>
                                <div className="font-medium line-clamp-1">{document.title}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {document.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {document.users?.full_name || document.users?.username || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{document.users?.username || 'unknown'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {document.document_categories?.name || 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={document.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(document.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={document.status}
                                onValueChange={(value: any) => updateDocumentStatus(document.id, value)}
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
                                <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>

                              <Button variant="outline" size="sm" asChild>
                                <a href={document.file_url} download>
                                  <Download className="h-4 w-4" />
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
                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this document? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteDocument(document.id)}
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