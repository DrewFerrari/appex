"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { DocumentationViewer } from "@/components/docs/documentation-viewer"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock documentation data - replace with actual API call
const getDocumentationBySlug = (slug: string) => {
  const docs = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      slug: "gettingstarted-retail",
      excerpt: "Complete guide to setting up and configuring AppEx Retail Management System for your business.",
      content: `# Getting Started with AppEx Retail

Welcome to AppEx Retail Management System! This comprehensive guide will walk you through everything you need to know to get your retail business up and running with AppEx.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Account Setup](#account-setup)
3. [Initial Configuration](#initial-configuration)
4. [Adding Your First Products](#adding-your-first-products)
5. [Setting Up Payment Methods](#setting-up-payment-methods)
6. [Testing Your Setup](#testing-your-setup)

## System Requirements

Before you begin, ensure your system meets the following requirements:

### Hardware Requirements
- Computer with Windows 10 or later / macOS 10.14 or later
- Minimum 4GB RAM (8GB recommended)
- 2GB available disk space
- Internet connection (broadband recommended)

### Software Requirements
- Latest version of Chrome, Firefox, Safari, or Edge
- Adobe PDF Reader (for reports and documentation)

## Account Setup

### Creating Your Account

1. Visit [appex.co.zw](https://appex.co.zw)
2. Click "Sign Up" in the top right corner
3. Fill in your business information:
   - Business name and address
   - Contact information
   - Business type (Retail)
4. Verify your email address
5. Choose your subscription plan

### Initial Login

Once your account is created:

1. Go to the AppEx login page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your dashboard

## Initial Configuration

### Business Settings

The first time you log in, you'll need to configure your basic business settings:

1. **Navigate to Settings** → **Business Profile**
2. **Fill in business details:**
   - Legal business name
   - Trading name (if different)
   - Business registration number
   - Tax information
3. **Configure store settings:**
   - Store hours
   - Currency (USD/ZWL)
   - Tax rates
   - Receipt settings

### User Management

Add staff members who will use the system:

1. Go to **Settings** → **Users**
2. Click "Add User"
3. Enter user details:
   - Name and email
   - Role (Admin, Manager, Cashier)
   - Permissions
4. Send invitation

### Permission Levels

- **Administrator**: Full system access
- **Manager**: Daily operations access
- **Cashier**: Sales and basic functions
- **Viewer**: Read-only access

## Adding Your First Products

### Product Categories

Before adding products, set up categories:

1. Go to **Inventory** → **Categories**
2. Click "Add Category"
3. Enter category name and description
4. Set parent category if needed
5. Save

### Adding Products

1. Navigate to **Inventory** → **Products**
2. Click "Add Product"
3. Fill in product details:
   - Product name and SKU
   - Description
   - Category
   - Price and cost
   - Stock quantity
   - Barcode (optional)
4. Upload product image
5. Save

### Bulk Import

For multiple products:

1. Prepare CSV file with required columns
2. Go to **Inventory** → **Import**
3. Upload your CSV file
4. Map columns to system fields
5. Review and import

## Setting Up Payment Methods

### Cash Payments

Cash is configured by default. To customize:

1. Go to **Settings** → **Payment Methods**
2. Edit "Cash" settings
3. Set cash drawer requirements
4. Configure change calculations

### Card Payments

For credit/debit cards:

1. Contact your payment provider
2. Obtain API credentials
3. Go to **Settings** → **Payment Methods**
4. Add "Card Payment"
5. Enter provider details
6. Test integration

### Mobile Money

For EcoCash, OneMoney, etc.:

1. Select mobile money provider
2. Enter merchant details
3. Configure transaction fees
4. Test with small amounts

## Testing Your Setup

### Test Transaction

Before going live:

1. Create a test customer
2. Add items to cart
3. Apply discount if applicable
4. Process payment
5. Verify receipt generation
6. Check inventory updates

### Checklist

Before your first day of operation:

- [ ] All products added with correct prices
- [ ] Payment methods tested and working
- [ ] Staff accounts created and trained
- [ ] Receipt printer configured
- [ ] Barcode scanner tested
- [ ] Backup system configured
- [ ] Mobile app installed on devices

## Next Steps

Congratulations! You've successfully set up AppEx Retail. Here's what to do next:

1. **Train Your Staff** - Ensure all users are comfortable with the system
2. **Set Up Backup** - Configure automated backups
3. **Customize Reports** - Set up reports you'll need regularly
4. **Go Live** - Start using the system for real transactions

## Getting Help

If you encounter any issues:

- **Documentation**: Browse our help articles
- **Video Tutorials**: Watch step-by-step guides
- **Support Team**: Contact our 24/7 support
- **Community**: Join our user community

---
*Last updated: March 15, 2024*`,
      category: "getting-started",
      businessType: "Retail",
      tags: ["setup", "configuration", "retail"],
      readTime: 15,
      viewCount: 2341,
      helpfulCount: 156,
      notHelpfulCount: 12,
      author: {
        name: "Sarah Chen",
        avatar: "/logo.png",
        bio: "Retail Management Expert with 10+ years of experience"
      },
      publishedAt: "2024-03-15",
      updatedAt: "2024-03-20",
      toc: [
        { id: "system-requirements", title: "System Requirements" },
        { id: "account-setup", title: "Account Setup" },
        { id: "initial-configuration", title: "Initial Configuration" },
        { id: "adding-your-first-products", title: "Adding Your First Products" },
        { id: "setting-up-payment-methods", title: "Setting Up Payment Methods" },
        { id: "testing-your-setup", title: "Testing Your Setup" }
      ],
      related: [
        {
          id: "2",
          title: "POS Operations Guide",
          slug: "pos-operations",
          excerpt: "Learn how to process sales, handle payments, and manage daily POS operations efficiently."
        },
        {
          id: "3",
          title: "Inventory Management Best Practices",
          slug: "inventory-best-practices",
          excerpt: "Master inventory control, stock tracking, and automated reordering for optimal efficiency."
        }
      ]
    }
  ]
  
  return docs.find(doc => doc.slug === slug)
}

import DocumentationPage from "../page"

export default async function DocumentationSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const tabNames = ["guides", "reference", "faq", "troubleshooting"]
  
  if (tabNames.includes(resolvedParams.slug)) {
    return <DocumentationPage />
  }

  const doc = getDocumentationBySlug(resolvedParams.slug)
  
  if (!doc) {
    notFound()
  }

  const handleHelpful = (helpful: boolean) => {
    console.log("Article was helpful:", helpful)
    // TODO: Call API to track helpful vote
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <DocumentationViewer 
          article={doc}
          onHelpful={handleHelpful}
        />
      </div>
    </MainLayout>
  )
}
