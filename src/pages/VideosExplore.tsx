import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  PlayCircleIcon,
  StarIcon,
  EyeIcon,
  TagIcon,
  FilterIcon,
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
} from 'lucide-react';

// Video categories
const VIDEO_CATEGORIES = [
  'DNA & Genetics',
  'Cancer by Body Part',
  'Medical Docs & Research',
  'Prevention Tips',
  'Educational'
];

// Mock videos data with user information
const videos = [
  {
    id: 1,
    title: 'Understanding DNA Mutations',
    description: 'A comprehensive guide to DNA mutations and their effects on health.',
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400',
    category: 'DNA & Genetics',
    views: 1520,
    likes: 245,
    comments: 32,
    duration: '15:30',
    uploadDate: '2025-10-01',
    user: {
      id: 1,
      name: 'Dr. Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      role: 'Geneticist',
      verified: true
    }
  },
  {
    id: 2,
    title: 'Breast Cancer Early Detection',
    description: 'Important information about breast cancer screening and early detection.',
    thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=400',
    category: 'Cancer by Body Part',
    views: 2100,
    likes: 312,
    comments: 45,
    duration: '12:45',
    uploadDate: '2025-09-28',
    user: {
      id: 2,
      name: 'Dr. Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      role: 'Oncologist',
      verified: true
    }
  },
  {
    id: 3,
    title: 'Latest Cancer Research 2025',
    description: 'Overview of breakthrough cancer research findings in 2025.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400',
    category: 'Medical Docs & Research',
    views: 980,
    likes: 156,
    comments: 28,
    duration: '20:15',
    uploadDate: '2025-10-10',
    user: {
      id: 3,
      name: 'Dr. Emily Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      role: 'Research Scientist',
      verified: true
    }
  },
  {
    id: 4,
    title: 'Lifestyle Changes for Cancer Prevention',
    description: 'Evidence-based lifestyle modifications to reduce cancer risk.',
    thumbnail: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=400',
    category: 'Prevention Tips',
    views: 1850,
    likes: 276,
    comments: 38,
    duration: '18:20',
    uploadDate: '2025-10-05',
    user: {
      id: 4,
      name: 'Dr. Lisa Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      role: 'Health Specialist',
      verified: true
    }
  },
  {
    id: 5,
    title: 'DNA Analysis in Cancer Detection',
    description: 'How DNA analysis helps in early cancer detection and treatment planning.',
    thumbnail: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df5b?auto=format&fit=crop&w=400',
    category: 'DNA & Genetics',
    views: 1230,
    likes: 198,
    comments: 25,
    duration: '16:40',
    uploadDate: '2025-10-08',
    user: {
      id: 5,
      name: 'Dr. James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      role: 'Cancer Researcher',
      verified: true
    }
  }
];

import Navigation from "@/components/Navigation";

export default function VideosExplore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Educational Videos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore curated videos from medical professionals and researchers about cancer prevention, research, and health awareness.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 md:max-w-[300px]">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search videos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Viewed</SelectItem>
                <SelectItem value="liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-primary/20">
                    <PlayCircleIcon size={48} />
                  </Button>
                </div>
                <Badge variant="secondary" className="absolute top-2 right-2 bg-black/70">
                  {video.duration}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src={video.user.avatar} />
                    <AvatarFallback>{video.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">{video.user.name}</span>
                      {video.user.verified && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{video.user.role}</p>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <EyeIcon size={14} />
                      {video.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <HeartIcon size={14} />
                      {video.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircleIcon size={14} />
                      {video.comments}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ShareIcon size={16} />
                  </Button>
                </div>
                <Badge variant="outline" className="mt-3">
                  {video.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}