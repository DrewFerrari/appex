import { MainLayout } from "@/components/layout/main-layout"
import { AdminStats } from "@/components/admin/admin-stats"
import { ContentManagement } from "@/components/admin/content-management"
import { UserManagement } from "@/components/admin/user-management"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  Database,
  TrendingUp,
  BookOpen,
  Award
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage content, users, and monitor platform performance
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <AdminStats />

        {/* Admin Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Platform Settings
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">General Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Maintenance Mode</span>
                        <button className="bg-gray-200 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 left-0.5"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">User Registration</span>
                        <button className="bg-emerald-500 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email Notifications</span>
                        <button className="bg-emerald-500 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Content Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Auto-publish Courses</span>
                        <button className="bg-gray-200 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 left-0.5"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Comments Enabled</span>
                        <button className="bg-emerald-500 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Video Auto-encoding</span>
                        <button className="bg-emerald-500 rounded-full w-12 h-6 relative">
                          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 right-0.5"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Platform Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Database className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Database</h4>
                      <p className="text-sm text-gray-600">PostgreSQL v14.2</p>
                      <p className="text-xs text-gray-500">2.3 GB used</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Analytics</h4>
                      <p className="text-sm text-gray-600">PostHog Connected</p>
                      <p className="text-xs text-gray-500">Real-time tracking</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Search</h4>
                      <p className="text-sm text-gray-600">Meilisearch v0.28</p>
                      <p className="text-xs text-gray-500">1,247 documents</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
