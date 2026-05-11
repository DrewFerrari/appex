"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Database, Eye, Lock, UserCheck, Globe, Cookie, Users, FileText } from "lucide-react"

const currentDate = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})

const sections = [
  {
    id: "introduction",
    title: "1. Introduction and Scope",
    icon: <Shield className="h-5 w-5" />,
    content: [
      {
        subtitle: "1.1 Welcome to AppEx",
        text: "AppEx Technologies (Private) Limited respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AppEx POS System, Customer Portal, Affiliate Portal, Training Hub, Mobile Applications, Websites, and any other services that link to this Privacy Policy."
      },
      {
        subtitle: "1.2 Scope of This Policy",
        text: "This Privacy Policy applies to all users of the AppEx platform, including business owners, store managers, cashiers, staff members, affiliates, training course participants, website visitors, and job applicants."
      },
      {
        subtitle: "1.3 Zimbabwe Data Protection Act Compliance",
        text: "This Privacy Policy complies with the Zimbabwe Data Protection Act [Chapter 11:12] and reflects the principles of data protection established under Zimbabwean law."
      }
    ]
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    icon: <Database className="h-5 w-5" />,
    content: [
      {
        subtitle: "2.1 Categories of Personal Information",
        text: "We collect various categories of personal information including: Identity Data (names, ID numbers), Contact Data (email, phone, address), Business Data (business registration, tax info), Financial Data (payment details), Transaction Data (sales, inventory), Technical Data (IP, device info), Usage Data (login history, features used), Location Data (geographic info), Communications Data (support tickets, emails), and Training Data (course progress, certificates)."
      },
      {
        subtitle: "2.2 Special Categories of Data",
        text: "For certain business types, we may collect sensitive data: Pharmacies - patient medical information and prescriptions; Butcheries - quality control records and temperature logs; All Businesses - optional staff biometric data for attendance tracking."
      },
      {
        subtitle: "2.3 Information Collection Methods",
        text: "We collect information through direct collection (registration forms), automated collection (cookies, log files), third-party collection (payment processors), public sources (business registries), and user content (community forums, reviews)."
      }
    ]
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Information",
    icon: <Eye className="h-5 w-5" />,
    content: [
      {
        subtitle: "4.1 Purposes of Processing",
        text: "We use your information for: Providing the Service (contract performance), Processing Payments (contract performance), Verifying Identity (legal obligation), Improving Our Service (legitimate interest), Communicating with You (contract performance/consent), Ensuring Security (legal obligation/legitimate interest), Complying with Laws (legal obligation), Marketing (with consent), Training and Certification (contract performance), Affiliate Payments (contract performance)."
      },
      {
        subtitle: "4.2 Specific Use Cases",
        text: "POS Service: Process transactions, track inventory, manage customer information. Customer Support: Respond to inquiries, troubleshoot issues. Affiliate Program: Track referrals, calculate commissions. Training Hub: Track progress, issue certificates, provide recommendations. Marketing: Send promotional emails (with consent), notify about features."
      }
    ]
  },
  {
    id: "legal-basis",
    title: "5. Legal Basis for Processing (Zimbabwe & GDPR)",
    icon: <FileText className="h-5 w-5" />,
    content: [
      {
        subtitle: "5.1 Legal Bases Under Zimbabwe Data Protection Act",
        text: "We process personal data based on: Consent (clear consent from you), Contract (necessary for our agreement), Legal Obligation (required by law), Legitimate Interest (our business interests), Vital Interest (protecting life), Public Task (official functions)."
      },
      {
        subtitle: "5.2 Consent Withdrawal",
        text: "You have the right to withdraw your consent at any time by updating privacy settings, clicking unsubscribe in emails, or contacting our Data Protection Officer."
      }
    ]
  },
  {
    id: "data-sharing",
    title: "6. Information Sharing and Disclosure",
    icon: <Users className="h-5 w-5" />,
    content: [
      {
        subtitle: "6.1 When We Share Information",
        text: "We share information with: Service Providers (payment processing, hosting), Payment Processors (EcoCash, OneMoney, banks), Regulatory Authorities (ZIMRA, MCAZ), Law Enforcement (legal requests), Business Partners (aggregated data), Affiliates (referral tracking), Trainers (course delivery)."
      },
      {
        subtitle: "6.2 No Sale of Personal Data",
        text: "We do not sell your personal data to third parties for their marketing purposes. We only share data as necessary to provide our services or when required by law."
      }
    ]
  },
  {
    id: "international-transfers",
    title: "7. International Data Transfers",
    icon: <Globe className="h-5 w-5" />,
    content: [
      {
        subtitle: "7.1 Data Storage Location",
        text: "Your information is primarily stored on servers located in South Africa (AWS af-south-1 region) and Zimbabwe (local backup where applicable)."
      },
      {
        subtitle: "7.2 Safeguards for International Transfers",
        text: "When transferring data outside Zimbabwe, we ensure adequate level of protection as required by the Data Protection Act, standard contractual clauses, data processing agreements, and appropriate technical measures."
      }
    ]
  },
  {
    id: "data-security",
    title: "8. Data Security",
    icon: <Lock className="h-5 w-5" />,
    content: [
      {
        subtitle: "8.1 Security Measures Implemented",
        text: "We implement comprehensive security measures: AES-256 encryption for data at rest, TLS 1.3 for data in transit, role-based access control, multi-factor authentication, firewalls and intrusion detection, regular penetration testing, secure data centers, daily encrypted backups, 24/7 security monitoring."
      },
      {
        subtitle: "8.3 Security Breach Response",
        text: "In the event of a data breach, we will investigate immediately, notify affected users within 72 hours, notify regulatory authorities as required, and take steps to prevent future breaches."
      }
    ]
  },
  {
    id: "your-rights",
    title: "10. Your Rights and Choices",
    icon: <UserCheck className="h-5 w-5" />,
    content: [
      {
        subtitle: "10.1 Your Rights Under Zimbabwe Data Protection Act",
        text: "You have the right to: Access your data, Rectify inaccurate data, Erase your data, Restrict processing, Data portability, Object to processing, Withdraw consent, Lodge complaints with regulatory authorities."
      },
      {
        subtitle: "10.2 How to Exercise Your Rights",
        text: "You can exercise rights through the Platform (Account > Privacy) or by emailing privacy@appex.co.zw. We respond to valid requests within 30 days and may verify your identity before processing certain requests."
      }
    ]
  },
  {
    id: "cookies",
    title: "13. Cookies and Tracking Technologies",
    icon: <Cookie className="h-5 w-5" />,
    content: [
      {
        subtitle: "13.1 Types of Cookies We Use",
        text: "Essential Cookies (required for functionality, session), Functional Cookies (remember preferences, 1 year), Analytics Cookies (understand usage, 2 years), Marketing Cookies (relevant ads, 2 years), Security Cookies (fraud protection, session)."
      },
      {
        subtitle: "13.2 Managing Cookies",
        text: "You can control cookies through browser settings: block all cookies, delete existing cookies, set preferences for specific sites. Disabling essential cookies may affect login, shopping cart, and security features."
      }
    ]
  },
  {
    id: "zimbabwe-provisions",
    title: "14. Zimbabwe-Specific Provisions",
    icon: <Shield className="h-5 w-5" />,
    content: [
      {
        subtitle: "14.1 Compliance with Zimbabwe Data Protection Act",
        text: "We comply with all requirements of the Zimbabwe Data Protection Act including registration with the Data Protection Authority, appointment of a Data Protection Officer, data protection impact assessments, breach notification procedures, and cross-border data transfer safeguards."
      },
      {
        subtitle: "14.4 ZIMRA Tax Compliance",
        text: "We retain transaction data as required by ZIMRA: Sales records (5 years), VAT records (5 years), Affiliate commission records (5 years)."
      },
      {
        subtitle: "14.5 Load Shedding and Data Protection",
        text: "During load shedding, local data may be temporarily stored on devices. This data is encrypted and protected. Automatic sync occurs when power is restored."
      }
    ]
  }
]

export default function PrivacyPage() {
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
                Privacy Policy
              </CardTitle>
              <p className="text-gray-600">
                AppEx Technologies (Private) Limited
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

        {/* Important Additional Sections */}
        <div className="mt-12 space-y-8">
          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Retention Periods</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Active Account Data:</span> Duration of subscription + 90 days
                      </div>
                      <div>
                        <span className="font-medium">Transaction Records:</span> 5 years (ZIMRA requirement)
                      </div>
                      <div>
                        <span className="font-medium">Prescription Records:</span> 5 years (MCAZ requirement)
                      </div>
                      <div>
                        <span className="font-medium">Affiliate Records:</span> 3 years after account closure
                      </div>
                      <div>
                        <span className="font-medium">Training Records:</span> 2 years after course completion
                      </div>
                      <div>
                        <span className="font-medium">Marketing Data:</span> Until consent withdrawn
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Data Deletion</h4>
                  <p className="text-gray-600">
                    You may request deletion through your account or by emailing dpo@appex.co.zw. 
                    Upon deletion, we remove personal information from active systems, anonymize remaining data, 
                    and retain only data required by law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Age Restriction</h4>
                  <p className="text-gray-600">
                    The AppEx Service is not intended for children under 18 years of age. 
                    We do not knowingly collect personal information from children under 18.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">If We Discover Child Data</h4>
                  <p className="text-gray-600">
                    If we learn that we have collected personal information from a child under 18, 
                    we will delete the information immediately, disable the associated account, 
                    and notify the parent or guardian if contact information is available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affiliate Program Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">15. Affiliate Program Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Information Collected from Affiliates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                    <div>
                      <span className="font-medium">Identity and contact:</span> Account management
                    </div>
                    <div>
                      <span className="font-medium">Banking/EcoCash details:</span> Commission payments
                    </div>
                    <div>
                      <span className="font-medium">Tax information:</span> ZIMRA compliance
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Affiliate Tracking</h4>
                  <p className="text-gray-600">
                    We use cookies and tracking links to attribute referrals with a 30-day cookie duration. 
                    Tracking is anonymized where possible and you may opt out of certain tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Hub Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">16. Training Hub Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Information Collected from Learners</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="font-medium">Learning progress:</span> Course completion tracking (2 years)
                    </div>
                    <div>
                      <span className="font-medium">Quiz answers:</span> Assessment grading (1 year)
                    </div>
                    <div>
                      <span className="font-medium">Certificates:</span> Proof of completion (5 years)
                    </div>
                    <div>
                      <span className="font-medium">Feedback and reviews:</span> Course improvement (3 years)
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Certificate Verification</h4>
                  <p className="text-gray-600">
                    When you earn a certificate, your name and course completion are publicly verifiable. 
                    You control who can view your certificate and verification links can be revoked upon request.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">17. Business Data Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Your Business Data Ownership</h4>
                  <p className="text-gray-600">
                    You retain all ownership rights to your Business Data (sales, inventory, customer information). 
                    We process Business Data only to provide the Service, improve the Service (aggregated and anonymized), 
                    and as required by law.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Customer Data Privacy</h4>
                  <p className="text-gray-600">
                    If you collect customer data using AppEx, you are the data controller for customer data 
                    and responsible for complying with privacy laws. We act as a data processor and will 
                    notify you of any data breaches affecting your customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breach Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">18. Breach Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Our Notification Commitment</h4>
                <p className="text-yellow-800">
                  In the event of a personal data breach, we will investigate immediately, 
                  notify affected users within 72 hours, describe the nature of the breach, 
                  recommend actions to mitigate harm, and report to POTRAZ as required by law.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-xl">20. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Data Controller</h4>
                <p className="text-gray-600">
                  AppEx Technologies (Private) Limited<br />
                  Registered Address: Harare, Zimbabwe<br />
                  Email: privacy@appex.co.zw<br />
                  Phone: +263 242 123456
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Data Protection Officer (DPO)</h4>
                <p className="text-gray-600">
                  Email: dpo@appex.co.zw<br />
                  Phone: +263 242 123456
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Regulatory Authority</h4>
              <p className="text-gray-600">
                <strong>Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ)</strong><br />
                Data Protection Office<br />
                Email: dpa@potraz.gov.zw<br />
                Website: www.potraz.gov.zw
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Response Times</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">General inquiries:</span> 5 business days
                </div>
                <div>
                  <span className="font-medium">Data access requests:</span> 30 days
                </div>
                <div>
                  <span className="font-medium">Data deletion requests:</span> 30 days
                </div>
                <div>
                  <span className="font-medium">Urgent matters:</span> 48 hours
                </div>
              </div>
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
                <span className="text-gray-600">{currentDate} - Comprehensive update for Zimbabwe compliance</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Version 1.0</span>
                <span className="text-gray-600">Initial release</span>
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
                BY USING THE APPEX SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND 
                THIS PRIVACY POLICY AND AGREE TO ITS TERMS.
              </p>
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
