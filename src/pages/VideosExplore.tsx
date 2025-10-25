import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../contexts/AuthContext'
import { Search, Filter, Play, Clock, User, Eye, MessageCircle, Download, Calendar, FileVideo, Heart, Share } from 'lucide-react'
import { NavBar } from '../components/NavBar'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Toaster } from '../components/ui/toaster'
import { 
  fetchVideoCategories, 
  fetchVideos, 
  fetchVideoComments,
  addVideoComment,
  addGuestVideoComment,
  VideoCategory, 
  Video as VideoType,
  VideoComment
} from '../lib/videos'

export function VideosExplore() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Comment states
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({})
  const [comments, setComments] = useState<{[key: number]: VideoComment[]}>({})
  const [commentCounts, setCommentCounts] = useState<{[key: number]: number}>({})
  const [newComment, setNewComment] = useState<{[key: number]: string}>({})
  const [loadingComments, setLoadingComments] = useState<{[key: number]: boolean}>({})
  
  // Guest comment states
  const [guestName, setGuestName] = useState<{[key: number]: string}>({})
  const [guestRole, setGuestRole] = useState<{[key: number]: 'doctor' | 'user'}>({})
  const [showGuestForm, setShowGuestForm] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    loadData()
  }, [selectedCategory])

  const loadCommentCounts = async (videos: VideoType[]) => {
    try {
      const counts: {[key: number]: number} = {}
      await Promise.all(
        videos.map(async (video) => {
          try {
            const comments = await fetchVideoComments(video.id)
            counts[video.id] = comments.length
          } catch (error) {
            console.error(`Error loading comments for video ${video.id}:`, error)
            counts[video.id] = 0
          }
        })
      )
      setCommentCounts(counts)
    } catch (error) {
      console.error('Error loading comment counts:', error)
    }
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const categoryId = selectedCategory === 'all' ? undefined : parseInt(selectedCategory)
      const [videosData, categoriesData] = await Promise.all([
        fetchVideos(categoryId, 'verified'), // Only show verified videos to public
        fetchVideoCategories()
      ])
      console.log('Loaded videos for explore page:', videosData.length)
      setVideos(videosData)
      setCategories(categoriesData)
      
      // Load comment counts for all videos
      await loadCommentCounts(videosData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setIsLoading(false)
  }

  // Filter videos based on search
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.author_name && video.author_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleVideoClick = (video: VideoType) => {
    // In a real app, this would open a video player modal or navigate to video page
    console.log('Playing video:', video.title)
    if (video.video_url) {
      window.open(video.video_url, '_blank')
    }
  }

  const handleDownload = (video: VideoType) => {
    if (video.video_url) {
      try {
        // Create a temporary link element to trigger download
        const link = document.createElement('a')
        link.href = video.video_url
        link.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Download Started! 📥",
          description: `"${video.title}" is being downloaded to your device.`,
        })
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the video. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Download Unavailable",
        description: "This video is not available for download.",
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

  const handleAddComment = async (videoId: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to comment on videos.",
        variant: "destructive",
      })
      return
    }

    const commentText = newComment[videoId]?.trim()
    if (!commentText) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addVideoComment({
        video_id: videoId,
        user_id: user.id,
        comment: commentText
      })

      if (result.success) {
        toast({
          title: "Comment Added! 💬",
          description: "Your comment has been posted successfully.",
        })
        
        // Clear the comment input
        setNewComment(prev => ({
          ...prev,
          [videoId]: ''
        }))
        
        // Reload comments to show the new one
        await loadComments(videoId)
        
        // Update comment count
        setCommentCounts(prev => ({
          ...prev,
          [videoId]: (prev[videoId] || 0) + 1
        }))
      } else {
        toast({
          title: "Comment Failed",
          description: result.error || "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: "Comment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddGuestComment = async (videoId: number) => {
    const commentText = newComment[videoId]?.trim()
    const name = guestName[videoId]?.trim()
    const role = guestRole[videoId]

    if (!commentText || !name || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields (name, role, and comment).",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addGuestVideoComment({
        video_id: videoId,
        guest_name: name,
        guest_role: role,
        comment: commentText
      })

      if (result.success) {
        toast({
          title: "Comment Added! 💬",
          description: `Your comment has been posted as ${role === 'doctor' ? 'Dr.' : ''} ${name}.`,
        })
        
        // Clear the comment inputs
        setNewComment(prev => ({
          ...prev,
          [videoId]: ''
        }))
        setGuestName(prev => ({
          ...prev,
          [videoId]: ''
        }))
        setGuestRole(prev => ({
          ...prev,
          [videoId]: undefined as any
        }))
        setShowGuestForm(prev => ({
          ...prev,
          [videoId]: false
        }))
        
        // Reload comments to show the new one
        await loadComments(videoId)
        
        // Update comment count
        setCommentCounts(prev => ({
          ...prev,
          [videoId]: (prev[videoId] || 0) + 1
        }))
      } else {
        toast({
          title: "Comment Failed",
          description: result.error || "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding guest comment:', error)
      toast({
        title: "Comment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Health & Medical Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore our comprehensive collection of educational health videos, research presentations, 
            and patient stories from medical professionals and researchers.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Stream HD Quality
            </span>
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download Available
            </span>
            <span className="flex items-center">
              <FileVideo className="w-4 h-4 mr-2" />
              Multiple Formats
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search videos, topics, or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800 font-medium">
                {isLoading ? 'Loading...' : `${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''} found`}
                {selectedCategory !== 'all' && categories.find(c => c.id.toString() === selectedCategory) && (
                  <span className="text-blue-600 ml-1">in {categories.find(c => c.id.toString() === selectedCategory)?.name}</span>
                )}
              </p>
              {!isLoading && (
                <p className="text-sm text-gray-500 mt-1">
                  Explore our collection of educational health and medical videos
                </p>
              )}
            </div>
            {!isLoading && filteredVideos.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <FileVideo className="w-4 h-4 mr-1" />
                All videos available for streaming and download
              </div>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-gray-200 hover:border-blue-300"
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-100">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play 
                        className="w-16 h-16 text-blue-400 cursor-pointer hover:text-blue-600 transition-colors duration-300" 
                        onClick={() => window.open(video.video_url, '_blank')}
                      />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div 
                      className="bg-white bg-opacity-95 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg cursor-pointer hover:bg-blue-50"
                      onClick={() => window.open(video.video_url, '_blank')}
                    >
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {video.duration}
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                      {video.category_name || 'General'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 leading-tight">
                    {video.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {video.description}
                  </p>

                  {/* Video metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {video.author_name && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {video.author_name}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(video.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {video.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {video.duration && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {video.duration}
                          </span>
                        )}
                        <span className="flex items-center">
                          <FileVideo className="w-3 h-3 mr-1" />
                          Video
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {commentCounts[video.id] !== undefined ? commentCounts[video.id] : '...'} comments
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium">
                        {video.category_name || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVideoClick(video)
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(video)
                      }}
                      className="px-3"
                      title="Download Video"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleComments(video.id)
                      }}
                      className="px-3"
                      title="View Comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="ml-1 text-xs">
                        {commentCounts[video.id] !== undefined ? commentCounts[video.id] : '...'}
                      </span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {showComments[video.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-sm mb-3 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comments
                      </h4>
                      
                      {/* Add Comment Form */}
                      {user ? (
                        <div className="mb-4">
                          <Textarea
                            value={newComment[video.id] || ''}
                            onChange={(e) => setNewComment(prev => ({
                              ...prev,
                              [video.id]: e.target.value
                            }))}
                            placeholder="Add a comment..."
                            className="text-sm"
                            rows={2}
                          />
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddComment(video.id)
                            }}
                            disabled={!newComment[video.id]?.trim()}
                          >
                            Post Comment
                          </Button>
                        </div>
                      ) : (
                        <div className="mb-4">
                          {!showGuestForm[video.id] ? (
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-sm text-gray-600 mb-3">Want to comment?</p>
                              <div className="flex justify-center space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href="/login">Sign In</a>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => setShowGuestForm(prev => ({
                                    ...prev,
                                    [video.id]: true
                                  }))}
                                >
                                  Comment as Guest
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Your name"
                                  value={guestName[video.id] || ''}
                                  onChange={(e) => setGuestName(prev => ({
                                    ...prev,
                                    [video.id]: e.target.value
                                  }))}
                                  className="text-sm"
                                />
                                <Select
                                  value={guestRole[video.id] || ''}
                                  onValueChange={(value: 'doctor' | 'user') => 
                                    setGuestRole(prev => ({
                                      ...prev,
                                      [video.id]: value
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="doctor">Doctor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Textarea
                                value={newComment[video.id] || ''}
                                onChange={(e) => setNewComment(prev => ({
                                  ...prev,
                                  [video.id]: e.target.value
                                }))}
                                placeholder="Add your comment..."
                                className="text-sm"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddGuestComment(video.id)
                                  }}
                                  disabled={!newComment[video.id]?.trim() || !guestName[video.id]?.trim() || !guestRole[video.id]}
                                >
                                  Post Comment
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setShowGuestForm(prev => ({
                                      ...prev,
                                      [video.id]: false
                                    }))
                                    setGuestName(prev => ({
                                      ...prev,
                                      [video.id]: ''
                                    }))
                                    setGuestRole(prev => ({
                                      ...prev,
                                      [video.id]: undefined as any
                                    }))
                                    setNewComment(prev => ({
                                      ...prev,
                                      [video.id]: ''
                                    }))
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

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
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm text-gray-900">
                                    {comment.guest_role === 'doctor' ? 'Dr. ' : ''}{comment.author_name || 'Anonymous'}
                                  </span>
                                  {comment.guest_role && (
                                    <Badge 
                                      variant={comment.guest_role === 'doctor' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {comment.guest_role === 'doctor' ? 'Doctor' : 'User'}
                                    </Badge>
                                  )}
                                  {!comment.guest_role && comment.user_id && (
                                    <Badge variant="outline" className="text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No videos found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Check back soon for new video content!'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Load More Button (for pagination if needed) */}
        {!isLoading && filteredVideos.length > 0 && filteredVideos.length >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Videos
            </Button>
          </div>
        )}
        </div>
      </section>
      
      <Footer />
      <Toaster />
    </div>
  )
}

export default VideosExplore