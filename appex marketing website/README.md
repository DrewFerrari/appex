# Appex POS Marketing Website

A modern, production-ready marketing website for Appex POS, Zimbabwe's leading point-of-sale system built specifically for African businesses.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom Appex brand colors
- **shadcn/ui** components for consistent design
- **Framer Motion** for smooth animations
- **Smart Download Flow** with QR code generation
- **Zimbabwe-specific** features and payment methods
- **Mobile-first** responsive design
- **WhatsApp integration** for customer support
- **SEO optimized** with proper metadata

## 🇿🇼 Zimbabwe-First Features

- **Load Shedding Proof**: Works completely offline during power cuts
- **EcoCash Integration**: Native support for Zimbabwe's mobile money
- **Multi-Currency**: Handle USD, ZWL and other African currencies
- **Local Payment Methods**: Paynow, ZimSwitch, ZIPIT support
- **WhatsApp Business**: Primary communication channel
- **Offline-First Architecture**: Designed for unstable internet

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Deployment**: Vercel ready

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── select.tsx
│   ├── navbar.tsx           # Navigation header
│   ├── hero-section.tsx     # Homepage hero
│   └── download-modal.tsx   # Smart download flow
└── lib/
    └── utils.ts             # Utility functions
```

## 🎨 Brand Colors

The website uses the official Appex brand palette:

- **Primary Teal**: `#00D4CC`
- **Cyan**: `#00E5FF`
- **Deep Blue**: `#1E3A8A`
- **Purple/Violet**: `#7C3AED` / `#8B5CF6`
- **Navy/Charcoal**: `#1E293B` / `#334155`
- **Dark**: `#0F172A`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd appex-marketing-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Smart Download Flow

The website features an intelligent download system:

1. **Platform Selection**: Android, iOS, or Windows
2. **Industry Type**: Retail, Restaurant, Hardware, etc.
3. **QR Code Generation**: Creates custom deep links
4. **Analytics Tracking**: Monitors downloads and conversions

### QR Code URLs Format:
```
https://appexpos.com/app?platform=android&industry=retail
```

## 🌐 WhatsApp Integration

- **Floating WhatsApp button** on all pages
- **Direct chat links** with pre-filled messages
- **Business number**: +263 780 808 358
- **Click-to-chat** functionality

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://appexpos.com
NEXT_PUBLIC_WHATSAPP_NUMBER=263780808358
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Metadata Configuration

SEO and social media metadata are configured in `src/app/layout.tsx`:

- Open Graph tags for social sharing
- Twitter Card metadata
- Structured data for search engines
- Canonical URLs and sitemap support

## 📊 Analytics & Tracking

The website is set up for:

- **Google Analytics 4**
- **Conversion tracking** (downloads, signups)
- **QR code scan analytics**
- **WhatsApp interaction tracking**

## 🎯 Key Pages

- **Homepage**: Hero section, features, testimonials, CTAs
- **Download Modal**: Smart platform/industry selection
- **Features**: Detailed feature showcase
- **Pricing**: Tiered pricing plans
- **Contact**: WhatsApp and phone support

## 🌟 Conversion Features

- **Multiple CTAs** strategically placed
- **Social proof** with Zimbabwean testimonials
- **Trust indicators** (business count, uptime)
- **Urgency elements** (limited-time offers)
- **Lead capture** through free trial signup

## 📱 Mobile Optimization

- **Responsive design** for all screen sizes
- **Touch-friendly** interface elements
- **Fast loading** on mobile networks
- **PWA-ready** structure
- **WhatsApp sharing** on mobile

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Other Platforms

The app is compatible with:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Any Node.js hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to Appex POS. All rights reserved.

## 📞 Support

For technical support:
- **WhatsApp**: +263 780 808 358
- **Email**: support@appexpos.com
- **Website**: [appexpos.com](https://appexpos.com)

---

Built with ❤️ in Zimbabwe for African businesses.
