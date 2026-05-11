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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Filter, 
  ExternalLink, 
  Calendar,
  User,
  Paperclip,
  Video,
  Headphones,
  HelpCircle,
  FileText,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  Reply,
  MoreVertical,
  Download,
  MapPin
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface SupportTicket {
  id: string
  subject: string
  description: string
  category: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Open" | "In Progress" | "Pending" | "Resolved" | "Closed"
  createdAt: string
  updatedAt: string
  lastReply?: string
  assignedTo?: {
    name: string
    avatar: string
    role: string
  }
  attachments: number
  replies: number
  satisfactionRating?: number
}

interface ChatSession {
  id: string
  agent: {
    name: string
    avatar: string
    status: "online" | "offline" | "busy"
    role: string
  }
  startTime: string
  duration?: string
  status: "active" | "ended" | "queued"
  messages: Array<{
    id: string
    sender: "user" | "agent"
    content: string
    timestamp: string
  }>
  satisfactionRating?: number
}

interface SupportResource {
  id: string
  title: string
  description: string
  category: string
  type: "article" | "video" | "guide" | "faq"
  url: string
  popularity: number
  lastUpdated: string
  readTime?: string
  videoDuration?: string
}

export default function SupportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [resources, setResources] = useState<SupportResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "Medium" as const
  })
  const [isChatAvailable, setIsChatAvailable] = useState(true)
  const [zimTime, setZimTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Harare',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      })
      setZimTime(formatter.format(now))
      
      // Check if within business hours (8 AM - 5 PM)
      const zimHour = parseInt(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Harare',
        hour: 'numeric',
        hour12: false
      }).format(now))
      const zimDay = now.getDay()
      setIsChatAvailable(zimDay >= 1 && zimDay <= 5 && zimHour >= 8 && zimHour < 17)
    }

    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchSupportData()
    }
  }, [status, router])

  const fetchSupportData = async () => {
    try {
      // Mock support tickets data
      const mockTickets: SupportTicket[] = [
        {
          id: "TKT-001234",
          subject: "POS system not responding after update",
          description: "After the latest update, our POS system is freezing intermittently during peak hours.",
          category: "Technical Issue",
          priority: "High",
          status: "In Progress",
          createdAt: "2024-01-15T09:30:00Z",
          updatedAt: "2024-01-15T14:22:00Z",
          lastReply: "2024-01-15T14:22:00Z",
          assignedTo: {
            name: "Sarah Chen",
            avatar: "/avatars/sarah.jpg",
            role: "Senior Support Specialist"
          },
          attachments: 2,
          replies: 4,
          satisfactionRating: undefined
        },
        {
          id: "TKT-001235",
          subject: "Question about inventory reporting features",
          description: "Need help understanding how to generate custom inventory reports for our monthly meetings.",
          category: "How-to Question",
          priority: "Low",
          status: "Resolved",
          createdAt: "2024-01-14T11:15:00Z",
          updatedAt: "2024-01-14T16:45:00Z",
          lastReply: "2024-01-14T16:45:00Z",
          assignedTo: {
            name: "Mike Johnson",
            avatar: "/avatars/mike.jpg",
            role: "Support Specialist"
          },
          attachments: 0,
          replies: 3,
          satisfactionRating: 5
        },
        {
          id: "TKT-001236",
          subject: "Billing inquiry for subscription renewal",
          description: "Would like to understand our renewal options and any available discounts for multi-year commitment.",
          category: "Billing",
          priority: "Medium",
          status: "Open",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
          assignedTo: undefined,
          attachments: 1,
          replies: 0,
          satisfactionRating: undefined
        }
      ]

      // Mock chat sessions data
      const mockChatSessions: ChatSession[] = [
        {
          id: "CHAT-001",
          agent: {
            name: "Lisa Rodriguez",
            avatar: "/avatars/lisa.jpg",
            status: "online",
            role: "Live Chat Agent"
          },
          startTime: "2024-01-15T13:30:00Z",
          duration: "25 minutes",
          status: "ended",
          messages: [
            {
              id: "1",
              sender: "user",
              content: "Hi, I need help with setting up user permissions",
              timestamp: "2024-01-15T13:30:00Z"
            },
            {
              id: "2",
              sender: "agent",
              content: "Hello! I'd be happy to help you set up user permissions. Let me guide you through the process.",
              timestamp: "2024-01-15T13:31:00Z"
            }
          ],
          satisfactionRating: 5
        },
        {
          id: "CHAT-002",
          agent: {
            name: "Tom Wilson",
            avatar: "/avatars/tom.jpg",
            status: "online",
            role: "Technical Support Agent"
          },
          startTime: "2024-01-16T09:00:00Z",
          status: "active",
          messages: [
            {
              id: "1",
              sender: "user",
              content: "Having issues with barcode scanner setup",
              timestamp: "2024-01-16T09:00:00Z"
            }
          ],
          satisfactionRating: undefined
        }
      ]

      // Mock support resources
      const mockResources: SupportResource[] = [
        {
          id: "1",
          title: "Getting Started with AppEx POS",
          description: "Complete guide to setting up and using your POS system",
          category: "Getting Started",
          type: "guide",
          url: "#",
          popularity: 892,
          lastUpdated: "2024-01-10",
          readTime: "10 min"
        },
        {
          id: "2",
          title: "Troubleshooting Common Printer Issues",
          description: "Step-by-step video guide to resolve printer connectivity problems",
          category: "Technical Support",
          type: "video",
          url: "#",
          popularity: 456,
          lastUpdated: "2024-01-12",
          videoDuration: "8:30"
        },
        {
          id: "3",
          title: "How to Generate Sales Reports",
          description: "Learn to create and customize sales reports for your business",
          category: "Reporting",
          type: "article",
          url: "#",
          popularity: 623,
          lastUpdated: "2024-01-08",
          readTime: "5 min"
        }
      ]

      setTickets(mockTickets)
      setChatSessions(mockChatSessions)
      setResources(mockResources)
    } catch (error) {
      console.error("Error fetching support data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTicket = () => {
    const ticket: SupportTicket = {
      id: `TKT-${Date.now()}`,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: 0,
      replies: 0
    }
    
    setTickets(prev => [ticket, ...prev])
    setShowNewTicketForm(false)
    setNewTicket({ subject: "", description: "", category: "", priority: "Medium" })
  }

  const handleStartChat = () => {
    if (isChatAvailable) {
      // In a real implementation, this would open a chat widget or navigate to chat
      alert("Chat functionality would be implemented here")
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800"
      case "High": return "bg-orange-100 text-orange-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800"
      case "In Progress": return "bg-purple-100 text-purple-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Resolved": return "bg-green-100 text-green-800"
      case "Closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
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
          <h1 className="text-3xl font-bold">Support</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search support..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setShowNewTicketForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartChat}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                {isChatAvailable ? "Agents available" : "Currently offline"}
              </p>
              <Badge className={isChatAvailable ? "bg-green-100 text-green-800 mt-2" : "bg-gray-100 text-gray-800 mt-2"}>
                {isChatAvailable ? "Online" : "Offline"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Emergency Support</h3>
              <p className="text-sm text-muted-foreground font-bold text-red-600">+263 77 123 4567</p>
              <p className="text-xs text-muted-foreground mt-1">For critical outages only</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href="tel:+263771234567">Call Now</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground">Fastest for Zim users</p>
              <Button variant="outline" size="sm" className="mt-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50" asChild>
                <a href="https://wa.me/263771234567" target="_blank" rel="noopener noreferrer">Message Us</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-sm text-muted-foreground">Detailed inquiries</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href="mailto:support@appex.co.zw">Send Email</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="resources">Help Resources</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          {/* Support Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Support Tickets</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="How-to Question">How-to Question</option>
                  <option value="Billing">Billing</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* New Ticket Form */}
            {showNewTicketForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Support Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value || "" }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                            <SelectItem value="Billing Question">Billing Question</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Account Management">Account Management</SelectItem>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description of your issue or question"
                        rows={4}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleCreateTicket}>Submit Ticket</Button>
                      <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tickets List */}
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ticket.category}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 hover:text-emerald-600 cursor-pointer">
                          {ticket.subject}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Ticket #{ticket.id}</span>
                            <span>•</span>
                            <span>Created {formatTimeAgo(ticket.createdAt)}</span>
                            {ticket.lastReply && (
                              <>
                                <span>•</span>
                                <span>Last reply {formatTimeAgo(ticket.lastReply)}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {ticket.attachments > 0 && (
                              <div className="flex items-center space-x-1">
                                <Paperclip className="h-4 w-4" />
                                <span>{ticket.attachments}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{ticket.replies}</span>
                            </div>
                            {ticket.satisfactionRating && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{ticket.satisfactionRating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {ticket.assignedTo && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={ticket.assignedTo.avatar} />
                              <AvatarFallback className="text-xs">{ticket.assignedTo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              Assigned to {ticket.assignedTo.name} • {ticket.assignedTo.role}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Chat */}
          <TabsContent value="chat" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chat History</h2>
              <Button onClick={handleStartChat} disabled={!isChatAvailable}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>

            <div className="grid gap-4">
              {chatSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.agent.avatar} />
                          <AvatarFallback>{session.agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{session.agent.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {session.agent.role}
                            </Badge>
                            <Badge className={
                              session.agent.status === 'online' ? 'bg-green-100 text-green-800' :
                              session.agent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {session.agent.status}
                            </Badge>
                            <Badge className={
                              session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {session.status}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-2">
                            {session.messages[0]?.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Started {formatTimeAgo(session.startTime)}</span>
                            {session.duration && (
                              <>
                                <span>•</span>
                                <span>{session.duration}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{session.messages.length} messages</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {session.satisfactionRating && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{session.satisfactionRating}/5</span>
                          </div>
                        )}
                        <Button variant="outline" size="sm">
                          {session.status === 'active' ? 'Continue Chat' : 'View Transcript'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Help Resources */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Help Resources</h2>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Resources
              </Button>
            </div>

            <div className="grid gap-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {resource.type === 'video' && <Video className="h-6 w-6 text-gray-600" />}
                          {resource.type === 'guide' && <FileText className="h-6 w-6 text-gray-600" />}
                          {resource.type === 'article' && <FileText className="h-6 w-6 text-gray-600" />}
                          {resource.type === 'faq' && <HelpCircle className="h-6 w-6 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {resource.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {resource.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {resource.readTime || resource.videoDuration}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2 hover:text-emerald-600 cursor-pointer">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{resource.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{resource.popularity} views</span>
                            </div>
                            <span>•</span>
                            <span>Updated {formatTimeAgo(resource.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Info */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Phone Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Main Support Line</h4>
                      <p className="text-2xl font-bold text-emerald-600">1-800-APPEX-01</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri 8:00 AM - 6:00 PM EST</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Emergency Support</h4>
                      <p className="text-lg font-bold text-red-600">1-800-APPEX-99</p>
                      <p className="text-sm text-muted-foreground">24/7 for critical issues</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">International</h4>
                      <p className="text-sm">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Available worldwide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">General Support</h4>
                      <p className="text-emerald-600">support@appex.com</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Technical Issues</h4>
                      <p className="text-emerald-600">technical@appex.com</p>
                      <p className="text-sm text-muted-foreground">Response within 4-8 hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Billing & Accounts</h4>
                      <p className="text-emerald-600">billing@appex.com</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Office Locations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Headquarters</h4>
                      <p className="text-sm">123 Tech Street, Suite 100</p>
                      <p className="text-sm">San Francisco, CA 94105</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">East Coast Office</h4>
                      <p className="text-sm">456 Business Ave, Floor 5</p>
                      <p className="text-sm">New York, NY 10001</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">European Office</h4>
                      <p className="text-sm">789 Innovation Road</p>
                      <p className="text-sm">London, UK EC1A 1BB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Business Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center">
                      <span className="text-sm font-medium">Harare Current Time:</span>
                      <span className="text-lg font-bold text-emerald-700">{zimTime}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Live Support (Chat/WhatsApp)</h4>
                      <p className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM CAT</p>
                      <p className="text-sm text-muted-foreground">Zimbabwe Time Zone</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone Support</h4>
                      <p className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM CAT</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Support</h4>
                      <p className="text-sm">24/7 - Ticket creation available anytime</p>
                      <p className="text-xs text-muted-foreground">Typical response within 4 business hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
