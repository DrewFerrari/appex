import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import MarketAIAssistant from '@/components/market-ai-assistant'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Appex POS - Simplify Your Business with Zimbabwe\'s Leading POS System',
  description: 'Offline-first POS system built for Zimbabwean businesses. Works during load shedding, supports EcoCash & multi-currency. Start your free trial today.',
  keywords: 'POS system Zimbabwe, point of sale Harare, retail POS software, restaurant POS, EcoCash integration, offline POS',
  authors: [{ name: 'Appex POS' }],
  creator: 'Appex POS',
  publisher: 'Appex POS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://appexpos.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZW',
    url: 'https://appexpos.com',
    title: 'Appex POS - Simplify Your Business',
    description: 'Offline-first POS system built for Zimbabwean businesses. Works during load shedding, supports EcoCash & multi-currency.',
    siteName: 'Appex POS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Appex POS - Zimbabwe\'s Leading POS System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appex POS - Simplify Your Business',
    description: 'Offline-first POS system built for Zimbabwean businesses. Works during load shedding, supports EcoCash & multi-currency.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </div>
        <MarketAIAssistant />
      </body>
    </html>
  )
}
