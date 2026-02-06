import type { Metadata } from 'next'
import ROICalculator from '@/components/tools/ROICalculator'

export const metadata: Metadata = {
  title: 'ROI Calculator - See How Much You Can Save | Appex POS',
  description: 'Calculate your potential savings and revenue growth with Appex POS. Enter your business details to get a personalized ROI projection.',
}

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-appex-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Calculate Your <span className="text-gradient">Potential Savings</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See exactly how a modern POS system can reduce losses, save time, and increase your profitability.
            <br className="hidden md:block" />
            Most businesses see a return on investment within the first 30 days.
          </p>
        </div>

        <ROICalculator />

        <div className="mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Disclaimer: These calculations are estimates based on average industry data for Zimbabwean SMEs.
            Actual results may vary giving your specific business conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
