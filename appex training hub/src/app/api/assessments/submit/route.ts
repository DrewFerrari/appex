import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { courseId, moduleId, score, total, percentage, passed, answers } = body

    // Create assessment result
    const result = await prisma.assessmentResult.create({
      data: {
        userId,
        assessmentId: `${courseId}-${moduleId || 'course'}`,
        score,
        totalQuestions: total,
        percentage,
        passed,
        answers,
        startedAt: new Date(),
        completedAt: new Date()
      }
    })

    // If passed, update course enrollment and potentially generate certificate
    if (passed) {
      // Mark course as completed
      await prisma.courseEnrollment.updateMany({
        where: {
          userId,
          courseId
        },
        data: {
          completedAt: new Date()
        }
      })

      // Generate certificate
      const certificateNumber = `APPX-CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      const verificationId = crypto.randomUUID()
      
      // Get course details for certificate
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, durationMinutes: true }
      })

      if (course) {
        const learningOutcomes = getLearningOutcomes(courseId)
        
        const certificate = await prisma.certificate.create({
          data: {
            userId,
            courseId,
            assessmentId: `${courseId}-${moduleId || 'course'}`,
            certificateNumber,
            verificationId,
            recipientName: "User Name", // Would get from user profile
            courseTitle: course.title,
            issueDate: new Date(),
            learningOutcomes: JSON.stringify(learningOutcomes),
            studentId: `APPX-STU-${Math.floor(Math.random() * 10000)}`,
            durationHours: Math.ceil((course.durationMinutes || 0) / 60),
            verificationUrl: `https://appex.co.zw/verify/${verificationId}`
          }
        })

        return NextResponse.json({
          success: true,
          result,
          certificate: {
            id: certificate.id,
            certificateNumber,
            verificationId,
            verificationUrl: `https://appex.co.zw/verify/${verificationId}`
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error("Error submitting assessment:", error)
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    )
  }
}

function getLearningOutcomes(courseId: string): string[] {
  const outcomes: Record<string, string[]> = {
    "retail-management": [
      "Master complete retail POS operations and checkout process",
      "Implement effective inventory management and stock control strategies",
      "Utilize customer management and loyalty program features",
      "Generate and interpret comprehensive sales and inventory reports",
      "Configure system settings for optimal retail store performance"
    ],
    "restaurant-management": [
      "Manage tables and floor plans efficiently using visual layout",
      "Operate Kitchen Display System for streamlined order management",
      "Process complex bills including splits, courses, and special requests",
      "Handle reservations, takeaway, and delivery orders seamlessly",
      "Configure menu items with modifiers and pricing strategies"
    ],
    "hardware-management": [
      "Track high-value inventory using serial number management",
      "Manage contractor accounts with credit limits and special pricing",
      "Process special orders and track customer purchases",
      "Handle warranty claims and service history tracking",
      "Generate contractor statements and aging reports"
    ],
    "pharmacy-management": [
      "Manage prescriptions and controlled substance dispensing",
      "Maintain patient medication histories and clinical records",
      "Ensure compliance with MCAZ and ZIMRA regulatory requirements",
      "Process medical aid claims and insurance billing",
      "Monitor cold chain and expiry dates for medication safety"
    ],
    "grocery-management": [
      "Master perishable goods tracking with expiry date management and FEFO principles",
      "Implement effective bulk pricing strategies for wholesale and retail customers",
      "Manage supplier relationships and purchase orders efficiently",
      "Utilize waste tracking to reduce shrinkage and improve profitability",
      "Configure multi-store inventory synchronization for chain operations"
    ],
    "butchery-management": [
      "Perform meat processing batch management from whole carcass to individual cuts",
      "Calculate and optimize yield percentages to maximize profitability",
      "Implement freshness tracking with expiry date management (FEFO)",
      "Monitor cold chain temperatures and handle breach incidents",
      "Manage contractor accounts for bulk meat purchases",
      "Process custom cuts and special orders efficiently"
    ]
  }

  return outcomes[courseId] || [
    "Demonstrate comprehensive understanding of AppEx system",
    "Apply best practices for daily business operations",
    "Troubleshoot common issues and optimize performance",
    "Utilize reporting features for data-driven decisions",
    "Configure settings to match specific business needs"
  ]
}
