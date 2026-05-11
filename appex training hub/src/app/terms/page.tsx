"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Shield, Users, CreditCard, BookOpen, Award } from "lucide-react"

const currentDate = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})

const sections = [
  {
    id: "introduction",
    title: "1. Introduction and Acceptance",
    icon: <FileText className="h-5 w-5" />,
    content: [
      {
        subtitle: "1.1 Welcome to AppEx",
        text: "These Terms of Service (\"Terms\") govern your access to and use of the AppEx platform, including but not limited to the AppEx POS system, customer portal, affiliate portal, training hub, mobile applications, websites, and all related services (collectively, the \"Service\" or \"AppEx\"). AppEx is operated by AppEx Technologies (Private) Limited, a company registered in Zimbabwe, with its registered office in Harare, Zimbabwe (\"AppEx,\" \"we,\" \"us,\" or \"our\")."
      },
      {
        subtitle: "1.2 Acceptance of Terms",
        text: "By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any additional terms incorporated by reference. If you do not agree to these Terms, you may not access or use the Service."
      },
      {
        subtitle: "1.3 Eligibility",
        text: "To use the Service, you must be at least 18 years of age or the age of majority in your jurisdiction, have the legal capacity to enter into a binding agreement, provide accurate, current, and complete information during registration, and not be prohibited from using the Service under applicable laws."
      }
    ]
  },
  {
    id: "definitions",
    title: "2. Definitions",
    icon: <Shield className="h-5 w-5" />,
    content: [
      {
        subtitle: "Key Terms",
        text: "Definitions include: \"Affiliate\" - An individual or entity registered in the AppEx Affiliate Program; \"Business Data\" - All information uploaded, stored, or processed by you through the Service; \"Certificate\" - A digital document issued by AppEx confirming successful completion of a training course; \"Learning Materials\" - All courses, videos, documents, quizzes, and training content provided through the Training Hub; \"Service\" - The entire AppEx platform including POS, affiliate portal, training hub, and all related services."
      }
    ]
  },
  {
    id: "account",
    title: "3. Account Registration and Security",
    icon: <Users className="h-5 w-5" />,
    content: [
      {
        subtitle: "3.1 Account Creation",
        text: "To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information, maintain and promptly update your information, keep your password secure and confidential, and not share your account credentials with unauthorized persons."
      },
      {
        subtitle: "3.2 Account Types",
        text: "Available account types include: Trial Account (14-day free trial), Business Account (paid subscription for businesses), Affiliate Account (commission-based referral account), Trainer Account (for certified trainers), and Enterprise Account (custom solution for large businesses)."
      },
      {
        subtitle: "3.3 Account Security",
        text: "You are responsible for all activities that occur under your account, notifying us immediately of any unauthorized access, using strong passwords and two-factor authentication where available, and logging out after each session, especially on shared devices."
      }
    ]
  },
  {
    id: "services",
    title: "4. Services Overview",
    icon: <BookOpen className="h-5 w-5" />,
    content: [
      {
        subtitle: "4.1 AppEx POS System",
        text: "The AppEx POS system provides businesses with point-of-sale transaction processing, inventory management and tracking, customer relationship management (CRM), employee and staff management, sales reporting and analytics, multi-currency support (USD, ZWL, ZAR), and offline mode for load shedding resilience."
      },
      {
        subtitle: "4.2 Industry Solutions",
        text: "AppEx offers specialized solutions for: Retail stores, Restaurants and cafes, Hardware stores, Grocery stores, Pharmacies, and Butcheries."
      },
      {
        subtitle: "4.3 Training Hub",
        text: "The training platform provides self-paced video courses, interactive quizzes and assessments, downloadable resources and guides, certification upon course completion, and live webinars and workshops."
      }
    ]
  },
  {
    id: "payments",
    title: "6. Payments, Subscriptions, and Fees",
    icon: <CreditCard className="h-5 w-5" />,
    content: [
      {
        subtitle: "6.1 Pricing Plans",
        text: "Starter: $9/month (Basic POS, 100 products, 1 user), Business: $29/month (Advanced features, 3 users, inventory), Enterprise: $99/month (Unlimited everything, API access), Affiliate: Free (Commission-based earnings)."
      },
      {
        subtitle: "6.2 Payment Methods",
        text: "We accept EcoCash (ZWL and USD wallets), OneMoney, ZimSwitch (card payments), Bank transfer (CBZ, Stanbic, NMB, FBC, ZB Bank), and PayPal (international customers)."
      },
      {
        subtitle: "6.3 Currency and Exchange Rates",
        text: "All prices are displayed in USD and ZWL. Exchange rates are updated daily based on RBZ rates. You will be charged in your selected currency. Exchange rate differences are your responsibility."
      }
    ]
  },
  {
    id: "training",
    title: "10. Training and Certification Terms",
    icon: <Award className="h-5 w-5" />,
    content: [
      {
        subtitle: "10.1 Course Access",
        text: "Courses are accessed through the Training Hub with lifetime access to purchased/completed courses. Progress is saved automatically and courses may be updated with new content."
      },
      {
        subtitle: "10.2 Certification Requirements",
        text: "To earn a certificate, you must complete all course modules, pass the final assessment with at least 80%, complete any practical assignments, and agree to the certification terms."
      },
      {
        subtitle: "10.3 Certificate Validity",
        text: "Certificates are valid for 2 years from issue date. Recertification may be required for major updates. Certificates can be verified online and fraudulent certificates will be revoked."
      }
    ]
  }
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/auth/signup">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                AppEx Terms of Service
              </CardTitle>
              <p className="text-gray-600">
                Complete Legal Document
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Effective Date: {currentDate}</p>
                <p>Last Updated: {currentDate}</p>
                <p>Version: 2.0</p>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {section.icon}
                  <span className="text-sm">{section.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} id={section.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.content.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{item.subtitle}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Sections */}
        <div className="mt-12 space-y-8">
          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our Privacy Policy explains how we collect, use, and protect your personal information. 
                By using the Service, you consent to our privacy practices.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Data Collection</h4>
                <p className="text-gray-600">
                  We collect account information, transaction data, usage data, and payment information 
                  (processed securely by third parties).
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Data Protection (Zimbabwe)</h4>
                <p className="text-gray-600">
                  We comply with the Zimbabwe Data Protection Act by obtaining consent before collecting 
                  personal data, limiting data collection to what is necessary, implementing security measures, 
                  and allowing you to access and correct your data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">12. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <p className="text-yellow-800">
                  THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND. 
                  APPEX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Cap on Liability</h4>
                <p className="text-gray-600">
                  APPEX'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO APPEX IN THE 12 MONTHS 
                  PRECEDING THE CLAIM, OR $500 USD (OR ZWL EQUIVALENT), WHICHEVER IS LESS.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">16. Governing Law and Dispute Resolution (Zimbabwe)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                These Terms and any dispute arising from them shall be governed by and construed in accordance 
                with the laws of Zimbabwe.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Dispute Resolution Process</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>Informal Resolution - Contact us at legal@appex.co.zw</li>
                  <li>Mediation - Through the Commercial Mediation Centre of Zimbabwe</li>
                  <li>Arbitration - In accordance with the Arbitration Act of Zimbabwe</li>
                  <li>Court - High Court of Zimbabwe for urgent matters</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-xl">19. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Legal Notices</h4>
                <p className="text-gray-600">
                  AppEx Technologies (Private) Limited<br />
                  Registered Office: Harare, Zimbabwe<br />
                  Email: legal@appex.co.zw<br />
                  Phone: +263 242 123456
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Support Inquiries</h4>
                <p className="text-gray-600">
                  Email: support@appex.co.zw<br />
                  WhatsApp: +263 77 123 4567
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Regulatory Authorities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">ZIMRA (Tax)</p>
                  <p className="text-sm">www.zimra.co.zw</p>
                </div>
                <div>
                  <p className="font-medium">Potraz (Communications)</p>
                  <p className="text-sm">www.potraz.gov.zw</p>
                </div>
                <div>
                  <p className="font-medium">Consumer Protection Commission</p>
                  <p className="text-sm">www.consumercommission.co.zw</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="mt-8 bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-bold text-emerald-900 mb-2">ACKNOWLEDGMENT</h3>
              <p className="text-emerald-800">
                BY CREATING AN ACCOUNT, ACCESSING, OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, 
                UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Version History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Version 2.0</span>
                <span className="text-gray-600">{currentDate} - Added affiliate, training, and certification terms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Version 1.0</span>
                <span className="text-gray-600">Initial release</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Back to Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
