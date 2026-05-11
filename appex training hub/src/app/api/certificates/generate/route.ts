import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  }

  try {
    const body = await req.json()
    const { courseId, recipientName, score, total } = body

    // Fetch course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, durationMinutes: true }
    })
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Generate unique certificate number
    const certificateNumber = `APPX-CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const verificationId = crypto.randomUUID()
    
    // Generate learning outcomes based on course
    const learningOutcomes = getLearningOutcomes(courseId)
    
    // Generate HTML certificate
    const certificateHTML = generateCertificateHTML({
      recipientName,
      courseTitle: course.title,
      certificateNumber,
      verificationId,
      issueDate: new Date().toISOString().split('T')[0],
      learningOutcomes,
      studentId: `APPX-STU-${Math.floor(Math.random() * 10000)}`,
      durationHours: Math.ceil((course.durationMinutes || 0) / 60),
      score: `${score}/${total}` 
    })
    
    // Save to database
    const certificate = await prisma.certificate.create({
      data: {
        userId: req.headers.get("x-user-id") || "demo-user",
        courseId,
        certificateNumber,
        verificationId,
        recipientName,
        courseTitle: course.title,
        certificateHtml: certificateHTML,
        issueDate: new Date(),
        learningOutcomes: JSON.stringify(learningOutcomes),
        studentId: `APPX-STU-${Math.floor(Math.random() * 10000)}`,
        durationHours: Math.ceil((course.durationMinutes || 0) / 60),
        verificationUrl: `https://appex.co.zw/verify/${verificationId}`
      }
    })
    
    // Return certificate data
    return NextResponse.json({
      certificateNumber,
      verificationId,
      verificationUrl: `https://appex.co.zw/verify/${verificationId}`,
      html: certificateHTML
    })
  } catch (error) {
    console.error("Error generating certificate:", error)
    return NextResponse.json(
      { error: "Failed to generate certificate" },
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

function generateCertificateHTML(data: {
  recipientName: string
  courseTitle: string
  certificateNumber: string
  verificationId: string
  issueDate: string
  learningOutcomes: string[]
  studentId: string
  durationHours: number
  score: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AppEx Certificate - ${data.recipientName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #f0f4f8;
            width: 210mm;
            height: 297mm;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .certificate-outer {
            width: 210mm;
            height: 297mm;
            padding: 0;
            background: linear-gradient(45deg, #2b2b7a 0%, #00d2ff 100%);
        }
        .certificate-inner {
            width: 100%;
            height: 100%;
            background: white;
            position: relative;
            padding: 10mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }
        .border-pattern {
            position: absolute;
            top: 10mm;
            left: 10mm;
            right: 10mm;
            bottom: 10mm;
            border: 2px solid #2b2b7a;
        }
        .border-corner {
            position: absolute;
            width: 30mm;
            height: 30mm;
            border: 4mm solid #2b2b7a;
        }
        .corner-tl { top: -2mm; left: -2mm; border-right: none; border-bottom: none; }
        .corner-tr { top: -2mm; right: -2mm; border-left: none; border-bottom: none; }
        .corner-bl { bottom: -2mm; left: -2mm; border-right: none; border-top: none; }
        .corner-br { bottom: -2mm; right: -2mm; border-left: none; border-top: none; }
        .watermark {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.05;
            background-image: url('/appex-logo-light.png');
            background-repeat: repeat;
            background-size: 80mm 80mm;
            transform: rotate(-30deg) scale(1.5);
            filter: grayscale(100%);
        }
        .content { position: relative; z-index: 1; text-align: center; flex: 1; }
        .logo { width: 60mm; margin-bottom: 3mm; }
        .certificate-header { margin-bottom: 5mm; }
        .title-sub { font-size: 12pt; color: #555; font-style: italic; margin-bottom: 5mm; }
        .recipient-name { 
            font-size: 32pt; 
            font-weight: bold; 
            color: #2b2b7a; 
            text-decoration: underline; 
            margin: 3mm 0;
            font-family: 'Georgia', serif;
        }
        .award-text { font-size: 14pt; color: #444; margin-bottom: 2mm; }
        .title-main { 
            font-size: 30pt; 
            font-weight: 800; 
            color: #2b2b7a; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
            margin: 1mm 0;
        }
        .course-title { 
            font-size: 20pt; 
            font-weight: bold; 
            color: #b30000; 
            margin: 2mm 0;
        }
        .course-info-section {
            text-align: left;
            margin: 2mm 5mm;
            padding: 4mm;
            background: rgba(240, 244, 248, 0.5);
            border-radius: 4px;
            flex-grow: 1;
        }
        .section-label { 
            font-weight: 800; 
            color: #2b2b7a; 
            font-size: 10pt; 
            margin-bottom: 1mm; 
            text-transform: uppercase;
        }
        .overview-text { font-size: 9pt; line-height: 1.4; color: #333; margin-bottom: 3mm; }
        .outcomes-list { margin: 0; padding-left: 5mm; font-size: 8.5pt; color: #333; line-height: 1.3; }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2mm;
            margin: 2mm 5mm;
            font-size: 9pt;
            text-align: left;
        }
        .detail-item strong { color: #2b2b7a; }
        .signatures { display: flex; justify-content: space-around; margin-top: 8mm; }
        .sig-box { text-align: center; width: 55mm; position: relative; }
        .handwritten-sig {
            font-family: 'Dancing Script', cursive;
            font-size: 18pt;
            color: #1a1a5a;
            position: absolute;
            bottom: 5mm;
            left: 50%;
            transform: translateX(-50%) rotate(-3deg);
            width: 100%;
            opacity: 0.8;
        }
        .sig-line {
            border-top: 1px solid #555;
            margin-top: 10mm;
            padding-top: 1mm;
            font-size: 9pt;
            font-weight: bold;
            color: #2b2b7a;
        }
        .sig-title { font-size: 7.5pt; color: #666; }
        .footer { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 5mm; }
        .qr-container { text-align: center; font-size: 7pt; color: #2b2b7a; font-weight: bold; }
        .qr-image { width: 25mm; height: 25mm; border: 2px solid #2b2b7a; border-radius: 4px; margin-bottom: 2mm; background: white; padding: 2px; }
        .meta-id { font-size: 7.5pt; color: #888; text-align: right; line-height: 1.2; }
        @media print { body { background: white; } .certificate-outer { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="certificate-outer">
        <div class="certificate-inner">
            <div class="border-pattern">
                <div class="border-corner corner-tl"></div>
                <div class="border-corner corner-tr"></div>
                <div class="border-corner corner-bl"></div>
                <div class="border-corner corner-br"></div>
            </div>
            <div class="watermark"></div>
            <div class="content">
                <img src="/appex-logo-dark.png" alt="AppEx Logo" class="logo">
                <div class="certificate-header">
                    <div class="title-sub">This International Recognition is Proudly Awarded To</div>
                    <div class="recipient-name">${data.recipientName}</div>
                    <div class="award-text">for successful completion of</div>
                    <div class="title-main">Certificate of Completion</div>
                    <div class="course-title">${data.courseTitle}</div>
                </div>
                <div class="course-info-section">
                    <div class="section-label">Course Overview</div>
                    <div class="overview-text">This comprehensive course provides in-depth training on AppEx system, covering all essential features and best practices for optimal business operations.</div>
                    <div class="section-label">Learning Outcomes</div>
                    <ul class="outcomes-list">
                        ${data.learningOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-grid">
                    <div class="detail-item"><strong>Student ID:</strong> ${data.studentId}</div>
                    <div class="detail-item"><strong>Duration:</strong> ${data.durationHours} Hours</div>
                    <div class="detail-item"><strong>Issue Date:</strong> ${data.issueDate}</div>
                    <div class="detail-item"><strong>Assessment Score:</strong> ${data.score} (80%+ Required)</div>
                </div>
                <div class="signatures">
                    <div class="sig-box">
                        <div class="handwritten-sig">K. Kadema</div>
                        <div class="sig-line">ENG Kudakwashe Kadema</div>
                        <div class="sig-title">Director of Training</div>
                    </div>
                    <div class="sig-box">
                        <div class="handwritten-sig">A. Munyanyi</div>
                        <div class="sig-line">ENG Andrew Munyanyi</div>
                        <div class="sig-title">Program Director</div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="qr-container">
                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="qr-image">
                        <rect width="100" height="100" fill="white"/>
                        <path d="M10 10h30v30h-30zM60 10h30v30h-30zM10 60h30v30h-30z" fill="#2b2b7a"/>
                        <path d="M20 20h10v10h-10zm50 0h10v10h-10zm-50 50h10v10h-10z" fill="white"/>
                        <rect x="45" y="45" width="10" height="10" fill="#2b2b7a"/>
                        <text x="50" y="55" font-family="Arial" font-size="6" text-anchor="middle" fill="#2b2b7a" font-weight="bold">appex.co.zw/verify</text>
                    </svg>
                    <div>SCAN TO VERIFY CERTIFICATE</div>
                </div>
                <div class="meta-id">
                    <strong>Certificate No:</strong> ${data.certificateNumber}<br>
                    <strong>Verification ID:</strong> ${data.verificationId}<br>
                    <strong>Verify Online:</strong> https://appex.co.zw/verify/${data.verificationId}<br>
                    <em>Powered by AppEx Digital Certification Engine</em>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
}
