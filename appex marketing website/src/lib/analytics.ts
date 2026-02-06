import React from 'react'

// Analytics utilities for Appex POS website

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void
    dataLayer?: any[]
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window !== 'undefined' && !window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function() {
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date().toISOString())
    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
    })
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific tracking functions for Appex POS
export const analytics = {
  // Download tracking
  downloadStarted: (platform: string, industry?: string) => {
    trackEvent('download_started', 'engagement', `${platform}_${industry || 'general'}`)
  },

  qrCodeGenerated: (platform: string, industry: string) => {
    trackEvent('qr_generated', 'engagement', `${platform}_${industry}`)
  },

  qrCodeScanned: (platform: string, industry: string) => {
    trackEvent('qr_scanned', 'engagement', `${platform}_${industry}`)
  },

  // CTA tracking
  freeTrialStarted: (source: string) => {
    trackEvent('free_trial_started', 'conversion', source)
  },

  demoScheduled: (source: string) => {
    trackEvent('demo_scheduled', 'conversion', source)
  },

  whatsappClicked: (context: string) => {
    trackEvent('whatsapp_clicked', 'engagement', context)
  },

  // ROI Calculator tracking
  roiCalculatorUsed: (industry: string) => {
    trackEvent('roi_calculator_used', 'engagement', industry)
  },

  roiResultsShared: (method: string) => {
    trackEvent('roi_results_shared', 'engagement', method)
  },

  roiResultsDownloaded: () => {
    trackEvent('roi_results_downloaded', 'engagement')
  },

  // Page engagement
  featureViewed: (featureName: string) => {
    trackEvent('feature_viewed', 'engagement', featureName)
  },

  pricingViewed: (plan: string) => {
    trackEvent('pricing_viewed', 'engagement', plan)
  },

  industrySolutionViewed: (industry: string) => {
    trackEvent('industry_solution_viewed', 'engagement', industry)
  },

  // Form submissions
  contactFormSubmitted: (subject: string) => {
    trackEvent('contact_form_submitted', 'conversion', subject)
  },

  newsletterSubscribed: (source: string) => {
    trackEvent('newsletter_subscribed', 'conversion', source)
  },

  // User behavior
  timeOnPage: (page: string, duration: number) => {
    trackEvent('time_on_page', 'engagement', page, duration)
  },

  scrollDepth: (page: string, depth: number) => {
    trackEvent('scroll_depth', 'engagement', `${page}_${depth}`)
  },

  // Error tracking
  errorOccurred: (error: string, context: string) => {
    trackEvent('error_occurred', 'error', `${context}_${error}`)
  },

  // Search tracking
  searchPerformed: (query: string) => {
    trackEvent('search_performed', 'engagement', query)
  },

  // Conversion funnel tracking
  funnelStepCompleted: (funnel: string, step: string) => {
    trackEvent('funnel_step_completed', 'conversion', `${funnel}_${step}`)
  }
}

// Hook for tracking component visibility
export const useTrackVisibility = (elementId: string, eventName: string, eventParams?: any) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent(eventName, 'engagement', eventParams)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(elementId)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [elementId, eventName, eventParams])
}

// Performance monitoring
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        
        trackEvent('page_load_time', 'performance', 'load_time', Math.round(loadTime))
      }, 0)
    })
  }
}

// Consent management
export const updateConsent = (analytics: boolean, marketing: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
    })
  }
}

export default analytics
