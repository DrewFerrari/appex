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
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Settings,
  Download,
  Search,
  Eye,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  ChevronRight,
  Star,
  Clock,
  FileCheck,
  AlertTriangle,
  Wrench,
  Users,
  Calendar,
  Flame,
  PlusCircle,
  History,
  Archive
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface UserGuide {
  id: string
  title: string
  description: string
  category: string
  fileSize: string
  pageCount: number
  lastUpdated: string
  isPopular: boolean
  downloadUrl: string
  previewUrl: string
  version: string
}

interface QuickReference {
  id: string
  title: string
  description: string
  category: string
  fileSize: string
  downloadUrl: string
  isPrintable: boolean
  icon: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  isPopular: boolean
  lastUpdated: string
}

interface TroubleshootingGuide {
  id: string
  title: string
  symptom: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  successRate: number
  steps: TroubleshootingStep[]
  relatedIssues: string[]
}

interface TroubleshootingStep {
  id: string
  question: string
  condition: string
  solution: string
  nextStep?: string
}

import { useParams } from "next/navigation"

export default function DocumentationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [userGuides, setUserGuides] = useState<UserGuide[]>([])
  const [quickReferences, setQuickReferences] = useState<QuickReference[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [troubleshootingGuides, setTroubleshootingGuides] = useState<TroubleshootingGuide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set())
  const [userFeedback, setUserFeedback] = useState<Record<string, "helpful" | "not-helpful">>({})
  const [activeTab, setActiveTab] = useState<string>("guides")

  useEffect(() => {
    if (params?.tab) {
      const tabMap: Record<string, string> = {
        'guides': 'guides',
        'reference': 'reference',
        'faq': 'faq',
        'troubleshooting': 'troubleshooting'
      }
      setActiveTab(tabMap[params.tab as string] || 'guides')
    }
  }, [params])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchDocumentationData()
    }
  }, [status, router])

  const fetchDocumentationData = async () => {
    try {
      // Mock data for User Guides
      const mockUserGuides: UserGuide[] = [
        {
          id: "1",
          title: "Getting Started Guide - Retail Management",
          description: "Complete setup and configuration guide for retail businesses in Zimbabwe",
          category: "Getting Started",
          fileSize: "2.5 MB",
          pageCount: 45,
          lastUpdated: "2024-03-15",
          isPopular: true,
          downloadUrl: "#",
          previewUrl: "#",
          version: "2.1.0"
        },
        {
          id: "2",
          title: "Restaurant Management - KDS Manual",
          description: "Comprehensive guide for Kitchen Display System optimization",
          category: "Getting Started",
          fileSize: "3.2 MB",
          pageCount: 32,
          lastUpdated: "2024-03-10",
          isPopular: true,
          downloadUrl: "#",
          previewUrl: "#",
          version: "1.2.0"
        },
        {
          id: "3",
          title: "Pharmacy Compliance Guide (MCAZ)",
          description: "Regulatory reporting and controlled drug register management",
          category: "Administrator",
          fileSize: "4.1 MB",
          pageCount: 65,
          lastUpdated: "2024-03-08",
          isPopular: false,
          downloadUrl: "#",
          previewUrl: "#",
          version: "1.5.2"
        },
        {
          id: "4",
          title: "Complete User Manual v3.0",
          description: "Full system documentation covering all modules and integrations",
          category: "User Manuals",
          fileSize: "8.2 MB",
          pageCount: 180,
          lastUpdated: "2024-02-28",
          isPopular: true,
          downloadUrl: "#",
          previewUrl: "#",
          version: "3.0.1"
        }
      ]

      // Mock data for Quick References
      const mockQuickReferences: QuickReference[] = [
        {
          id: "1",
          title: "POS Keyboard Shortcuts",
          description: "Complete list of F-key functions and keyboard shortcuts for high-speed POS operations",
          category: "POS Operations",
          fileSize: "150 KB",
          downloadUrl: "#",
          isPrintable: true,
          icon: "⌨️"
        },
        {
          id: "2",
          title: "Inventory Management Cheat Sheet",
          description: "Stock adjustment workflows, purchase orders, and supplier management summary",
          category: "Inventory",
          fileSize: "200 KB",
          downloadUrl: "#",
          isPrintable: true,
          icon: "📦"
        },
        {
          id: "3",
          title: "Daily Closing Checklist",
          description: "Step-by-step end-of-day procedures and reconciliation checklist",
          category: "Operations",
          fileSize: "100 KB",
          downloadUrl: "#",
          isPrintable: true,
          icon: "✅"
        },
        {
          id: "4",
          title: "Customer Service Quick Guide",
          description: "Common customer scenarios, resolutions, and loyalty program management",
          category: "Customers",
          fileSize: "180 KB",
          downloadUrl: "#",
          isPrintable: true,
          icon: "🤝"
        }
      ]

      // Mock data for FAQs
      const mockFAQs: FAQ[] = [
        {
          id: "1",
          question: "How do I set up my first product in the system?",
          answer: "To set up your first product, navigate to Inventory > Products > Add New Product. Fill in the required information including product name, SKU, price, and category. Save the product and it will be available in your POS system.",
          category: "Getting Started",
          helpful: 245,
          notHelpful: 12,
          isPopular: true,
          lastUpdated: "2024-03-12"
        },
        {
          id: "2",
          question: "What should I do if my receipt printer is not working?",
          answer: "First, check that the printer is powered on and connected to your computer. Verify that the correct printer is selected in Settings > Hardware > Receipt Printer. If issues persist, try restarting both the printer and your computer, then check for driver updates.",
          category: "Hardware and Setup",
          helpful: 189,
          notHelpful: 8,
          isPopular: true,
          lastUpdated: "2024-03-14"
        },
        {
          id: "3",
          question: "How can I process a split payment?",
          answer: "On the checkout screen, select 'Split Payment'. You can then choose to split by amount or by item. Enter the amounts for each payment method (e.g., Cash and Swipe) and process each one until the full balance is paid.",
          category: "Sales and POS Operations",
          helpful: 134,
          notHelpful: 4,
          isPopular: false,
          lastUpdated: "2024-03-11"
        },
        {
          id: "4",
          question: "How do I manage expiry dates for grocery items?",
          answer: "When adding or editing a product, enable 'Track Expiry'. You can then enter the expiry date for each batch received. The system will alert you when items are near expiry and can automatically apply markdowns if configured.",
          category: "Inventory Management",
          helpful: 92,
          notHelpful: 2,
          isPopular: false,
          lastUpdated: "2024-03-15"
        }
      ]

      // Mock data for Troubleshooting
      const mockTroubleshooting: TroubleshootingGuide[] = [
        {
          id: "1",
          title: "Printer Not Responding",
          symptom: "Receipt printer not printing when sales are completed",
          difficulty: "Easy",
          estimatedTime: "5-10 minutes",
          successRate: 92,
          steps: [
            {
              id: "1",
              question: "Is the printer powered on?",
              condition: "Check if the printer has power and is turned on",
              solution: "Ensure the printer is plugged in and the power button is pressed. Check for any indicator lights.",
              nextStep: "2"
            },
            {
              id: "2",
              question: "Is the printer connected to the computer?",
              condition: "Verify physical connection between printer and computer",
              solution: "Check USB cable connection or network connection if using a network printer. Try a different USB port if available.",
              nextStep: "3"
            }
          ],
          relatedIssues: ["Barcode Scanner Not Working", "Cash Drawer Not Opening"]
        },
        {
          id: "2",
          title: "Barcode Scanner Not Working",
          symptom: "Barcode scanner not reading product barcodes",
          difficulty: "Medium",
          estimatedTime: "10-15 minutes",
          successRate: 87,
          steps: [
            {
              id: "1",
              question: "Is the scanner powered and connected?",
              condition: "Check scanner power and connection status",
              solution: "Verify the scanner is powered on and properly connected via USB."
            }
          ],
          relatedIssues: ["Printer Not Responding", "POS System Lag"]
        },
        {
          id: "3",
          title: "Sync Failed Error",
          symptom: "Database sync failed during end-of-day or startup",
          difficulty: "Hard",
          estimatedTime: "15-30 minutes",
          successRate: 82,
          steps: [
            {
              id: "1",
              question: "Check internet connection",
              condition: "Internet must be active for sync",
              solution: "Verify your router is active and you have a valid data connection."
            }
          ],
          relatedIssues: ["Login Issues", "System Lag"]
        },
        {
          id: "4",
          title: "System Lag / Slowdown",
          symptom: "POS interface responding slowly to inputs",
          difficulty: "Medium",
          estimatedTime: "10 minutes",
          successRate: 95,
          steps: [
            {
              id: "1",
              question: "Check memory usage",
              condition: "Close unnecessary applications",
              solution: "Ensure only AppEx and essential tools are running on the POS terminal."
            }
          ],
          relatedIssues: ["Printer Not Responding"]
        }
      ]

      setUserGuides(mockUserGuides)
      setQuickReferences(mockQuickReferences)
      setFaqs(mockFAQs)
      setTroubleshootingGuides(mockTroubleshooting)
    } catch (error) {
      console.error("Error fetching documentation data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
    }
    setExpandedFAQs(newExpanded)
  }

  const handleFAQFeedback = (faqId: string, feedback: "helpful" | "not-helpful") => {
    setUserFeedback(prev => ({ ...prev, [faqId]: feedback }))
    // In a real implementation, this would send feedback to the server
  }

  const filterContent = (content: any[], searchField: string = "title") => {
    if (!searchTerm && selectedCategory === "all") return content
    
    return content.filter(item => {
      const matchesSearch = !searchTerm || 
        item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
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

  const filteredGuides = filterContent(userGuides)
  const filteredReferences = filterContent(quickReferences)
  const filteredFAQs = filterContent(faqs, "question")
  const filteredTroubleshooting = filterContent(troubleshootingGuides)

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Documentation</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="reference">Quick Reference</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          {/* User Guides */}
          <TabsContent value="guides" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Guides</h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Getting Started">Getting Started</option>
                <option value="User Manuals">User Manuals</option>
                <option value="Administrator">Administrator</option>
                <option value="Advanced Features">Advanced Features</option>
              </select>
            </div>

            <div className="grid gap-4">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{guide.title}</h3>
                          {guide.isPopular && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{guide.fileSize}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{guide.pageCount} pages</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Updated {guide.lastUpdated}</span>
                          </span>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            EN
                          </Badge>
                          <span className="text-[10px] text-muted-foreground italic">
                            (Shona/Ndebele Coming Soon)
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={guide.previewUrl} target="_blank">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={guide.downloadUrl} target="_blank">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Link>
                          </Button>
                        </div>
                        <Button variant="ghost" size="xs" className="text-[10px] h-6 text-muted-foreground hover:text-emerald-600">
                          <Download className="h-3 w-3 mr-1" />
                          Download (Compressed - 0.8 MB)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quick Reference */}
          <TabsContent value="reference" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quick Reference</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All as ZIP
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReferences.map((ref) => (
                <Card key={ref.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{ref.icon}</div>
                      <h3 className="font-semibold">{ref.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{ref.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{ref.fileSize}</span>
                      <div className="flex space-x-2">
                        {ref.isPrintable && (
                          <Badge variant="secondary" className="text-xs">
                            Printable
                          </Badge>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={ref.downloadUrl} target="_blank">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                <p className="text-sm text-muted-foreground">Search our knowledge base for quick answers to common questions.</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Submit New Question
                </Button>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Getting Started">Getting Started</option>
                  <option value="Sales and POS Operations">Sales and POS</option>
                  <option value="Inventory Management">Inventory</option>
                  <option value="Customer Management">Customers</option>
                  <option value="Reporting and Analytics">Reporting</option>
                  <option value="Hardware and Setup">Hardware</option>
                  <option value="Billing and Subscriptions">Billing</option>
                  <option value="Troubleshooting">Troubleshooting</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {faq.isPopular && (
                            <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-600 border-orange-100">
                              <Flame className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full text-left font-semibold text-lg hover:text-emerald-600 transition-colors"
                        >
                          {faq.question}
                        </button>
                        {expandedFAQs.has(faq.id) && (
                          <div className="mt-3 text-gray-600">
                            <p>{faq.answer}</p>
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Updated {faq.lastUpdated}
                              </span>
                              <div className="flex items-center space-x-4">
                                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                                <div className="flex space-x-2">
                                  <Button
                                    variant={userFeedback[faq.id] === "helpful" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFAQFeedback(faq.id, "helpful")}
                                    className="text-xs"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {faq.helpful}
                                  </Button>
                                  <Button
                                    variant={userFeedback[faq.id] === "not-helpful" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFAQFeedback(faq.id, "not-helpful")}
                                    className="text-xs"
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    {faq.notHelpful}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-muted-foreground transition-transform ml-4 ${
                          expandedFAQs.has(faq.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Troubleshooting */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Troubleshooting Guides</h2>
            </div>

            <div className="grid gap-6">
              {filteredTroubleshooting.map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <span>{guide.title}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{guide.symptom}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={guide.difficulty === "Easy" ? "secondary" : guide.difficulty === "Medium" ? "default" : "destructive"}>
                          {guide.difficulty}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {guide.estimatedTime}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {guide.successRate}% success rate
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Troubleshooting Steps:</h4>
                      <div className="space-y-3">
                        {guide.steps.map((step: TroubleshootingStep, index: number) => (
                          <div key={step.id} className="border-l-4 border-emerald-500 pl-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">Step {index + 1}:</span>
                              <span className="text-sm font-medium">{step.question}</span>
                            </div>
                            <p className="text-sm text-gray-600">{step.solution}</p>
                          </div>
                        ))}
                      </div>
                      
                      {guide.relatedIssues.length > 0 && (
                        <div className="pt-4 border-t">
                          <h5 className="text-sm font-medium mb-2">Related Issues:</h5>
                          <div className="flex flex-wrap gap-2">
                            {guide.relatedIssues.map((issue: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Create Support Ticket
                        </Button>
                      </div>
                    </div>
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
