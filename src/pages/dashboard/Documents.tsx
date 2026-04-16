import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCategories, fetchDocuments, createDocument, updateDocument, deleteDocument, type Document, type DocumentCategory } from "@/lib/documents";
import { Search, Download, ExternalLink, Filter, Upload, Loader2, CheckCircle, XCircle, Clock, Edit, Trash2, Grid, List, FileTextIcon } from "lucide-react";
import ImprovedFileUpload from "@/components/ImprovedFileUpload";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useToast } from "@/hooks/use-toast";
import { NavBar } from "@/components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import type { FC } from 'react';

const Documents: FC = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { toast } = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    journal: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      loadDocuments();
    }
  }, [selectedCategory, searchTerm, user, authLoading]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDocuments = async () => {
    if (!user || authLoading) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading documents with filters:', { selectedCategory, searchTerm });
      const data = await fetchDocuments({
        category_id: selectedCategory || undefined,
        search: searchTerm || undefined,
        // Show all documents including pending ones, but only for current user
        showAll: true,
        user_id: user?.id
      });
      console.log('Documents loaded:', data);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'refused':
        return <XCircle className="text-red-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'verified':
        return <CheckCircle className="text-blue-500" size={16} />;
      default:
        return null;
    }
  };

  const isUploadDisabled = () => {
    return !newDocument.title.trim() || 
           !newDocument.description.trim() || 
           !selectedCategory || 
           !newDocument.year || 
           newDocument.year < 1900 || 
           newDocument.year > new Date().getFullYear();
  };

  const validateRequiredFields = () => {
    const errors = [];
    
    if (!newDocument.title.trim()) {
      errors.push("Document title is required");
    }
    
    if (!newDocument.description.trim()) {
      errors.push("Document description is required");
    }
    
    if (!selectedCategory) {
      errors.push("Please select a category");
    }
    
    if (!newDocument.year || newDocument.year < 1900 || newDocument.year > new Date().getFullYear()) {
      errors.push("Please enter a valid year");
    }
    
    return errors;
  };

  const handleUpload = async (url: string, fileName: string) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to upload documents.",
        });
        return;
      }

      if (!categories.length) {
        toast({
          variant: "destructive",
          title: "Categories Loading",
          description: "Please wait for categories to load before uploading.",
        });
        return;
      }

      // Validate required fields before upload
      const validationErrors = validateRequiredFields();
      if (validationErrors.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Required Information",
          description: validationErrors.join(", "),
        });
        return;
      }

      const documentData = {
        title: newDocument.title.trim(),
        description: newDocument.description.trim(),
        file_url: url,
        category_id: selectedCategory,
        status: "pending" as const,
        year: newDocument.year,
        journal: newDocument.journal.trim() || '',
        user_id: user.id
      };

      console.log('Creating document with data:', documentData);
      
      const result = await createDocument(documentData);
      console.log('Document created successfully:', result);
      
      // Show success toast
      toast({
        title: "Upload Successful!",
        description: `${fileName} has been uploaded and is pending review.`,
      });
      
      setShowUpload(false);
      setNewDocument({
        title: "",
        description: "",
        journal: "",
        year: new Date().getFullYear(),
      });
      
      // Reload documents to show the new one
      await loadDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleEdit = async (doc: Document) => {
    setEditingDoc(doc);
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    
    try {
      await updateDocument(editingDoc.id, {
        title: editingDoc.title,
        description: editingDoc.description,
        journal: editingDoc.journal,
        year: editingDoc.year
      });
      setEditingDoc(null);
      await loadDocuments();
      toast({
        title: "Document Updated",
        description: "Your document has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Error updating document. Please try again.",
      });
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      await deleteDocument(docId);
      await loadDocuments();
      toast({
        title: "Document Deleted",
        description: "The document and its file have been permanently deleted from both your library and our storage system.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed", 
        description: error instanceof Error ? error.message : "Error deleting document. Please try again.",
      });
    }
  };

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />
        <div className="flex-1 lg:pl-64 min-h-screen bg-background">
          <NavBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
          <div className="w-full py-4 px-4 lg:py-8 lg:px-6 space-y-6 lg:space-y-8 mt-16 min-h-screen bg-background">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      <div className="flex-1 lg:pl-64 min-h-screen bg-background">
        <NavBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div className="w-full py-4 px-4 lg:py-8 lg:px-6 space-y-6 lg:space-y-8 mt-16 min-h-screen bg-background">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Documents
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Upload, manage, and access your medical documents and research papers
              </p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 lg:items-center">
              <div className="flex bg-background border-2 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="flex-1 sm:flex-initial"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Cards</span>
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex-1 sm:flex-initial"
                >
                  <List className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Table</span>
                </Button>
              </div>
              {user && (
                <Button
                  onClick={() => setShowUpload(!showUpload)}
                  className="border-2 hover:bg-secondary/10 w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="text-xs lg:text-sm text-muted-foreground">Total Documents</div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mt-1">{documents.length}</div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="text-xs lg:text-sm text-muted-foreground">Pending Review</div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mt-1">
                  {documents.filter(d => d.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="text-xs lg:text-sm text-muted-foreground">Verified</div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mt-1">
                  {documents.filter(d => d.status === 'verified').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card className="border-2 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-muted-foreground" size={20} />
                <Button
                  key="all"
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="border-2 hover:bg-secondary/10"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="border-2 hover:bg-secondary/10"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

        {showUpload && (
          <Card className="border-2 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Upload New Document
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4 order-2 lg:order-1">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      Document Title 
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter document title"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                      className={`mt-1 bg-card/50 ${!newDocument.title.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                      required
                    />
                    {!newDocument.title.trim() && (
                      <p className="text-xs text-red-500 mt-1">Title is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      Description 
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Enter document description"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                      className={`mt-1 bg-card/50 ${!newDocument.description.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                      rows={3}
                      required
                    />
                    {!newDocument.description.trim() && (
                      <p className="text-xs text-red-500 mt-1">Description is required</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Journal</label>
                      <Input
                        placeholder="Journal name (optional)"
                        value={newDocument.journal}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, journal: e.target.value }))}
                        className="mt-1 bg-card/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        Year 
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="Publication year"
                        value={newDocument.year}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                        min={1900}
                        max={new Date().getFullYear()}
                        className={`mt-1 bg-card/50 ${(!newDocument.year || newDocument.year < 1900 || newDocument.year > new Date().getFullYear()) ? 'border-red-300 focus:border-red-500' : ''}`}
                        required
                      />
                      {(!newDocument.year || newDocument.year < 1900 || newDocument.year > new Date().getFullYear()) && (
                        <p className="text-xs text-red-500 mt-1">Valid year is required</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      Category 
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedCategory?.toString() || ""}
                      onValueChange={(value) => setSelectedCategory(value ? parseInt(value) : null)}
                      required
                    >
                      <SelectTrigger className={`mt-1 bg-card/50 ${!selectedCategory ? 'border-red-300 focus:border-red-500' : ''}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedCategory && (
                      <p className="text-xs text-red-500 mt-1">Please select a category</p>
                    )}
                  </div>
                  
                  {/* Required fields notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      Required fields must be filled before uploading
                    </p>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <ImprovedFileUpload 
                    onUploadComplete={handleUpload}
                    acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg']}
                    maxSize={10}
                    isDisabled={isUploadDisabled()}
                    disabledMessage="Please fill in all required fields (title, description, category, and year) before uploading"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="group relative">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 rounded-2xl overflow-hidden">
                  {/* Card Header with Status Indicator */}
                  <div className="relative h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div className={`absolute right-0 top-0 h-full w-20 ${
                      doc.status === 'verified' ? 'bg-green-500' : 
                      doc.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FileTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Badge 
                            variant="outline" 
                            className="mb-2 bg-slate-50 text-slate-700 border-slate-300 font-medium"
                          >
                            {doc.category?.name}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {getStatusIcon(doc.status)}
                            <span>{doc.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {doc.title}
                      </h3>
                      
                      {doc.journal && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          <span className="italic font-medium">{doc.journal}</span>
                        </div>
                      )}
                      
                      <p className="text-slate-600 line-clamp-3 leading-relaxed">
                        {doc.description || "No description available"}
                      </p>
                    </div>

                    {/* Status and Date */}
                    <div className="flex items-center justify-between py-3 border-t border-slate-100">
                      <Badge 
                        variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                        className={`${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        } shadow-sm font-medium capitalize`}
                      >
                        {doc.status}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(doc.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => window.open(doc.file_url, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(doc)}
                        className="bg-white/80 backdrop-blur-sm hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <Edit size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-white/80 backdrop-blur-sm hover:bg-red-50 border-slate-300 text-red-600 hover:text-red-700 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-800">Delete Document</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600">
                              Are you sure you want to delete "{doc.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(doc.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5 rounded-3xl blur-xl"></div>
            
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <TableHead className="font-bold text-slate-700 py-4">Document</TableHead>
                    <TableHead className="font-bold text-slate-700">Category</TableHead>
                    <TableHead className="font-bold text-slate-700">Journal</TableHead>
                    <TableHead className="font-bold text-slate-700">Year</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="font-bold text-slate-700">Created</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow 
                      key={doc.id} 
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border-b border-slate-100"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <FileTextIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer">
                              {doc.title}
                            </div>
                            {doc.description && (
                              <div className="text-sm text-slate-500 line-clamp-1 mt-1">
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-slate-50 text-slate-700 border-slate-300 font-medium"
                        >
                          {doc.category?.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 font-medium">
                        {doc.journal || <span className="text-slate-400 italic">No journal</span>}
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">{doc.year}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <Badge 
                            variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                            className={`${
                              doc.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                              'bg-red-100 text-red-800 hover:bg-red-200'
                            } shadow-sm font-medium capitalize`}
                          >
                            {doc.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 font-medium">
                        {new Date(doc.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => window.open(doc.file_url, '_blank')}
                            className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                          >
                            <ExternalLink size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEdit(doc)}
                            className="hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-slate-800">Delete Document</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-600">
                                Are you sure you want to delete "{doc.title}"? 
                                <br /><br />
                                <strong>This will permanently delete:</strong>
                                <br />• The document record from your library
                                <br />• The file from our storage system
                                <br /><br />
                                <span className="text-red-600 font-medium">This action cannot be undone.</span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(doc.id)} 
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="text-center py-16">
            <div className="relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl blur-xl"></div>
              
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-12 max-w-md mx-auto">
                <div className="space-y-6">
                  {/* Animated icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileTextIcon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800">No Documents Yet</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Start building your medical research library by uploading your first document.
                    </p>
                  </div>
                  
                  {!showUpload && (
                    <Button 
                      onClick={() => setShowUpload(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Your First Document
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Edit Document Dialog */}
        {editingDoc && (
          <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Document</DialogTitle>
                <DialogDescription>
                  Make changes to your document information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingDoc.description}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Journal</label>
                    <Input
                      value={editingDoc.journal}
                      onChange={(e) => setEditingDoc({ ...editingDoc, journal: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      type="number"
                      value={editingDoc.year}
                      onChange={(e) => setEditingDoc({ ...editingDoc, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingDoc(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Documents;