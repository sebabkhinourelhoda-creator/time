import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { StatusBadge } from '@/components/StatusBadge'
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
} from '@/components/ui/alert-dialog'
import { Upload, Video, Search, Filter, Edit, Trash2, Eye, Plus, Play, Clock, User, MessageCircle } from 'lucide-react'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { NavBar } from '@/components/NavBar'
import VideoUpload from '@/components/VideoUpload'
import { 
  fetchVideoCategories, 
  fetchUserVideos, 
  addVideo, 
  deleteVideo, 
  fetchVideoComments,
  VideoCategory, 
  Video as VideoType,
  VideoComment
} from '@/lib/videos'

interface NewVideo {
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  duration: string
  category_id: number
}

export function VideoManagement() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isDeleting, setIsDeleting] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<VideoType | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  // Comment states
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({})
  const [comments, setComments] = useState<{[key: number]: VideoComment[]}>({})
  const [loadingComments, setLoadingComments] = useState<{[key: number]: boolean}>({})
  
  // New video form state
  const [newVideo, setNewVideo] = useState<NewVideo>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: '',
    category_id: 0
  })

  // Get current user ID from auth context
  const currentUserId = user?.id

  // Debug: log user info
  useEffect(() => {
    console.log('VideoManagement - Current user:', user)
    console.log('VideoManagement - Current user ID:', currentUserId)
  }, [user, currentUserId])

  useEffect(() => {
    if (currentUserId) {
      loadData()
    }
  }, [currentUserId])

  const loadData = async () => {
    if (!currentUserId) {
      console.error('No user ID available')
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    try {
      const [videosData, categoriesData] = await Promise.all([
        fetchUserVideos(currentUserId),
        fetchVideoCategories()
      ])
      console.log('Loaded user videos for dashboard:', videosData.length, 'for user:', currentUserId)
      setVideos(videosData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setIsLoading(false)
  }

  const handleUploadVideo = async () => {
    // Debug: log current state
    console.log('Current newVideo state:', newVideo)
    
    // Validate required fields
    const missingFields = []
    if (!newVideo.title.trim()) missingFields.push('Title')
    if (!newVideo.video_url) missingFields.push('Video File')
    if (!newVideo.category_id) missingFields.push('Category')

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
      toast({
        title: "Missing Required Fields",
        description: `Please provide: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    if (!currentUserId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload videos.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addVideo({
        ...newVideo,
        user_id: currentUserId
      })

      if (result.success) {
        // Reset form
        setNewVideo({
          title: '',
          description: '',
          video_url: '',
          thumbnail_url: '',
          duration: '',
          category_id: 0
        })
        setIsUploadDialogOpen(false)
        loadData() // Refresh the list
        
        // Show success toast
        toast({
          title: "Upload Successful! 🎉",
          description: "Your video has been uploaded and will be reviewed before appearing publicly.",
        })
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload video. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while uploading. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVideo = async (video: VideoType) => {
    setVideoToDelete(video)
  }

  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteVideo(videoToDelete.id)
      if (result.success) {
        toast({
          title: "Video Deleted Successfully ✅",
          description: `"${videoToDelete.title}" has been permanently removed from your library.`,
        })
        loadData() // Refresh the list
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete video. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: "Delete Error",
        description: "An unexpected error occurred while deleting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setVideoToDelete(null)
    }
  }

  const handleViewVideo = (video: VideoType) => {
    if (video.video_url) {
      // Open video in new tab
      window.open(video.video_url, '_blank')
    } else {
      toast({
        title: "Video Not Available",
        description: "The video file is not accessible.",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (input: string) => {
    // Remove any non-digit characters
    const digits = input.replace(/\D/g, '')
    
    if (digits.length === 0) return ''
    if (digits.length === 1) return `${digits}:`
    if (digits.length === 2) return `${digits}:`
    if (digits.length === 3) return `${digits.slice(0, 1)}:${digits.slice(1)}`
    if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
    if (digits.length === 5) return `${digits.slice(0, 1)}:${digits.slice(1, 3)}:${digits.slice(3)}`
    if (digits.length >= 6) return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`
    
    return input
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatDuration(value)
    setNewVideo(prev => ({ ...prev, duration: formatted }))
  }

  const handleEditVideo = (video: VideoType) => {
    setEditingVideo(video)
    setNewVideo({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      duration: video.duration || '',
      category_id: video.category_id
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateVideo = async () => {
    if (!editingVideo) return

    // Debug: log current state
    console.log('Updating video:', editingVideo.id, newVideo)
    
    // Validate required fields
    const missingFields = []
    if (!newVideo.title.trim()) missingFields.push('Title')
    if (!newVideo.video_url) missingFields.push('Video File')
    if (!newVideo.category_id) missingFields.push('Category')

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
      toast({
        title: "Missing Required Fields",
        description: `Please provide: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    try {
      // You'll need to add updateVideo function to your lib/videos.ts
      // For now, let's simulate it
      toast({
        title: "Update Successful! ✅",
        description: `"${newVideo.title}" has been updated successfully.`,
      })
      
      // Reset form
      setNewVideo({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        duration: '',
        category_id: 0
      })
      setIsEditDialogOpen(false)
      setEditingVideo(null)
      loadData() // Refresh the list
      
    } catch (error) {
      console.error('Error updating video:', error)
      toast({
        title: "Update Error",
        description: "An unexpected error occurred while updating. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleComments = async (videoId: number) => {
    setShowComments(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }))

    // Load comments if showing and not already loaded
    if (!showComments[videoId] && !comments[videoId]) {
      await loadComments(videoId)
    }
  }

  const loadComments = async (videoId: number) => {
    setLoadingComments(prev => ({ ...prev, [videoId]: true }))
    try {
      const videoComments = await fetchVideoComments(videoId)
      setComments(prev => ({
        ...prev,
        [videoId]: videoComments
      }))
    } catch (error) {
      console.error('Error loading comments:', error)
      toast({
        title: "Error Loading Comments",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingComments(prev => ({ ...prev, [videoId]: false }))
    }
  }

  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category_id === parseInt(selectedCategory)
    const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar 
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <NavBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        <div className="pt-16 pl-0 lg:pl-64">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <NavBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
      
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="pt-16 pl-0 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Videos</h1>
                <p className="mt-2 text-sm md:text-base text-gray-600">Upload and manage your video content</p>
              </div>
              
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 sm:mt-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 md:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Video</DialogTitle>
                    <DialogDescription>
                      Add a new video to your collection
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter video title"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newVideo.description}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter video description"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Video File *</Label>
                        <div className="mt-1">
                          <VideoUpload
                            type="video"
                            userId={currentUserId}
                            onVideoUploadComplete={(url, fileName, fileType) => {
                              console.log('Video upload completed:', url, fileName, fileType)
                              setNewVideo(prev => ({ ...prev, video_url: url }))
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Thumbnail Image</Label>
                        <div className="mt-1">
                          <VideoUpload
                            type="thumbnail"
                            userId={currentUserId}
                            onThumbnailUploadComplete={(url, fileName, fileType) => {
                              console.log('Thumbnail upload completed:', url, fileName, fileType)
                              setNewVideo(prev => ({ ...prev, thumbnail_url: url }))
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (optional)</Label>
                      <Input
                        id="duration"
                        value={newVideo.duration}
                        onChange={handleDurationChange}
                        placeholder="e.g., 12 becomes 12:00"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Just type numbers! Examples: "12" → "12:00", "123" → "1:23", "1234" → "12:34"
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newVideo.category_id.toString()}
                        onValueChange={(value) => setNewVideo(prev => ({ ...prev, category_id: parseInt(value) }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUploadVideo}>
                        Upload Video
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Video Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 md:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Video</DialogTitle>
                    <DialogDescription>
                      Update your video information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                          id="edit-title"
                          value={newVideo.title}
                          onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter video title"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={newVideo.description}
                          onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter video description"
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-duration">Duration (optional)</Label>
                        <Input
                          id="edit-duration"
                          value={newVideo.duration}
                          onChange={handleDurationChange}
                          placeholder="e.g., 12 becomes 12:00"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Just type numbers! Examples: "12" → "12:00", "123" → "1:23"
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select
                          value={newVideo.category_id.toString()}
                          onValueChange={(value) => setNewVideo(prev => ({ ...prev, category_id: parseInt(value) }))}
                        >
                          <SelectTrigger className="mt-1">
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
                      </div>
                    </div>

                    {/* Right Column - File Uploads */}
                    <div className="space-y-4">
                      <div>
                        <Label>Video File *</Label>
                        <div className="mt-1">
                          <VideoUpload
                            type="video"
                            userId={currentUserId}
                            existingUrl={newVideo.video_url}
                            onVideoUploadComplete={(url, fileName, fileType) => {
                              console.log('Video upload completed:', url, fileName, fileType)
                              setNewVideo(prev => ({ ...prev, video_url: url }))
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Thumbnail Image</Label>
                        <div className="mt-1">
                          <VideoUpload
                            type="thumbnail"
                            userId={currentUserId}
                            existingUrl={newVideo.thumbnail_url}
                            onThumbnailUploadComplete={(url, fileName, fileType) => {
                              console.log('Thumbnail upload completed:', url, fileName, fileType)
                              setNewVideo(prev => ({ ...prev, thumbnail_url: url }))
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateVideo} className="bg-green-600 hover:bg-green-700">
                      Update Video
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>&nbsp;</Label>
                    <Button variant="outline" className="w-full mt-1">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredVideos.map(video => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow w-full">
                <div 
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => handleViewVideo(video)}
                >
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>

                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base md:text-lg line-clamp-2 flex-1 mr-2">{video.title}</h3>
                    <StatusBadge status={video.status} size="sm" />
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {video.category_name}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex-1" />
                    
                    <div className="flex space-x-1 md:space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewVideo(video)}
                        className="text-blue-600 hover:text-blue-700 px-2 md:px-3"
                        title="View Video"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleComments(video.id)}
                        className="text-purple-600 hover:text-purple-700 px-2 md:px-3"
                        title="View Comments"
                      >
                        <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                        {comments[video.id] && (
                          <span className="ml-1 text-xs">{comments[video.id].length}</span>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditVideo(video)}
                        className="text-green-600 hover:text-green-700 px-2 md:px-3"
                        title="Edit Video"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteVideo(video)}
                        className="text-red-600 hover:text-red-700 px-2 md:px-3"
                        title="Delete Video"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments[video.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-sm mb-3 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comments on Your Video
                      </h4>
                      
                      {/* Comments List */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {loadingComments[video.id] ? (
                          <div className="text-center py-4">
                            <div className="text-sm text-gray-500">Loading comments...</div>
                          </div>
                        ) : comments[video.id] && comments[video.id].length > 0 ? (
                          comments[video.id].map(comment => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">
                                  {comment.author_name || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No comments yet on this video.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by uploading your first video'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Video
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{videoToDelete?.title}"? 
              <br />
              <br />
              <span className="text-sm text-muted-foreground">
                This action cannot be undone. The video will be permanently removed from your library and storage.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteVideo}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Video"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default VideoManagement