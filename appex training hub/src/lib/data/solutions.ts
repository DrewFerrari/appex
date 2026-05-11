import { Store, Utensils, Wrench, ShoppingCart, Pill, Beef } from "lucide-react"

export interface TrainingModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "video" | "interactive" | "documentation"
  progress: number
  isCompleted: boolean
  isLocked: boolean
  topics: string[]
}

export interface BusinessSolution {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  totalModules: number
  totalDuration: string
  certificateName: string
  passingScore: number
  features: string[]
  modules: TrainingModule[]
  stats: {
    businessesServed: number
    averageRating: number
    trainingHours: number
    successRate: number
  }
  testimonials: {
    id: string
    name: string
    role: string
    company: string
    content: string
    rating: number
    avatar: string
  }[]
}

export const solutionsData: BusinessSolution[] = [
  {
    id: "retail-management",
    name: "Retail Management",
    description: "Comprehensive training for retail owners and staff. Increase sales by 20-30% and reduce waste by 40%.",
    icon: Store,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    totalModules: 23,
    totalDuration: "12 hours",
    certificateName: "AppEx Retail Management Certificate",
    passingScore: 80,
    features: [
      "Getting Started (5 modules)",
      "POS Operations (4 modules)",
      "Inventory Management (4 modules)",
      "Customer Management (3 modules)",
      "Reporting and Analytics (3 modules)",
      "Advanced Features (4 modules)"
    ],
    modules: [
      {
        id: "retail-1",
        title: "Getting Started",
        description: "Account setup, hardware configuration, and basic navigation",
        duration: "5 modules",
        difficulty: "Beginner",
        type: "video",
        progress: 100,
        isCompleted: true,
        isLocked: false,
        topics: ["Account Setup", "Hardware Config", "Basic Navigation", "User Roles", "Store Settings"]
      },
      // ... adding more as per user's detailed list
    ],
    stats: {
      businessesServed: 2847,
      averageRating: 4.8,
      trainingHours: 45,
      successRate: 94
    },
    testimonials: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Store Manager",
        company: "TechMart Retail",
        content: "AppEx Retail transformed our operations. Inventory accuracy improved by 40% and sales increased by 25%.",
        rating: 5,
        avatar: "/avatars/sarah.jpg"
      }
    ]
  },
  {
    id: "restaurant-management",
    name: "Restaurant Management",
    description: "Tailored for restaurants, cafes, fast food, and cloud kitchens. Master the KDS and workflow optimization.",
    icon: Utensils,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    totalModules: 20,
    totalDuration: "10 hours",
    certificateName: "AppEx Restaurant Management Certificate",
    passingScore: 80,
    features: [
      "Getting Started (5 modules)",
      "Front of House (4 modules)",
      "Kitchen Display System (3 modules)",
      "Menu Management (3 modules)",
      "Reservations (2 modules)",
      "Advanced Features (4 modules)"
    ],
    modules: [], // placeholders
    stats: {
      businessesServed: 1653,
      averageRating: 4.7,
      trainingHours: 40,
      successRate: 91
    },
    testimonials: []
  },
  {
    id: "hardware-store",
    name: "Hardware Store",
    description: "Built for hardware stores and suppliers. Specialized in serial number tracking and contractor management.",
    icon: Wrench,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    totalModules: 21,
    totalDuration: "11 hours",
    certificateName: "AppEx Hardware Store Management Certificate",
    passingScore: 80,
    features: [
      "Getting Started (5 modules)",
      "POS and Sales (4 modules)",
      "Serial Number Tracking (3 modules)",
      "Contractor Management (3 modules)",
      "Special Orders (2 modules)",
      "Advanced Features (4 modules)"
    ],
    modules: [],
    stats: {
      businessesServed: 892,
      averageRating: 4.6,
      trainingHours: 35,
      successRate: 89
    },
    testimonials: []
  },
  {
    id: "grocery-store",
    name: "Grocery Store",
    description: "Specialized for grocery stores, supermarkets, and wholesalers. Master perishable management (FEFO) and bulk pricing strategies.",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    totalModules: 21,
    totalDuration: "11 hours",
    certificateName: "AppEx Grocery Store Management Certificate",
    passingScore: 80,
    features: [
      "Perishable Management (FEFO)",
      "Bulk Pricing Strategies",
      "Waste Tracking & Reduction",
      "Supplier Performance",
      "Quantity Discounts",
      "Inventory Receiving"
    ],
    modules: [
      {
        id: "grocery-1",
        title: "Grocery POS Operations",
        description: "Handle high-volume transactions and bulk pricing",
        duration: "2.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 100,
        isCompleted: true,
        isLocked: false,
        topics: ["High-Volume POS", "Scale Integration", "Produce Coding", "Bulk Pricing"]
      },
      {
        id: "grocery-2",
        title: "Perishable Inventory & FEFO",
        description: "Expiry tracking, auto-markdowns, and FEFO (First Expiry First Out)",
        duration: "3 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 45,
        isCompleted: false,
        isLocked: false,
        topics: ["Expiry Tracking", "Auto-Markdowns", "FEFO Strategy", "Freshness"]
      }
    ],
    stats: {
      businessesServed: 1234,
      averageRating: 4.7,
      trainingHours: 38,
      successRate: 92
    },
    testimonials: []
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Regulatory compliance for pharmacies. Master MCAZ reporting, prescription management, and cold chain monitoring.",
    icon: Pill,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    totalModules: 20,
    totalDuration: "15 hours",
    certificateName: "AppEx Pharmacy Management Certificate",
    passingScore: 80,
    features: [
      "Prescription Management (4 modules)",
      "Compliance (MCAZ Reporting)",
      "Cold Chain Monitoring",
      "Patient Safety Alerts",
      "Drug Interaction Checks",
      "Insurance Claim Processing"
    ],
    modules: [
      {
        id: "pharm-1",
        title: "Getting Started",
        description: "License configuration, regulatory settings, and user roles",
        duration: "5 modules",
        difficulty: "Beginner",
        type: "video",
        progress: 60,
        isCompleted: false,
        isLocked: false,
        topics: ["License Config", "Regulatory Settings", "User Roles", "Security"]
      },
      {
        id: "pharm-2",
        title: "Prescription Management",
        description: "Entry, dispensing workflows, refills, and history",
        duration: "4 modules",
        difficulty: "Advanced",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: ["Prescription Entry", "Dispensing Workflow", "Refill Processing", "History"]
      }
    ],
    stats: {
      businessesServed: 567,
      averageRating: 4.8,
      trainingHours: 50,
      successRate: 96
    },
    testimonials: []
  },
  {
    id: "butchery",
    name: "Butchery",
    description: "Meat processing and yield calculation. Master carcass breakdown, freshness tracking, and weight-based pricing.",
    icon: Beef,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    totalModules: 21,
    totalDuration: "10 hours",
    certificateName: "AppEx Butchery Management Certificate",
    passingScore: 80,
    features: [
      "Carcass Breakdown (3 modules)",
      "Yield Calculation",
      "Weight-Based Pricing",
      "Cold Chain Integration",
      "FEFO Freshness tracking",
      "Quality Inspection Logging"
    ],
    modules: [
      {
        id: "butch-1",
        title: "Getting Started",
        description: "Butchery-specific setup, scale config, and cut definition",
        duration: "5 modules",
        difficulty: "Beginner",
        type: "video",
        progress: 90,
        isCompleted: false,
        isLocked: false,
        topics: ["Setup", "Scale Config", "Cut Definition", "Taxation"]
      },
      {
        id: "butch-2",
        title: "Meat Processing & Yield",
        description: "Carcass breakdown, yield calculation, and batch management",
        duration: "3 modules",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 20,
        isCompleted: false,
        isLocked: false,
        topics: ["Carcass Breakdown", "Yield Calculation", "Batch Management"]
      }
    ],
    stats: {
      businessesServed: 234,
      averageRating: 4.9,
      trainingHours: 32,
      successRate: 94
    },
    testimonials: []
  }
]
