import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SearchIcon,
  PlayCircleIcon,
  StarIcon,
  EyeIcon,
  GraduationCapIcon,
  TagIcon,
  BookIcon,
  FileTextIcon,
  FilterIcon,
} from 'lucide-react';

// Mock data for educational content
const educationalVideos = [
  { 
    id: 1, 
    title: 'Understanding Cancer Prevention',
    description: 'Learn about key strategies and lifestyle changes for cancer prevention.',
    thumbnail: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=400',
    duration: '8:45',
    views: 15000,
    rating: 4.8,
    instructor: 'Dr. Sarah Johnson',
    category: 'Prevention',
    level: 'Beginner'
  },
  { 
    id: 2, 
    title: 'Healthy Living Guide: Cancer Risk Reduction',
    description: 'Practical tips and daily habits to reduce cancer risk factors.',
    thumbnail: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=400',
    duration: '12:20',
    views: 12000,
    rating: 4.9,
    instructor: 'Dr. Michael Chen',
    category: 'Lifestyle',
    level: 'Intermediate'
  },
  { 
    id: 3, 
    title: 'Nutrition and Cancer Prevention',
    description: 'Understanding the role of diet in cancer prevention.',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400',
    duration: '10:30',
    views: 18000,
    rating: 4.9,
    instructor: 'Dr. Emily Martinez',
    category: 'Nutrition',
    level: 'Beginner'
  },
  { 
    id: 4, 
    title: 'Early Detection and Screening',
    description: 'Important information about cancer screening and early detection methods.',
    thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=400',
    duration: '15:15',
    views: 22000,
    rating: 4.7,
    instructor: 'Dr. James Wilson',
    category: 'Screening',
    level: 'Intermediate'
  },
  { 
    id: 5, 
    title: 'Understanding Genetic Risk Factors',
    description: 'Learn about genetic factors that may influence cancer risk.',
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400',
    duration: '11:40',
    views: 16500,
    rating: 4.8,
    instructor: 'Dr. Lisa Thompson',
    category: 'Genetics',
    level: 'Advanced'
  }
];

const resources = [
  {
    id: 1,
    title: 'Cancer Prevention Guide 2025',
    type: 'PDF Guide',
    category: 'Prevention',
    downloads: 12500,
    pages: 25,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Healthy Lifestyle Handbook',
    type: 'E-Book',
    category: 'Lifestyle',
    downloads: 8900,
    pages: 45,
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Nutritional Guidelines for Cancer Prevention',
    type: 'PDF Guide',
    category: 'Nutrition',
    downloads: 15200,
    pages: 30,
    rating: 4.9,
  },
];

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Prevention', 'Lifestyle', 'Nutrition', 'Screening', 'Genetics'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredVideos = educationalVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learn and Stay Healthy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our educational resources designed to help you understand and prevent cancer through informed lifestyle choices.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="videos" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-background border-2">
              <TabsTrigger value="videos" className="data-[state=active]:bg-primary/10">
                Video Lessons
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-primary/10">
                Resources
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  className="pl-9 w-full sm:w-[300px] bg-card/50" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <FilterIcon size={18} />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="videos" className="space-y-6">
            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="border-2 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm overflow-hidden group">
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
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge variant="secondary" className="bg-black/70 hover:bg-black/80">
                        {video.duration}
                      </Badge>
                      <Badge variant="secondary" className="bg-black/70 hover:bg-black/80">
                        {video.level}
                      </Badge>
                    </div>
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
                        {video.rating}/5
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
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardDescription>
                      Category: {resource.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookIcon size={14} />
                        {resource.pages} pages
                      </div>
                      <div className="flex items-center gap-1">
                        <FileTextIcon size={14} />
                        {resource.downloads.toLocaleString()} downloads
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon size={14} />
                        {resource.rating}/5
                      </div>
                    </div>
                    <Button className="w-full mt-4">Download</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}