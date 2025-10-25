import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderOpen,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import AdminRoute from '../components/AdminRoute';
import { NavBar } from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { supabase } from '@/lib/supabaseClient';
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

interface DocumentCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  document_count?: number;
  video_count?: number;
}

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Get categories with document and video counts
      const { data: categoriesData, error: categoriesError } = await (supabase as any)
        .from('document_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get document counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category: any) => {
          const [
            { count: documentCount },
            { count: videoCount }
          ] = await Promise.all([
            (supabase as any)
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id),
            (supabase as any)
              .from('videos')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
          ]);

          return {
            ...category,
            document_count: documentCount || 0,
            video_count: videoCount || 0
          } as DocumentCategory;
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error Loading Categories',
        description: 'Failed to load document categories.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('document_categories')
        .insert([{
          name: newCategory.name.trim(),
          description: newCategory.description.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Category Added',
        description: `"${newCategory.name}" has been added successfully.`,
      });

      setNewCategory({ name: '', description: '' });
      setIsAdding(false);
      loadCategories();
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error Adding Category',
        description: error.message || 'Failed to add category.',
        variant: 'destructive'
      });
    }
  };

  const handleEditCategory = async (id: number) => {
    if (!editingCategory.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('document_categories')
        .update({
          name: editingCategory.name.trim(),
          description: editingCategory.description.trim()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Category Updated',
        description: 'Category has been updated successfully.',
      });

      setEditingId(null);
      setEditingCategory({ name: '', description: '' });
      loadCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error Updating Category',
        description: error.message || 'Failed to update category.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    try {
      // Check if category has any documents or videos
      const category = categories.find(c => c.id === id);
      if (category && (category.document_count! > 0 || category.video_count! > 0)) {
        toast({
          title: 'Cannot Delete Category',
          description: `"${name}" has ${category.document_count} documents and ${category.video_count} videos. Please move the content to another category first.`,
          variant: 'destructive'
        });
        return;
      }

      const { error } = await (supabase as any)
        .from('document_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Category Deleted',
        description: `"${name}" has been deleted successfully.`,
      });

      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error Deleting Category',
        description: error.message || 'Failed to delete category.',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (category: DocumentCategory) => {
    setEditingId(category.id);
    setEditingCategory({
      name: category.name,
      description: category.description
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingCategory({ name: '', description: '' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <AdminSidebar />
        
        <div className="ml-64 pt-20 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  Manage Categories
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage document and video categories for better organization.
                </p>
              </div>
              
              <Button
                onClick={() => setIsAdding(true)}
                disabled={isAdding}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Add New Category Form */}
          {isAdding && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Add New Category</CardTitle>
                <CardDescription className="text-green-700">
                  Create a new category for organizing documents and videos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Category Name</Label>
                  <Input
                    id="new-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCategory} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Category
                  </Button>
                  <Button variant="outline" onClick={cancelAdd} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {editingId === category.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-name-${category.id}`}>Category Name</Label>
                          <Input
                            id={`edit-name-${category.id}`}
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                          <Textarea
                            id={`edit-description-${category.id}`}
                            value={editingCategory.description}
                            onChange={(e) => setEditingCategory(prev => ({ ...prev, description: e.target.value }))}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleEditCategory(category.id)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={cancelEdit}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {category.document_count} docs
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {category.video_count} videos
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {category.description || 'No description provided'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ID: {category.id}</span>
                            <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(category)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? 
                                  {(category.document_count! > 0 || category.video_count! > 0) ? (
                                    <span className="text-red-600 block mt-2">
                                      ⚠️ This category has {category.document_count} documents and {category.video_count} videos. 
                                      You cannot delete it until all content is moved to another category.
                                    </span>
                                  ) : (
                                    <span className="block mt-2">This action cannot be undone.</span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id, category.name)}
                                  disabled={category.document_count! > 0 || category.video_count! > 0}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Category
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Found</h3>
                  <p className="text-gray-600 mb-4">
                    Get started by creating your first document category.
                  </p>
                  <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Category
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}