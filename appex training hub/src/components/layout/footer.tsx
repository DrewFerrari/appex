import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin, Share2, Video, ExternalLink } from "lucide-react"

const footerLinks = {
  Solutions: [
    { name: "Retail Management", href: "/solutions/retail" },
    { name: "Restaurant Management", href: "/solutions/restaurant" },
    { name: "Hardware Store", href: "/solutions/hardware" },
    { name: "Grocery Store", href: "/solutions/grocery" },
    { name: "Pharmacy", href: "/solutions/pharmacy" },
    { name: "Butchery", href: "/solutions/butchery" },
  ],
  Learning: [
    { name: "All Courses", href: "/courses" },
    { name: "Certifications", href: "/certifications" },
    { name: "Documentation", href: "/docs" },
    { name: "Video Tutorials", href: "/videos" },
    { name: "Webinars", href: "/webinars" },
    { name: "Community", href: "/community" },
  ],
  Support: [
    { name: "Help Center", href: "/support" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/docs/faq" },
    { name: "System Status", href: "/status" },
    { name: "Report Issue", href: "/support/report" },
    { name: "Feature Request", href: "/feedback" },
  ],
  Company: [
    { name: "About AppEx", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Partners", href: "/partners" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}


export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AppEx Learning Hub</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              Empowering businesses across Zimbabwe with comprehensive training solutions for retail, restaurant, hardware, grocery, pharmacy, and butchery management.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
                          </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex justify-center space-x-6">
            <a 
              href="https://twitter.com/appex" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Share2 className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com/company/appex" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="h-6 w-6" />
            </a>
            <a 
              href="https://youtube.com/appex" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Video className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">support@appex.co.zw</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">+263 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Office</p>
                <p className="text-white">Harare, Zimbabwe</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} AppEx Business Solutions. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
