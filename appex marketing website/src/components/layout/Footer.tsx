import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-appex rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">Appex POS</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Zimbabwe's leading POS system. Built for local businesses, by local experts. 
              Offline-first, multi-currency, and designed for growth.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <Link href="#" className="hover:text-appex-teal transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-appex-teal transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-appex-teal transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-appex-teal transition-colors"><Linkedin className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-appex-teal transition-colors"><Youtube className="w-5 h-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Solutions</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/solutions/retail" className="hover:text-appex-teal transition-colors">Retail</Link></li>
              <li><Link href="/solutions/restaurant" className="hover:text-appex-teal transition-colors">Restaurant</Link></li>
              <li><Link href="/solutions/hardware" className="hover:text-appex-teal transition-colors">Hardware</Link></li>
              <li><Link href="/solutions/pharmacy" className="hover:text-appex-teal transition-colors">Pharmacy</Link></li>
              <li><Link href="/solutions/butchery" className="hover:text-appex-teal transition-colors">Butchery</Link></li>
              <li><Link href="/hardware" className="hover:text-appex-teal transition-colors">Compatible Hardware</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/pricing" className="hover:text-appex-teal transition-colors">Pricing</Link></li>
              <li><Link href="/tools" className="hover:text-appex-teal transition-colors">Free Tools</Link></li>
              <li><Link href="/resources/blog" className="hover:text-appex-teal transition-colors">Blog</Link></li>
              <li><Link href="/resources/guides" className="hover:text-appex-teal transition-colors">Guides</Link></li>
              <li><Link href="/customers" className="hover:text-appex-teal transition-colors">Customers</Link></li>
              <li><Link href="/help" className="hover:text-appex-teal transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/company/about" className="hover:text-appex-teal transition-colors">About Us</Link></li>
              <li><Link href="/company/careers" className="hover:text-appex-teal transition-colors">Careers</Link></li>
              <li><Link href="/company/partners" className="hover:text-appex-teal transition-colors">Partners</Link></li>
              <li><Link href="/contact" className="hover:text-appex-teal transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-appex-teal transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-appex-teal transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Appex POS. All rights reserved. Built with ❤️ in Zimbabwe.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
