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
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/StatusBadge';

// Mock document type
interface Document {
  id: number;
  title: string;
  description: string;
  author_name: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category_name?: string;
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 1,
    title: 'Cancer Prevention Guidelines 2024',
    description: 'Comprehensive guidelines for cancer prevention strategies',
    author_name: 'Dr. Sarah Johnson',
    status: 'verified',
    created_at: '2024-10-20T10:30:00Z',
    file_url: '#',
    file_type: 'PDF',
    file_size: 2458000,
    category_name: 'Guidelines'
  },
  {
    id: 2,
    title: 'Research on Immunotherapy',
    description: 'Latest findings in cancer immunotherapy treatments',
    author_name: 'Dr. Michael Chen',
    status: 'pending',
    created_at: '2024-10-22T14:15:00Z',
    file_url: '#',
    file_type: 'PDF',
    file_size: 1850000,
    category_name: 'Research'
  },
  {
    id: 3,
    title: 'Patient Care Protocol',
    description: 'Standard operating procedures for patient care',
    author_name: 'Dr. Emily Davis',
    status: 'rejected',
    created_at: '2024-10-18T09:45:00Z',
    file_url: '#',
    file_type: 'DOCX',
    file_size: 890000,
    category_name: 'Protocols'
  }
];

export default function AdminDocumentManagement() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const documentsData = await fetchAllDocuments();
      setTimeout(() => {
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error Loading Documents',
        description: 'Failed to load documents list.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    setDeletingDocId(docId);
    try {
      // TODO: Implement actual delete API call
      // await deleteDocument(docId);
      
      setTimeout(() => {
        setDocuments(documents.filter(d => d.id !== docId));
        setDeletingDocId(null);
        toast({
          title: 'Document Deleted',
          description: 'Document has been successfully removed from the system.',
        });
      }, 1000);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive'
      });
      setDeletingDocId(null);
    }
  };

  const handleStatusChange = async (docId: number, newStatus: string) => {
    try {
      // TODO: Implement actual status change API call
      // await updateDocumentStatus(docId, newStatus);
      
      setDocuments(documents.map(d => 
        d.id === docId ? { ...d, status: newStatus as any } : d
      ));
      
      toast({
        title: 'Status Updated',
        description: `Document status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: 'Status Update Failed',
        description: 'Failed to update document status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading documents...</p>
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
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
          <CardDescription>
            Manage all documents, review submissions, and moderate content.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents by title, description, or author..."
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

          {/* Documents Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No documents found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {doc.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {doc.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {doc.category_name && (
                                <Badge variant="outline" className="text-xs">
                                  {doc.category_name}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-400">
                                {doc.file_type} • {formatFileSize(doc.file_size)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          {doc.author_name}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(doc.created_at)}
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
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Document Details</DialogTitle>
                                <DialogDescription>
                                  Review document information and manage status.
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedDocument && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Document Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div><strong>Title:</strong> {selectedDocument.title}</div>
                                        <div><strong>Author:</strong> {selectedDocument.author_name}</div>
                                        <div><strong>Category:</strong> {selectedDocument.category_name}</div>
                                        <div><strong>Type:</strong> {selectedDocument.file_type}</div>
                                        <div><strong>Size:</strong> {formatFileSize(selectedDocument.file_size)}</div>
                                        <div><strong>Status:</strong> <StatusBadge status={selectedDocument.status} /></div>
                                        <div><strong>Created:</strong> {formatDate(selectedDocument.created_at)}</div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Actions</h4>
                                      <div className="space-y-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => window.open(selectedDocument.file_url, '_blank')}
                                          className="w-full justify-start"
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Download File
                                        </Button>
                                        
                                        <div className="flex gap-1">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedDocument.id, 'verified')}
                                            disabled={selectedDocument.status === 'verified'}
                                            className="flex-1"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange(selectedDocument.id, 'rejected')}
                                            disabled={selectedDocument.status === 'rejected'}
                                            className="flex-1"
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                      {selectedDocument.description || 'No description provided.'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Download"
                            onClick={() => window.open(doc.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm" title="Edit Document">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Status Change Buttons */}
                          {doc.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(doc.id, 'verified')}
                                title="Approve Document"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(doc.id, 'rejected')}
                                title="Reject Document"
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
                                disabled={deletingDocId === doc.id}
                              >
                                {deletingDocId === doc.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "<strong>{doc.title}</strong>"? 
                                  This action cannot be undone and will permanently remove the document.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Document
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
                {documents.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}