import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Shield, User, Crown, Home } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, full_name, avatar_url, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error Loading Users',
        description: 'Failed to load users from database.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error Updating Role',
        description: 'Failed to update user role.',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      // Get user details first to get the avatar URL
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single() as { data: { avatar_url: string | null } | null, error: any };

      if (fetchError) throw fetchError;

      // Delete the user's avatar from storage bucket if it exists
      if (user && user.avatar_url && user.avatar_url.includes('supabase')) {
        // Extract filename from URL (assuming URL structure: .../storage/v1/object/public/avatars/filename)
        const urlParts = user.avatar_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('avatars')
            .remove([fileName]);
          
          if (storageError) {
            console.warn('Error deleting avatar file from storage:', storageError);
            // Continue with database deletion even if storage deletion fails
          }
        }
      }

      // Delete the user record from database
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: 'User Deleted',
        description: 'User and associated files have been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error Deleting User',
        description: 'Failed to delete user.',
        variant: 'destructive'
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'user':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage user accounts, roles, and permissions.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by username, email, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={(value: 'all' | 'user' | 'admin') => setRoleFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading users...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {user.avatar_url ? (
                                <AvatarImage src={user.avatar_url} alt={user.full_name || user.username} />
                              ) : (
                                <AvatarFallback>
                                  {(user.full_name || user.username).slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.full_name || user.username}</div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            {getRoleBadge(user.role)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(value: 'user' | 'admin') => updateUserRole(user.id, value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(user.id)}
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
                    ))}
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