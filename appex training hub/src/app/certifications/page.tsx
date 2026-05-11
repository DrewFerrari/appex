"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, 
  Download, 
  ExternalLink, 
  Share2, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  Gift, 
  MessageSquare, 
  Video, 
  DollarSign, 
  Shield, 
  Zap,
  BookOpen,
  Trophy,
  Lock
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface CertificationTier {
  id: string
  name: string
  description: string
  level: "User" | "Manager" | "Trainer" | "Partner"
  requirements: {
    coursesRequired: number
    examRequired: boolean
    minScore: number
    additionalRequirements?: string[]
  }
  benefits: string[]
  estimatedTime: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
}

interface UserProgress {
  tierId: string
  progress: number
  completedCourses: string[]
  examScore?: number
  examCompleted?: boolean
  certificateEarned?: boolean
  certificateUrl?: string
  earnedDate?: string
  verificationCode?: string
}

interface EarnedCertificate {
  id: string
  tierName: string
  courseTitle: string
  earnedDate: string
  certificateUrl: string
  verificationCode: string
  score: number
  badgeUrl: string
  shareUrl: string
}

interface DigitalBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedDate: string
  category: string
  embedCode: string
}

export default function CertificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [certificationTiers, setCertificationTiers] = useState<CertificationTier[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [earnedCertificates, setEarnedCertificates] = useState<EarnedCertificate[]>([])
  const [digitalBadges, setDigitalBadges] = useState<DigitalBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string>("user")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (status === "unauthenticated") {
      router.replace("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchCertificationData()
    }
  }, [status, mounted, router])

  const fetchCertificationData = async () => {
    try {
      // Mock certification tiers data
      const mockCertificationTiers: CertificationTier[] = [
        {
          id: "user",
          name: "AppEx Certified User",
          description: "Foundation certification for mastering basic AppEx operations",
          level: "User",
          requirements: {
            coursesRequired: 3,
            examRequired: false,
            minScore: 0
          },
          benefits: [
            "Certificate of completion",
            "Digital badge for email signature",
            "Access to user community forums",
            "Priority email support"
          ],
          estimatedTime: "15-20 hours",
          icon: Award,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        },
        {
          id: "manager",
          name: "AppEx Certified Manager",
          description: "Advanced certification for managing AppEx implementations and teams",
          level: "Manager",
          requirements: {
            coursesRequired: 8,
            examRequired: true,
            minScore: 80,
            additionalRequirements: ["6 months AppEx experience", "Manager recommendation"]
          },
          benefits: [
            "Manager certificate with verification code",
            "Advanced digital badge",
            "Dedicated support access",
            "Monthly expert webinars",
            "Co-marketing opportunities",
            "10% commission on referrals"
          ],
          estimatedTime: "40-50 hours",
          icon: Trophy,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        },
        {
          id: "trainer",
          name: "AppEx Certified Trainer",
          description: "Expert certification for training others on AppEx systems",
          level: "Trainer",
          requirements: {
            coursesRequired: 12,
            examRequired: true,
            minScore: 85,
            additionalRequirements: ["Manager certification", "Teaching experience", "Training demo"]
          },
          benefits: [
            "Trainer certificate with verification",
            "Elite trainer digital badge",
            "Training materials and resources",
            "Quarterly trainer conferences",
            "Revenue sharing on training programs",
            "15% commission on referrals",
            "Co-branded marketing materials"
          ],
          estimatedTime: "60-80 hours",
          icon: Users,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        },
        {
          id: "partner",
          name: "AppEx Certified Partner",
          description: "Premium certification for business partners and consultants",
          level: "Partner",
          requirements: {
            coursesRequired: 15,
            examRequired: true,
            minScore: 90,
            additionalRequirements: ["Trainer certification", "Business partnership", "Sales performance criteria"]
          },
          benefits: [
            "Partner certificate with verification",
            "Premium partner digital badge",
            "Exclusive partner portal access",
            "Lead generation and referrals",
            "25% commission on all sales",
            "White-label training options",
            "Annual partner conference",
            "Dedicated account manager",
            "API access for integrations"
          ],
          estimatedTime: "80-100 hours",
          icon: Shield,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200"
        }
      ]

      // Mock user progress data
      const mockUserProgress: UserProgress[] = [
        {
          tierId: "user",
          progress: 100,
          completedCourses: ["1", "2", "3"],
          certificateEarned: true,
          certificateUrl: "#",
          earnedDate: "2024-01-10",
          verificationCode: "APPX-USER-2024-001"
        },
        {
          tierId: "manager",
          progress: 65,
          completedCourses: ["1", "2", "3", "4", "5"],
          examCompleted: false
        },
        {
          tierId: "trainer",
          progress: 25,
          completedCourses: ["1", "2", "3"],
          examCompleted: false
        },
        {
          tierId: "partner",
          progress: 10,
          completedCourses: ["1"],
          examCompleted: false
        }
      ]

      // Mock earned certificates
      const mockEarnedCertificates: EarnedCertificate[] = [
        {
          id: "1",
          tierName: "AppEx Certified User",
          courseTitle: "Getting Started with AppEx",
          earnedDate: "2024-01-10",
          certificateUrl: "#",
          verificationCode: "APPX-USER-2024-001",
          score: 92,
          badgeUrl: "#",
          shareUrl: "#"
        }
      ]

      // Mock digital badges
      const mockDigitalBadges: DigitalBadge[] = [
        {
          id: "1",
          name: "AppEx Certified User",
          description: "Completed foundation certification program",
          icon: "🏆",
          earnedDate: "2024-01-10",
          category: "Certification",
          embedCode: '<div class="appex-badge">AppEx Certified User</div>'
        },
        {
          id: "2",
          name: "Quick Learner",
          description: "Completed 5 courses in one month",
          icon: "⚡",
          earnedDate: "2024-01-15",
          category: "Achievement",
          embedCode: '<div class="appex-badge">Quick Learner</div>'
        }
      ]

      setCertificationTiers(mockCertificationTiers)
      setUserProgress(mockUserProgress)
      setEarnedCertificates(mockEarnedCertificates)
      setDigitalBadges(mockDigitalBadges)
    } catch (error) {
      console.error("Error fetching certification data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCertificate = (certificateId: string) => {
    router.push(`/certificates/${certificateId}`)
  }

  const handleDownloadCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank')
  }

  const handleShareCertificate = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl)
    // Show toast notification
  }

  const handleVerifyCertificate = (verificationCode: string) => {
    window.open(`/verify/${verificationCode}`, '_blank')
  }

  const getTierProgress = (tierId: string) => {
    const progress = userProgress.find(p => p.tierId === tierId)
    return progress || { 
      tierId, 
      progress: 0, 
      completedCourses: [], 
      certificateEarned: false,
      examCompleted: false
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Certifications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advance your career with AppEx professional certifications. 
            Demonstrate your expertise and unlock exclusive benefits.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            <TabsTrigger value="badges">Digital Badges</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {certificationTiers.map((tier) => {
                const Icon = tier.icon
                const progress = getTierProgress(tier.id)
                const isLocked = tier.level !== "User" && !getTierProgress("user").certificateEarned
                
                return (
                  <Card key={tier.id} className={`hover:shadow-lg transition-shadow ${isLocked ? 'opacity-75' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${tier.bgColor} ${tier.borderColor} border`}>
                            <Icon className={`h-8 w-8 ${tier.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center space-x-2">
                              <span>{tier.name}</span>
                              {progress.certificateEarned && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Earned
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-gray-600 mt-1">{tier.description}</p>
                          </div>
                        </div>
                        {isLocked && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center space-x-2">
                            <Target className="h-4 w-4" />
                            <span>Requirements</span>
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>Complete {tier.requirements.coursesRequired} courses</span>
                              {progress.completedCourses.length > 0 && (
                                <span className="text-emerald-600">({progress.completedCourses.length} completed)</span>
                              )}
                            </li>
                            {tier.requirements.examRequired && (
                              <li className="flex items-center space-x-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>Pass certification exam (Score: {tier.requirements.minScore}%+)</span>
                                {progress.examCompleted && (
                                  <span className="text-emerald-600">(Completed)</span>
                                )}
                              </li>
                            )}
                            {tier.requirements.additionalRequirements?.map((req, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress value={progress.progress} className="h-2" />
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center space-x-2">
                            <Gift className="h-4 w-4" />
                            <span>Benefits</span>
                          </h4>
                          <ul className="space-y-2 text-sm">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Estimated time: {tier.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <Button 
                          className="w-full"
                          disabled={isLocked}
                          onClick={() => router.push(`/my-learning?tab=enrolled`)}
                        >
                          {progress.certificateEarned ? "View Certificate" : 
                           progress.progress > 0 ? "Continue Learning" : "Start Certification"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6">
              {certificationTiers.map((tier) => {
                const Icon = tier.icon
                const progress = getTierProgress(tier.id)
                
                return (
                  <Card key={tier.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${tier.bgColor} ${tier.borderColor} border`}>
                          <Icon className={`h-6 w-6 ${tier.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Overall Progress</span>
                                <span>{progress.progress}%</span>
                              </div>
                              <Progress value={progress.progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{progress.progress}%</div>
                          <div className="text-sm text-muted-foreground">
                            {progress.certificateEarned ? "Completed" : "In Progress"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{progress.completedCourses.length}</div>
                          <div className="text-sm text-muted-foreground">
                            of {tier.requirements.coursesRequired} courses
                          </div>
                        </div>
                        {tier.requirements.examRequired && (
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                              {progress.examCompleted ? "✓" : "—"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Exam {progress.examCompleted ? "Completed" : "Pending"}
                            </div>
                          </div>
                        )}
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {progress.earnedDate ? new Date(progress.earnedDate).toLocaleDateString() : "—"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {progress.earnedDate ? "Completed Date" : "Est. Completion"}
                          </div>
                        </div>
                      </div>
                      
                      {progress.certificateEarned && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800">Certificate Earned!</h4>
                              <p className="text-sm text-green-600">Verification Code: {progress.verificationCode}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewCertificate(progress.certificateUrl!)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleDownloadCertificate(progress.certificateUrl!)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* My Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            {earnedCertificates.length > 0 ? (
              <div className="grid gap-6">
                {earnedCertificates.map((certificate) => (
                  <Card key={certificate.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{certificate.tierName}</h3>
                              <p className="text-sm text-gray-600">{certificate.courseTitle}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Earned: {certificate.earnedDate}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>Score: {certificate.score}%</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span>Code: {certificate.verificationCode}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleViewCertificate(certificate.id)}
                              className="flex-1"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Certificate
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleDownloadCertificate(certificate.certificateUrl)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleShareCertificate(certificate.shareUrl)}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleVerifyCertificate(certificate.verificationCode)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your first certification program to earn your certificate.
                  </p>
                  <Button onClick={() => router.push("/my-learning")}>
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Digital Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Digital Badges</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All Badges
              </Button>
            </div>

            {digitalBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {digitalBadges.map((badge) => (
                  <Card key={badge.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{badge.icon}</div>
                      <h3 className="font-semibold mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>Earned: {badge.earnedDate}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {badge.category}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Badge
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Badge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Badges Earned Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete courses and achievements to earn digital badges.
                  </p>
                  <Button onClick={() => router.push("/my-learning")}>
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Embed Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Embed Your Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Show off your achievements by embedding badges on your website or email signature.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example Embed Code:</h4>
                  <code className="text-sm text-blue-600">
                    {'<div class="appex-badge">AppEx Certified User</div>'}
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
