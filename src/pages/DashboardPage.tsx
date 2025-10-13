import { useState } from 'react';
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
import { Sidebar } from '@/components/Sidebar';
import { NavBar } from '@/components/NavBar';

// Mock data - replace with actual data from your backend
const mockDocuments = [
  { id: 1, title: 'Cancer Research 2025', rating: 8.5, downloads: 120 },
  { id: 2, title: 'Prevention Guidelines', rating: 9.0, downloads: 200 },
  { id: 3, title: 'Healthcare Innovation Report', rating: 8.8, downloads: 150 },
  { id: 4, title: 'Medical Technology Trends', rating: 9.2, downloads: 180 },
  { id: 5, title: 'Patient Care Best Practices', rating: 8.7, downloads: 165 },
];

const mockVideos = [
  { 
    id: 1, 
    title: 'Understanding DNA and Genetic Factors in Health',
    description: 'A comprehensive guide to understanding how DNA affects our health and well-being.',
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400',
    duration: '12:45',
    views: 1500,
    rating: 9.2,
    instructor: 'Dr. Sarah Johnson',
    category: 'Genetics'
  },
  { 
    id: 2, 
    title: 'Cancer Prevention: Latest Research and Guidelines',
    description: 'Learn about the most recent developments in cancer prevention strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=400',
    duration: '15:20',
    views: 2000,
    rating: 8.8,
    instructor: 'Dr. Michael Chen',
    category: 'Oncology'
  },
  { 
    id: 3, 
    title: 'Nutrition and Its Impact on Health',
    description: 'Explore the relationship between nutrition and long-term health outcomes.',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400',
    duration: '18:30',
    views: 1800,
    rating: 9.5,
    instructor: 'Dr. Emily Martinez',
    category: 'Nutrition'
  },
  { 
    id: 4, 
    title: 'Mental Health: Understanding and Care',
    description: 'A detailed look at mental health awareness and treatment approaches.',
    thumbnail: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=400',
    duration: '20:15',
    views: 2200,
    rating: 9.3,
    instructor: 'Dr. James Wilson',
    category: 'Mental Health'
  },
  { 
    id: 5, 
    title: 'Exercise Science and Physical Well-being',
    description: 'Understanding the science behind exercise and its health benefits.',
    thumbnail: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400',
    duration: '16:40',
    views: 1650,
    rating: 9.0,
    instructor: 'Dr. Lisa Thompson',
    category: 'Physical Health'
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

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
      await updateProfile({ avatar: imageUrl });
      toast({
        title: 'Profile updated',
        description: 'Your avatar has been updated successfully.',
      });
    }
  };

  const { toast } = useToast();
  const { updateProfile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background/95 flex">
      <Sidebar />
      <div className="flex-1 pl-64">
        <NavBar />
        <div className="container mx-auto py-8 px-4 space-y-8 relative">
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
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/5 text-xl">
                  {user?.name?.[0]}
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
                {user?.name}
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
                    data={mockDocuments}
                    dataKey="downloads"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) => entry.title.split(' ')[0]}
                  >
                    {mockDocuments.map((_, index) => (
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
                <BarChart data={mockDocuments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="hsl(var(--primary))" name="Rating" />
                  <Bar dataKey="downloads" fill="hsl(var(--secondary))" name="Downloads" />
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
                  <div className="text-3xl font-bold text-primary mt-1">{mockDocuments.length}</div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground">Total Downloads</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    {mockDocuments.reduce((acc, doc) => acc + doc.downloads, 0)}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="text-3xl font-bold text-primary mt-1">
                    {(mockDocuments.reduce((acc, doc) => acc + doc.rating, 0) / mockDocuments.length).toFixed(1)}
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
            {mockVideos.map((video) => (
              <Card key={video.id} className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircleIcon size={48} className="text-white" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80">
                    {video.duration}
                  </Badge>
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
                    <div className="flex items-center gap-1">
                      <GraduationCapIcon size={14} />
                      {video.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon size={14} />
                      {video.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon size={14} />
                      {video.rating}/10
                    </div>
                    <div className="flex items-center gap-1">
                      <TagIcon size={14} />
                      {video.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  {mockDocuments.map((doc) => (
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
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">📥</span>
                            {doc.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">⭐</span>
                            {doc.rating}/10 rating
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-2 hover:bg-secondary/10 relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative">Download</span>
                      </Button>
                    </div>
                  ))}
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
                  {mockVideos.map((video) => (
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
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">👁️</span>
                            {video.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">⭐</span>
                            {video.rating}/10 rating
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-2 hover:bg-secondary/10 relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative">Watch</span>
                      </Button>
                    </div>
                  ))}
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
