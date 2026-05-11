"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Filter
} from "lucide-react"

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Mock user data - replace with actual API calls
  const users = [
    {
      id: "1",
      fullName: "John Smith",
      email: "john.smith@example.com",
      role: "USER",
      businessType: "RETAIL",
      company: "Smith's Retail Store",
      avatarUrl: "/api/placeholder/40/40",
      emailVerified: true,
      createdAt: "2024-03-15",
      lastLogin: "2024-03-22",
      enrolledCourses: 3,
      completedCourses: 2,
      certificates: 1
    },
    {
      id: "2",
      fullName: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "ADMIN",
      businessType: null,
      company: "AppEx Team",
      avatarUrl: "/api/placeholder/40/40",
      emailVerified: true,
      createdAt: "2024-03-10",
      lastLogin: "2024-03-23",
      enrolledCourses: 8,
      completedCourses: 6,
      certificates: 3
    },
    {
      id: "3",
      fullName: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "INSTRUCTOR",
      businessType: "RESTAURANT",
      company: "Mike's Restaurant",
      avatarUrl: "/api/placeholder/40/40",
      emailVerified: true,
      createdAt: "2024-03-18",
      lastLogin: "2024-03-21",
      enrolledCourses: 5,
      completedCourses: 4,
      certificates: 2
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700"
      case "INSTRUCTOR":
        return "bg-purple-100 text-purple-700"
      case "AFFILIATE":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin"
      case "INSTRUCTOR":
        return "Instructor"
      case "AFFILIATE":
        return "Affiliate"
      default:
        return "User"
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
              <option value="INSTRUCTOR">Instructors</option>
              <option value="AFFILIATE">Affiliates</option>
            </select>
          </div>
        </div>
        
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => {
                    const lastLogin = new Date(u.lastLogin)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return lastLogin > weekAgo
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Active This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, u) => sum + u.enrolledCourses, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, u) => sum + u.certificates, 0)}
                </p>
                <p className="text-sm text-gray-600">Certificates Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">User</th>
                  <th className="text-left p-4 font-medium text-gray-900">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900">Business</th>
                  <th className="text-left p-4 font-medium text-gray-900">Activity</th>
                  <th className="text-left p-4 font-medium text-gray-900">Progress</th>
                  <th className="text-left p-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                            {user.emailVerified && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {user.businessType ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.company}</p>
                          <Badge variant="outline" className="text-xs">
                            {user.businessType}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">Last: {new Date(user.lastLogin).toLocaleDateString()}</div>
                        <div className="text-gray-500">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <BookOpen className="h-3 w-3 text-gray-500" />
                          <span>{user.enrolledCourses} enrolled</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Award className="h-3 w-3 text-gray-500" />
                          <span>{user.certificates} certificates</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
