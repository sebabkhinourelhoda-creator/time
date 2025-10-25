import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { fetchDocuments, Document } from '@/lib/documents';
import { fetchVideos, Video } from '@/lib/videos';
import {
  FileTextIcon,
  DownloadIcon,
  StarIcon,
  PlusCircleIcon,
  SearchIcon,
  TrendingUpIcon,
  UserIcon,
  BookmarkIcon,
  HeartIcon,
  ActivityIcon,
  BarChart3Icon,
  PieChartIcon,
  PlayCircleIcon,
  ClockIcon,
  EyeIcon,
  GraduationCapIcon,
  TagIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { NavBar } from '@/components/NavBar';

export default function DashboardPage() {
  const { user, updateProfile, logout } = useAuth();
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load dynamic data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch documents with verified status
        const documentsData = await fetchDocuments({ 
          status: 'verified',
          showAll: true 
        });
        
        // Fetch videos with approved status  
        const videosData = await fetchVideos(undefined, 'verified');
        
        setDocuments(documentsData || []);
        setVideos(videosData || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement actual file upload
      toast({
        title: 'File uploaded',
        description: 'Your document has been uploaded successfully.',
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      // TODO: Implement actual avatar upload
      const imageUrl = URL.createObjectURL(file);
      await updateProfile({ avatar_url: imageUrl });
      toast({
        title: 'Profile updated',
        description: 'Your avatar has been updated successfully.',
      });
    }
  };

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
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your contributions and view analytics
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-2 hover:bg-secondary/10"
          >
            Sign Out
          </Button>
        </div>

        {/* Profile Section */}
        <Card className="border-2 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
              <Avatar className="h-24 w-24 border-2 border-border relative">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.username} />
                <AvatarFallback className="bg-primary/5 text-xl">
                  {user?.full_name 
                    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : user?.username?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg transition-colors"
              >
                📷
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {user?.full_name || user?.username}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Member since October 2025</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="text-primary" />
                Document Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={documents.map(doc => ({
                      title: doc.title,
                      value: 1 // Since we don't have download counts, use 1 for each document
                    }))}
                    dataKey="value"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) => entry.title.split(' ')[0]}
                  >
                    {documents.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3Icon className="text-primary" />
                Ratings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={documents.map((doc, index) => ({
                  title: doc.title.substring(0, 15) + (doc.title.length > 15 ? '...' : ''),
                  documents: 1,
                  year: doc.year || new Date().getFullYear()
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="documents" fill="hsl(var(--primary))" name="Documents" />
                  <Bar dataKey="year" fill="hsl(var(--secondary))" name="Year" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                <ActivityIcon className="text-primary" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    {isLoading ? (
                      <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                    ) : (
                      documents.length
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground">Total Videos</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    {isLoading ? (
                      <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                    ) : (
                      videos.length
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground">Content Status</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    {isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      'Active'
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Videos Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Educational Videos
            </h2>
            <div className="flex gap-4">
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 w-[200px] bg-card/50" placeholder="Search videos..." />
              </div>
              <Button className="gap-2">
                <PlusCircleIcon size={18} />
                Upload Video
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-2 bg-background/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative aspect-video bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <Card key={video.id} className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm overflow-hidden group">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail_url || 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400'} 
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircleIcon size={48} className="text-white" />
                    </div>
                    {video.duration && (
                      <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80">
                        {video.duration}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                      {video.author_name && (
                        <div className="flex items-center gap-1">
                          <GraduationCapIcon size={14} />
                          {video.author_name}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TagIcon size={14} />
                        {video.category_name || 'General'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <PlayCircleIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No videos available</h3>
                <p className="text-sm text-muted-foreground">Videos will appear here once they are uploaded and approved.</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-background border-2 p-1">
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card className="border-2 bg-background/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Your Documents
                  </CardTitle>
                  <CardDescription>Manage and share your medical research documents</CardDescription>
                </div>
                <Label className="cursor-pointer">
                  <Input type="file" className="hidden" onChange={handleFileUpload} />
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative">Upload Document</span>
                  </Button>
                </Label>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-2 rounded-lg bg-background/40 backdrop-blur-sm">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                          <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                        </div>
                        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    ))
                  ) : documents.length > 0 ? (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary/50 transition-colors bg-background/40 backdrop-blur-sm hover:bg-background/60 group"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {doc.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="opacity-60 group-hover:opacity-100 transition-opacity">�</span>
                              {doc.category?.name || 'General'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="opacity-60 group-hover:opacity-100 transition-opacity">📅</span>
                              {doc.year || new Date().getFullYear()}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="opacity-60 group-hover:opacity-100 transition-opacity">✅</span>
                              {doc.status}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-2 hover:bg-secondary/10 relative group overflow-hidden"
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative">Download</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileTextIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No documents available</h3>
                      <p className="text-sm text-muted-foreground">Documents will appear here once they are uploaded and approved.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card className="border-2 bg-background/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Educational Videos
                  </CardTitle>
                  <CardDescription>Share and watch educational content</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Upload Video</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-2 rounded-lg bg-background/40 backdrop-blur-sm">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                          <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                        </div>
                        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    ))
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary/50 transition-colors bg-background/40 backdrop-blur-sm hover:bg-background/60 group"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="opacity-60 group-hover:opacity-100 transition-opacity">🎥</span>
                              {video.category_name || 'General'}
                            </span>
                            {video.duration && (
                              <span className="flex items-center gap-1">
                                <span className="opacity-60 group-hover:opacity-100 transition-opacity">⏱️</span>
                                {video.duration}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <span className="opacity-60 group-hover:opacity-100 transition-opacity">✅</span>
                              {video.status}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-2 hover:bg-secondary/10 relative group overflow-hidden"
                          onClick={() => window.open(video.video_url, '_blank')}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative">Watch</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <PlayCircleIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No videos available</h3>
                      <p className="text-sm text-muted-foreground">Videos will appear here once they are uploaded and approved.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
