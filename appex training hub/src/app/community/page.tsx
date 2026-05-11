"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Users, 
  Star, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Share2, 
  Bookmark, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Award,
  MapPin,
  Briefcase,
  Clock,
  Video,
  FileText,
  UserCheck,
  Globe,
  Lock,
  ChevronRight,
  ArrowUp,
  CheckCircle
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
    company?: string
  }
  category: string
  tags: string[]
  replies: number
  views: number
  likes: number
  createdAt: string
  lastActivity: string
  isPinned: boolean
  isLocked: boolean
  hasSolution: boolean
}

interface SuccessStory {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
    company: string
    location: string
  }
  businessType: string
  challenge: string
  solution: string
  results: string[]
  metrics: {
    revenue: string
    efficiency: string
    timeSaved: string
  }
  featuredImage: string
  publishedDate: string
  readTime: string
  likes: number
  shares: number
  isFeatured: boolean
}

interface UserGroup {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  isPrivate: boolean
  isJoined: boolean
  tags: string[]
  recentActivity: string
  admins: Array<{
    name: string
    avatar: string
  }>
  upcomingEvents: number
  resources: number
}

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  postCount: number
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([])
  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchCommunityData()
    }
  }, [status, router])

  const fetchCommunityData = async () => {
    try {
      // Mock forum posts data
      const mockForumPosts: ForumPost[] = [
        {
          id: "1",
          title: "Best practices for inventory management in retail stores",
          content: "I've been struggling with keeping track of inventory across multiple locations. What strategies have worked for you?",
          author: {
            name: "Sarah Chen",
            avatar: "/avatars/sarah.jpg",
            role: "Store Manager",
            company: "TechMart Retail"
          },
          category: "Inventory Management",
          tags: ["inventory", "retail", "best-practices"],
          replies: 23,
          views: 456,
          likes: 45,
          createdAt: "2024-01-15T10:30:00Z",
          lastActivity: "2024-01-16T14:22:00Z",
          isPinned: true,
          isLocked: false,
          hasSolution: true
        },
        {
          id: "2",
          title: "How to handle customer returns efficiently?",
          content: "Looking for tips on streamlining our return process. Currently taking too much time...",
          author: {
            name: "Mike Johnson",
            avatar: "/avatars/mike.jpg",
            role: "Operations Manager",
            company: "QuickStop"
          },
          category: "Customer Service",
          tags: ["returns", "customer-service", "efficiency"],
          replies: 15,
          views: 234,
          likes: 28,
          createdAt: "2024-01-14T09:15:00Z",
          lastActivity: "2024-01-15T16:45:00Z",
          isPinned: false,
          isLocked: false,
          hasSolution: false
        }
      ]

      // Mock success stories data
      const mockSuccessStories: SuccessStory[] = [
        {
          id: "1",
          title: "How TechMart Reduced Inventory Costs by 35% with AppEx",
          excerpt: "A regional electronics retailer transformed their inventory management and saw dramatic improvements in efficiency and profitability.",
          content: "Full story content here...",
          author: {
            name: "David Kim",
            avatar: "/avatars/david.jpg",
            role: "CEO",
            company: "TechMart Retail",
            location: "Seattle, WA"
          },
          businessType: "Retail",
          challenge: "Manual inventory tracking across 12 locations was causing stockouts and overstock situations.",
          solution: "Implemented AppEx Retail with automated inventory management and real-time syncing.",
          results: [
            "35% reduction in inventory holding costs",
            "98% inventory accuracy rate",
            "Eliminated stockouts completely"
          ],
          metrics: {
            revenue: "+28%",
            efficiency: "+45%",
            timeSaved: "20 hours/week"
          },
          featuredImage: "/stories/techmart.jpg",
          publishedDate: "2024-01-10",
          readTime: "8 min",
          likes: 156,
          shares: 89,
          isFeatured: true
        },
        {
          id: "2",
          title: "Restaurant Chain Streamlines Operations with AppEx",
          excerpt: "A growing restaurant chain standardized operations across 8 locations using AppEx Restaurant Management.",
          content: "Full story content here...",
          author: {
            name: "Lisa Rodriguez",
            avatar: "/avatars/lisa.jpg",
            role: "Operations Director",
            company: "FlavorFusion Restaurants",
            location: "Austin, TX"
          },
          businessType: "Restaurant",
          challenge: "Inconsistent processes and reporting across multiple restaurant locations.",
          solution: "Deployed AppEx Restaurant with standardized workflows and centralized reporting.",
          results: [
            "25% increase in operational efficiency",
            "30% reduction in food waste",
            "Improved customer satisfaction scores"
          ],
          metrics: {
            revenue: "+18%",
            efficiency: "+25%",
            timeSaved: "15 hours/week"
          },
          featuredImage: "/stories/flavorfusion.jpg",
          publishedDate: "2024-01-08",
          readTime: "6 min",
          likes: 124,
          shares: 67,
          isFeatured: false
        }
      ]

      // Mock user groups data
      const mockUserGroups: UserGroup[] = [
        {
          id: "1",
          name: "Retail Store Managers",
          description: "Connect with other retail managers to share best practices and solve common challenges.",
          category: "Industry",
          memberCount: 1234,
          isPrivate: false,
          isJoined: true,
          tags: ["retail", "management", "operations"],
          recentActivity: "2 hours ago",
          admins: [
            { name: "Sarah Chen", avatar: "/avatars/sarah.jpg" },
            { name: "Tom Wilson", avatar: "/avatars/tom.jpg" }
          ],
          upcomingEvents: 3,
          resources: 45
        },
        {
          id: "2",
          name: "AppEx Power Users",
          description: "Advanced users sharing tips, tricks, and advanced techniques for getting the most out of AppEx.",
          category: "Expertise",
          memberCount: 856,
          isPrivate: false,
          isJoined: false,
          tags: ["power-users", "advanced", "tips"],
          recentActivity: "5 minutes ago",
          admins: [
            { name: "Mike Johnson", avatar: "/avatars/mike.jpg" }
          ],
          upcomingEvents: 2,
          resources: 78
        },
        {
          id: "3",
          name: "Restaurant Owners Network",
          description: "Private group for restaurant owners to discuss business challenges and opportunities.",
          category: "Industry",
          memberCount: 445,
          isPrivate: true,
          isJoined: false,
          tags: ["restaurant", "owners", "private"],
          recentActivity: "1 day ago",
          admins: [
            { name: "Lisa Rodriguez", avatar: "/avatars/lisa.jpg" }
          ],
          upcomingEvents: 1,
          resources: 23
        }
      ]

      setForumPosts(mockForumPosts)
      setSuccessStories(mockSuccessStories)
      setUserGroups(mockUserGroups)
    } catch (error) {
      console.error("Error fetching community data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = (groupId: string) => {
    setUserGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, isJoined: true, memberCount: group.memberCount + 1 } : group
      )
    )
  }

  const handleLeaveGroup = (groupId: string) => {
    setUserGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, isJoined: false, memberCount: group.memberCount - 1 } : group
      )
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Community</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search community..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        <Tabs defaultValue="forums" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forums">Discussion Forums</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="groups">User Groups</TabsTrigger>
          </TabsList>

          {/* Discussion Forums */}
          <TabsContent value="forums" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Discussion Forums</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Inventory Management">Inventory</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Best Practices">Best Practices</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                          {post.hasSolution && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                          {post.isLocked && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 hover:text-emerald-600 cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{post.author.name}</span>
                            <span>•</span>
                            <span>{post.author.role}</span>
                            {post.author.company && (
                              <>
                                <span>•</span>
                                <span>{post.author.company}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline">Load More Posts</Button>
            </div>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Success Stories</h2>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            </div>

            <div className="grid gap-6">
              {successStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Award className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {story.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {story.businessType}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {story.readTime} read
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 hover:text-emerald-600 cursor-pointer">
                          {story.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{story.excerpt}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{story.metrics.revenue}</div>
                            <div className="text-xs text-green-700">Revenue Growth</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{story.metrics.efficiency}</div>
                            <div className="text-xs text-blue-700">Efficiency Gain</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{story.metrics.timeSaved}</div>
                            <div className="text-xs text-purple-700">Time Saved</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={story.author.avatar} />
                              <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{story.author.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {story.author.role} at {story.author.company} • {story.author.location}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Heart className="h-4 w-4" />
                              <span>{story.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Share2 className="h-4 w-4" />
                              <span>{story.shares}</span>
                            </div>
                            <Button size="sm">Read More</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Groups */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Groups</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                      {group.isPrivate && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount.toLocaleString()} members</span>
                      </div>
                      <span>Active {group.recentActivity}</span>
                    </div>
                    
                    {group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex -space-x-2">
                        {group.admins.slice(0, 3).map((admin, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback className="text-xs">{admin.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {group.admins.length > 3 && (
                          <div className="h-6 w-6 border-2 border-white bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">+{group.admins.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{group.upcomingEvents} events</span>
                        <FileText className="h-3 w-3 ml-2" />
                        <span>{group.resources} resources</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      variant={group.isJoined ? "outline" : "default"}
                      onClick={() => group.isJoined ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)}
                    >
                      {group.isJoined ? "Joined" : "Join Group"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
