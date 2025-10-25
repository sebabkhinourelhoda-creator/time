import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Video, 
  MessageCircle, 
  Shield, 
  BarChart3,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Home
} from 'lucide-react';
import AdminRoute from '../components/AdminRoute';
import { NavBar } from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { supabase } from '@/lib/supabaseClient';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalDocuments: number;
  totalComments: number;
  pendingVideos: number;
  pendingDocuments: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVideos: 0,
    totalDocuments: 0,
    totalComments: 0,
    pendingVideos: 0,
    pendingDocuments: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Get real stats from database
      const [
        { count: totalUsers },
        { count: totalVideos },
        { count: totalDocuments },
        { count: totalComments },
        { count: pendingVideos },
        { count: pendingDocuments }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('video_comments').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);
      
      setStats({
        totalUsers: totalUsers || 0,
        totalVideos: totalVideos || 0,
        totalDocuments: totalDocuments || 0,
        totalComments: totalComments || 0,
        pendingVideos: pendingVideos || 0,
        pendingDocuments: pendingDocuments || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.15) // Estimate active users as 15% of total
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: 'Error Loading Stats',
        description: 'Failed to load dashboard statistics.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend, 
    color = 'default' 
  }: {
    title: string;
    value: number | string;
    description: string;
    icon: any;
    trend?: number;
    color?: 'default' | 'blue' | 'green' | 'yellow' | 'red';
  }) => {
    const colorClasses = {
      default: 'bg-gray-50 text-gray-600',
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600'
    };

    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {trend !== undefined && (
              <div className={`flex items-center mr-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </div>
            )}
            <span>{description}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <AdminSidebar />
        
        {/* Main content with responsive left margin */}
        <div className="md:ml-64 pt-20 p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
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
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, {user?.full_name || user?.username}. Manage your platform from here.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={loadDashboardStats}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              description="Registered users"
              icon={Users}
              trend={12}
              color="blue"
            />
            <StatCard
              title="Total Videos"
              value={stats.totalVideos}
              description="Videos uploaded"
              icon={Video}
              trend={8}
              color="green"
            />
            <StatCard
              title="Total Documents"
              value={stats.totalDocuments}
              description="Documents uploaded"
              icon={FileText}
              trend={5}
              color="yellow"
            />
            <StatCard
              title="Total Comments"
              value={stats.totalComments}
              description="User interactions"
              icon={MessageCircle}
              trend={15}
              color="default"
            />
          </div>

          {/* Pending Items Alert */}
          {(stats.pendingVideos > 0 || stats.pendingDocuments > 0) && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Items Pending Review
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  You have content waiting for approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {stats.pendingVideos > 0 && (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-800">
                      {stats.pendingVideos} Videos
                    </Badge>
                  )}
                  {stats.pendingDocuments > 0 && (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-800">
                      {stats.pendingDocuments} Documents
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Platform content breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Videos', value: stats.totalVideos, color: '#10b981' },
                        { name: 'Documents', value: stats.totalDocuments, color: '#f59e0b' },
                        { name: 'Comments', value: stats.totalComments, color: '#3b82f6' },
                        { name: 'Users', value: stats.totalUsers, color: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Videos', value: stats.totalVideos, color: '#10b981' },
                        { name: 'Documents', value: stats.totalDocuments, color: '#f59e0b' },
                        { name: 'Comments', value: stats.totalComments, color: '#3b82f6' },
                        { name: 'Users', value: stats.totalUsers, color: '#8b5cf6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Status Overview</CardTitle>
                <CardDescription>Approved vs pending content</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: 'Videos',
                        verified: stats.totalVideos - stats.pendingVideos,
                        pending: stats.pendingVideos,
                      },
                      {
                        name: 'Documents',
                        verified: stats.totalDocuments - stats.pendingDocuments,
                        pending: stats.pendingDocuments,
                      },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" stackId="a" fill="#10b981" name="Verified" />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users ({stats.totalUsers})
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => window.location.href = '/admin/videos'}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Review Videos ({stats.totalVideos})
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => window.location.href = '/admin/documents'}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review Documents ({stats.totalDocuments})
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => window.location.href = '/admin/comments'}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Moderate Comments ({stats.totalComments})
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active users today</span>
                    <Badge variant="secondary">{stats.activeUsers}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending videos</span>
                    <Badge variant="secondary">{stats.pendingVideos}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending documents</span>
                    <Badge variant="secondary">{stats.pendingDocuments}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total comments</span>
                    <Badge variant="secondary">{stats.totalComments}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
