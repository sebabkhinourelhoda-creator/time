import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  SearchIcon,
  PlayCircleIcon,
  StarIcon,
  EyeIcon,
  TagIcon,
  PlusCircleIcon,
  EditIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react';

// Video categories matching your site sections
const VIDEO_CATEGORIES = [
  'DNA & Genetics',
  'Cancer by Body Part',
  'Medical Docs & Research',
  'Prevention Tips',
  'Educational'
];

// Mock user's videos data
const mockUserVideos = [
  {
    id: 1,
    title: 'Understanding DNA Mutations',
    description: 'A comprehensive guide to DNA mutations and their effects on health.',
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400',
    category: 'DNA & Genetics',
    status: 'published',
    views: 1520,
    likes: 245,
    duration: '15:30',
    uploadDate: '2025-10-01'
  },
  {
    id: 2,
    title: 'Breast Cancer Early Detection',
    description: 'Important information about breast cancer screening and early detection.',
    thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=400',
    category: 'Cancer by Body Part',
    status: 'published',
    views: 2100,
    likes: 312,
    duration: '12:45',
    uploadDate: '2025-09-28'
  },
  {
    id: 3,
    title: 'Latest Cancer Research 2025',
    description: 'Overview of breakthrough cancer research findings in 2025.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400',
    category: 'Medical Docs & Research',
    status: 'draft',
    views: 0,
    likes: 0,
    duration: '20:15',
    uploadDate: '2025-10-10'
  },
  {
    id: 4,
    title: 'Lifestyle Changes for Cancer Prevention',
    description: 'Evidence-based lifestyle modifications to reduce cancer risk.',
    thumbnail: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=400',
    category: 'Prevention Tips',
    status: 'published',
    views: 1850,
    likes: 276,
    duration: '18:20',
    uploadDate: '2025-10-05'
  }
];

export default function VideoManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const filteredVideos = mockUserVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Videos</h1>
          <p className="text-muted-foreground">Manage your educational video content</p>
        </div>
        
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircleIcon size={20} />
              Upload New Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Video</DialogTitle>
              <DialogDescription>
                Add a new educational video to your collection
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter video title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter video description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM or MOV (max. 2GB)
                  </p>
                  <Input id="video" type="file" className="hidden" accept="video/*" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:max-w-[300px]">
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search videos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {VIDEO_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden group">
            <div className="relative aspect-video">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-primary/20">
                  <PlayCircleIcon size={20} />
                </Button>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-primary/20">
                  <EditIcon size={20} />
                </Button>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-primary/20">
                  <Trash2Icon size={20} />
                </Button>
              </div>
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary" className="bg-black/70">
                  {video.duration}
                </Badge>
                <Badge 
                  variant={video.status === 'published' ? 'default' : 'secondary'}
                  className={video.status === 'published' ? 'bg-green-500/80' : 'bg-yellow-500/80'}
                >
                  {video.status}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">
                {video.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {video.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TagIcon size={14} />
                  {video.category}
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon size={14} />
                  {video.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon size={14} />
                  {video.likes}
                </div>
                <div className="text-xs">
                  Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}