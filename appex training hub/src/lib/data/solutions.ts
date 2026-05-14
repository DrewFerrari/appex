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
    totalModules: 6,
    totalDuration: "12 hours",
    certificateName: "AppEx Retail Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Retail Navigation",
      "Optimize Product Management",
      "Streamline POS Operations",
      "Enhance Customer Relationships",
      "Utilize Business Intelligence",
      "Improve Supplier Management"
    ],
    modules: [
      {
        id: "retail-1",
        title: "AppEx Retail System Overview & Dashboard Navigation",
        description: "12 Slides. System introduction, dashboard layout, and main menu structure.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 100,
        isCompleted: true,
        isLocked: false,
        topics: [
          "AppEx Retail Management System Training",
          "System Introduction & Benefits",
          "Dashboard Layout & Navigation",
          "User Interface Overview",
          "Quick Access Features",
          "Personalization Options",
          "Key Performance Indicators",
          "Main Menu Structure",
          "Search & Filter Functions",
          "Notification Systems",
          "Mobile Access Features"
        ]
      },
      {
        id: "retail-2",
        title: "Product Management & Inventory Control in AppEx",
        description: "15 Slides. Catalog management, pricing strategies, and stock tracking.",
        duration: "2 hours",
        difficulty: "Beginner",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Product Catalog Overview",
          "Adding New Products",
          "Product Information Management",
          "Pricing Strategies & Setup",
          "Inventory Level Monitoring",
          "Stock Movement Tracking",
          "Automated Reordering",
          "Product Categories & Attributes",
          "Barcode/QR Code Integration",
          "Multi-Location Inventory",
          "Low Stock Alerts",
          "Product Variants Management"
        ]
      },
      {
        id: "retail-3",
        title: "Point of Sale (POS) Operations & Transaction Processing",
        description: "18 Slides. Sales processing, payments, returns, and daily reconciliation.",
        duration: "2.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "POS Terminal Overview",
          "Sales Transaction Process",
          "Payment Processing Methods",
          "Customer Data Capture",
          "Return & Exchange Management",
          "Daily Cash Reconciliation",
          "Discount & Promotion Application",
          "Receipt Management",
          "End-of-Day Processing",
          "Staff Permissions & Access",
          "Offline Mode Operations",
          "Hardware Setup & Troubleshooting"
        ]
      },
      {
        id: "retail-4",
        title: "Customer Management & Sales Analytics in AppEx",
        description: "14 Slides. Database management, loyalty programs, and behavior analysis.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Customer Database Overview",
          "Customer Registration Process",
          "Purchase History Tracking",
          "Loyalty Program Management",
          "Customer Segmentation",
          "Communication Tools",
          "Sales Analytics Dashboard",
          "Customer Behavior Analysis",
          "Targeted Marketing Campaigns",
          "Customer Service Integration",
          "Feedback Collection",
          "Data Privacy Compliance"
        ]
      },
      {
        id: "retail-5",
        title: "Reporting & Business Intelligence in Retail System",
        description: "16 Slides. Report generation, trend analysis, and custom report building.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Report Generation Overview",
          "Sales Reports & Analysis",
          "Inventory Reports",
          "Profit & Loss Statements",
          "Performance Dashboards",
          "Trend Analysis",
          "Forecasting Tools",
          "Custom Report Builder",
          "Data Export Functions",
          "Scheduled Reports",
          "KPI Monitoring",
          "Benchmarking Tools"
        ]
      },
      {
        id: "retail-6",
        title: "Supplier Management & Purchase Orders in AppEx",
        description: "12 Slides. Vendor relationships, procurement workflows, and delivery tracking.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Supplier Database Management",
          "Purchase Order Creation",
          "Vendor Relationship Management",
          "Procurement Workflows",
          "Price Negotiation Tools",
          "Delivery Tracking",
          "Quality Control Integration",
          "Invoice Processing",
          "Payment Terms Management",
          "Supplier Performance Analysis",
          "Automated Procurement"
        ]
      }
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
    totalModules: 6,
    totalDuration: "10 hours",
    certificateName: "AppEx Restaurant Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Restaurant Navigation",
      "Optimize Menu Management",
      "Streamline Order Processing",
      "Enhance Table Management",
      "Utilize Financial Analytics",
      "Control Food Costs"
    ],
    modules: [
      {
        id: "rest-1",
        title: "AppEx Restaurant System Dashboard & Navigation",
        description: "12 Slides. System introduction, navigation, and mobile access.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "System Introduction & Benefits",
          "Dashboard Layout Overview",
          "Main Navigation Areas",
          "Quick Access Features",
          "User Interface Walkthrough",
          "Real-time Data Display",
          "Alert & Notification System",
          "Mobile Access Features",
          "Multi-Location Management",
          "Role-Based Access Control"
        ]
      },
      {
        id: "rest-2",
        title: "Menu Management & Recipe Costing in AppEx",
        description: "15 Slides. Menu creation, ingredient costing, and pricing strategies.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Menu Creation & Management",
          "Recipe Development Tools",
          "Ingredient Cost Calculation",
          "Menu Pricing Strategies",
          "Nutritional Information Management",
          "Menu Engineering Principles",
          "Seasonal Menu Updates",
          "Promotion Menu Setup",
          "Allergen Management",
          "Menu Performance Analysis"
        ]
      },
      {
        id: "rest-3",
        title: "Order Processing & Kitchen Operations System",
        description: "18 Slides. KDS interface, workflow management, and delivery coordination.",
        duration: "2.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Order Entry Interface",
          "Kitchen Display System (KDS)",
          "Order Status Tracking",
          "Kitchen Workflow Management",
          "Order Modification Process",
          "Rush Hour Management",
          "Online Order Integration",
          "Delivery Coordination",
          "Order Accuracy Controls",
          "Kitchen Efficiency Tools",
          "Staff Communication System"
        ]
      },
      {
        id: "rest-4",
        title: "Table Management & Customer Service in AppEx",
        description: "14 Slides. Table layouts, reservations, and service optimization.",
        duration: "2 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Table Layout Management",
          "Reservation System Overview",
          "Waitstaff Assignment Tools",
          "Table Turnover Optimization",
          "Customer Seating Strategies",
          "Guest Management Features",
          "Waitlist Management",
          "Table Status Tracking",
          "Customer Preferences",
          "Service Quality Metrics"
        ]
      },
      {
        id: "rest-5",
        title: "Financial Reporting & Restaurant Analytics",
        description: "16 Slides. Revenue analysis, cost control, and P&L statements.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Sales Report Generation",
          "Revenue Analysis Tools",
          "Cost Control Dashboards",
          "Profit & Loss Statements",
          "Menu Performance Analytics",
          "Labor Cost Analysis",
          "Food Cost Percentage Tracking",
          "Prime Cost Calculations",
          "Daily Sales Summaries",
          "Period Comparison Reports"
        ]
      },
      {
        id: "rest-6",
        title: "Inventory Management & Food Cost Control",
        description: "12 Slides. Perishables tracking, waste reduction, and supplier integration.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Inventory Management Overview",
          "Stock Level Monitoring",
          "Perishable Goods Tracking",
          "Waste Reduction Tools",
          "Supplier Integration",
          "Purchase Order Automation",
          "Recipe Cost Integration",
          "Inventory Valuation Methods",
          "Stock Movement Tracking",
          "Expiry Date Management"
        ]
      }
    ],
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
    totalModules: 6,
    totalDuration: "11 hours",
    certificateName: "AppEx Hardware Store Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Hardware Navigation",
      "Optimize Product Catalog",
      "Streamline Procurement",
      "Enhance Inventory Control",
      "Utilize Analytics",
      "Manage Special Projects"
    ],
    modules: [
      {
        id: "hard-1",
        title: "AppEx Hardware System Overview & Interface",
        description: "12 Slides. Navigation, industry focus, and role-based access.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "System Introduction & Benefits",
          "Dashboard Layout Overview",
          "Main Navigation Areas",
          "Hardware Industry Focus",
          "User Interface Walkthrough",
          "Quick Access Features",
          "Real-time Data Display",
          "Alert & Notification System",
          "Mobile Access Features",
          "Multi-Store Management"
        ]
      },
      {
        id: "hard-2",
        title: "Product Catalog Management & SKU Organization",
        description: "15 Slides. SKU implementation, categorization, and barcode integration.",
        duration: "2 hours",
        difficulty: "Beginner",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Product Catalog Creation",
          "SKU System Implementation",
          "Product Categorization",
          "Specification Management",
          "Technical Documentation",
          "Product Image Management",
          "Search & Filter Functions",
          "Cross-Reference Tools",
          "Product Relationship Mapping",
          "Barcode Integration"
        ]
      },
      {
        id: "hard-3",
        title: "Supplier Management & Purchase Orders in AppEx",
        description: "18 Slides. Procurement workflows, vendor management, and tracking.",
        duration: "2.5 hours",
        difficulty: "Intermediate",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Supplier Database Setup",
          "Purchase Order Creation",
          "Vendor Relationship Management",
          "Procurement Workflow",
          "Price Negotiation Tools",
          "Delivery Tracking System",
          "Quality Control Integration",
          "Invoice Processing",
          "Payment Terms Management",
          "Supplier Performance Analysis"
        ]
      },
      {
        id: "hard-4",
        title: "Inventory Tracking & Stock Control System",
        description: "14 Slides. Reorder points, seasonal planning, and valuation.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Inventory Management Overview",
          "Stock Level Monitoring",
          "Reorder Point Automation",
          "Warehouse Management",
          "Stock Movement Tracking",
          "Physical Inventory Counting",
          "Variance Analysis Tools",
          "Location-Based Inventory",
          "Seasonal Inventory Planning",
          "Dead Stock Management"
        ]
      },
      {
        id: "hard-5",
        title: "Hardware Store Analytics & Performance Reporting",
        description: "16 Slides. Category performance, turnover analysis, and margins.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Sales Dashboard Overview",
          "Product Performance Analysis",
          "Category Performance Tracking",
          "Supplier Performance Metrics",
          "Inventory Turnover Analysis",
          "Profit Margin Calculations",
          "Sales Trend Analysis",
          "Customer Purchase Patterns",
          "Seasonal Performance Reports",
          "KPI Monitoring Dashboard"
        ]
      },
      {
        id: "hard-6",
        title: "Special Order Management & Custom Projects",
        description: "12 Slides. Quote generation, project tracking, and estimation.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Special Order Process Overview",
          "Project-Based Sales Management",
          "Custom Product Configuration",
          "Quote Generation Tools",
          "Project Tracking System",
          "Resource Allocation",
          "Timeline Management",
          "Cost Estimation Tools",
          "Customer Communication Portal",
          "Project Documentation"
        ]
      }
    ],
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
    totalModules: 6,
    totalDuration: "11 hours",
    certificateName: "AppEx Grocery Store Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Grocery Navigation",
      "Optimize Freshness Control",
      "Streamline Inventory Rotation",
      "Enhance Department Coordination",
      "Utilize Analytics",
      "Improve Supplier Relations"
    ],
    modules: [
      {
        id: "groc-1",
        title: "AppEx Grocery System Dashboard & Navigation",
        description: "12 Slides. Navigation, alerts, and multi-store management.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "System Introduction & Benefits",
          "Dashboard Layout Overview",
          "Main Navigation Areas",
          "Grocery Industry Focus",
          "User Interface Walkthrough",
          "Quick Access Features",
          "Real-time Data Display",
          "Alert & Notification System",
          "Mobile Access Features",
          "Multi-Store Management"
        ]
      },
      {
        id: "groc-2",
        title: "Fresh Produce Management & Expiry Tracking",
        description: "15 Slides. Quality control, temperature monitoring, and reordering.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Produce Management Overview",
          "Fresh Product Receiving",
          "Quality Control Procedures",
          "Expiry Date Tracking",
          "Temperature Monitoring Systems",
          "Freshness Preservation Methods",
          "Display Management",
          "Waste Reduction Tools",
          "Automated Reordering",
          "Supplier Integration"
        ]
      },
      {
        id: "groc-3",
        title: "Perishable Goods Inventory & Rotation System",
        description: "18 Slides. FIFO/FEFO implementation, stock rotation, and shelf life optimization.",
        duration: "2.5 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Perishable Inventory Overview",
          "FIFO Implementation",
          "Stock Rotation Procedures",
          "Expiry Monitoring Systems",
          "Temperature Control Management",
          "Shelf Life Optimization",
          "Waste Tracking Tools",
          "Automated Disposal Processes",
          "Quality Assurance Integration",
          "Customer Safety Protocols"
        ]
      },
      {
        id: "groc-4",
        title: "Supplier Management & Order Processing in AppEx",
        description: "14 Slides. Order workflows, delivery management, and automated ordering.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Supplier Database Setup",
          "Order Processing Workflows",
          "Delivery Management System",
          "Quality Control Integration",
          "Invoice Processing",
          "Payment Terms Management",
          "Supplier Performance Tracking",
          "Automated Ordering",
          "Contract Management",
          "Price Negotiation Tools"
        ]
      },
      {
        id: "groc-5",
        title: "Grocery Store Analytics & Sales Reporting",
        description: "16 Slides. Category performance, promotion effectiveness, and KPI monitoring.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Sales Dashboard Overview",
          "Category Performance Analysis",
          "Product Movement Tracking",
          "Customer Purchase Patterns",
          "Promotional Effectiveness",
          "Inventory Turnover Analysis",
          "Profit Margin Calculations",
          "Seasonal Performance Reports",
          "KPI Monitoring Dashboard",
          "Custom Report Builder"
        ]
      },
      {
        id: "groc-6",
        title: "Department Management (Deli, Bakery, Produce)",
        description: "12 Slides. Department coordination, scheduling, and profitability.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Department Overview & Coordination",
          "Deli Operations Management",
          "Bakery Production Planning",
          "Produce Department Management",
          "Meat & Seafood Coordination",
          "Dairy & Frozen Foods Management",
          "Department-Specific Inventory",
          "Staff Scheduling by Department",
          "Department Performance Metrics",
          "Cross-Department Collaboration"
        ]
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
    totalModules: 6,
    totalDuration: "15 hours",
    certificateName: "AppEx Pharmacy Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Pharmacy Navigation",
      "Ensure Medication Safety",
      "Protect Patient Privacy",
      "Optimize Inventory Control",
      "Maintain Regulatory Compliance",
      "Streamline Billing Processes"
    ],
    modules: [
      {
        id: "phar-1",
        title: "AppEx Pharmacy System Overview & Navigation",
        description: "12 Slides. Interface walkthrough, navigation, and role-based access.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "System Introduction & Benefits",
          "Dashboard Layout Overview",
          "Main Navigation Areas",
          "Pharmacy Industry Focus",
          "User Interface Walkthrough",
          "Quick Access Features",
          "Real-time Data Display",
          "Alert & Notification System",
          "Mobile Access Features",
          "Multi-Location Management"
        ]
      },
      {
        id: "phar-2",
        title: "Medication Management & Prescription Processing",
        description: "15 Slides. Prescription workflows, interaction checking, and dispensing.",
        duration: "2.5 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Medication Database Overview",
          "Prescription Workflow Management",
          "Drug Information System",
          "Dosage Calculation Tools",
          "Interaction Checking Integration",
          "Automated Dispensing",
          "Refill Management",
          "Controlled Substance Tracking",
          "Inventory Integration",
          "Patient Safety Features"
        ]
      },
      {
        id: "phar-3",
        title: "Patient Records & Care Management in AppEx",
        description: "18 Slides. Medical history, care coordination, and adherence tracking.",
        duration: "3 hours",
        difficulty: "Advanced",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Patient Database Management",
          "Medical History Tracking",
          "Care Coordination Tools",
          "Privacy & Security Features",
          "Communication Systems",
          "Appointment Management",
          "Medication Adherence Tracking",
          "Clinical Decision Support",
          "Allergy Management",
          "Immunization Records"
        ]
      },
      {
        id: "phar-4",
        title: "Inventory Control & Expiry Date Tracking",
        description: "14 Slides. Cold chain storage, recall management, and reordering.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Pharmacy Inventory Overview",
          "Expiry Date Monitoring",
          "Automated Reordering",
          "Stock Level Optimization",
          "Temperature Controlled Storage",
          "Recall Management Systems",
          "Waste Prevention Tools",
          "Inventory Valuation Methods",
          "Physical Inventory Counting",
          "Variance Analysis"
        ]
      },
      {
        id: "phar-5",
        title: "Pharmacy Compliance & Reporting System",
        description: "16 Slides. HIPAA, safety protocols, and incident management.",
        duration: "2.5 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Regulatory Compliance Overview",
          "HIPAA Privacy Protection",
          "Quality Assurance Procedures",
          "Documentation Standards",
          "Audit Preparation Tools",
          "Safety Protocol Management",
          "Error Reporting Systems",
          "Continuous Compliance Monitoring",
          "Staff Training Records",
          "Incident Management"
        ]
      },
      {
        id: "phar-6",
        title: "Insurance & Billing Management",
        description: "12 Slides. Claim management, eligibility verification, and statements.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Insurance Processing Overview",
          "Claim Management System",
          "Billing Workflow Automation",
          "Payment Processing Integration",
          "Reconciliation Tools",
          "Eligibility Verification",
          "Co-pay Management",
          "Prior Authorization Processing",
          "Statement Generation",
          "Patient Account Management"
        ]
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
    totalModules: 6,
    totalDuration: "10 hours",
    certificateName: "AppEx Butchery Management Certificate",
    passingScore: 80,
    features: [
      "Master AppEx Butchery Navigation",
      "Optimize Product Management",
      "Ensure Quality Standards",
      "Maintain Freshness Control",
      "Implement Food Safety",
      "Maximize Yield Efficiency"
    ],
    modules: [
      {
        id: "butch-1",
        title: "AppEx Butchery System Overview & Interface",
        description: "12 Slides. Interface walkthrough, industry focus, and navigation.",
        duration: "1.5 hours",
        difficulty: "Beginner",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "System Introduction & Benefits",
          "Dashboard Layout Overview",
          "Main Navigation Areas",
          "Butchery Industry Focus",
          "User Interface Walkthrough",
          "Quick Access Features",
          "Real-time Data Display",
          "Alert & Notification System",
          "Mobile Access Features",
          "Multi-Location Management"
        ]
      },
      {
        id: "butch-2",
        title: "Meat Product Management & Cutting Specifications",
        description: "15 Slides. Cutting specs, quality grades, and yield calculation.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Product Catalog Creation",
          "Meat Classification System",
          "Cutting Specification Management",
          "Quality Grade Standards",
          "Product Imaging & Documentation",
          "Pricing Strategy Tools",
          "Yield Calculation Methods",
          "Custom Cut Management",
          "Product Relationship Mapping",
          "Inventory Integration"
        ]
      },
      {
        id: "butch-3",
        title: "Inventory Tracking & Freshness Control System",
        description: "18 Slides. Temperature monitoring, freshness QC, and shelf life optimization.",
        duration: "2.5 hours",
        difficulty: "Intermediate",
        type: "interactive",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Inventory Management Overview",
          "Temperature Monitoring Systems",
          "Freshness Quality Control",
          "Stock Movement Tracking",
          "Expiry Date Management",
          "Physical Inventory Counting",
          "Variance Analysis Tools",
          "Loss Prevention Integration",
          "Automated Reordering",
          "Quality Assurance Procedures"
        ]
      },
      {
        id: "butch-4",
        title: "Supplier Management & Order Processing in AppEx",
        description: "14 Slides. Procurement workflows, quality integration, and traceability.",
        duration: "2 hours",
        difficulty: "Intermediate",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Supplier Database Setup",
          "Order Processing Workflows",
          "Quality Control Integration",
          "Delivery Management System",
          "Invoice Processing",
          "Payment Terms Management",
          "Supplier Performance Tracking",
          "Automated Ordering",
          "Contract Management",
          "Price Negotiation Tools"
        ]
      },
      {
        id: "butch-5",
        title: "Butchery Analytics & Sales Performance Reporting",
        description: "16 Slides. Yield optimization reports, profit margins, and KPI monitoring.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "documentation",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Sales Dashboard Overview",
          "Product Performance Analysis",
          "Category Performance Tracking",
          "Supplier Performance Metrics",
          "Inventory Turnover Analysis",
          "Yield Optimization Reports",
          "Profit Margin Calculations",
          "Sales Trend Analysis",
          "Customer Purchase Patterns",
          "Seasonal Performance Reports"
        ]
      },
      {
        id: "butch-6",
        title: "Food Safety & HACCP Compliance",
        description: "12 Slides. Temperature standards, sanitation, and audit preparation.",
        duration: "2 hours",
        difficulty: "Advanced",
        type: "video",
        progress: 0,
        isCompleted: false,
        isLocked: false,
        topics: [
          "Food Safety Overview",
          "HACCP Implementation Guide",
          "Critical Control Points",
          "Temperature Monitoring Standards",
          "Cross-Contamination Prevention",
          "Personal Hygiene Requirements",
          "Equipment Sanitation Procedures",
          "Quality Assurance Protocols",
          "Documentation Standards",
          "Audit Preparation Tools"
        ]
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
