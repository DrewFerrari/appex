import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import Dashboard from "./features/dashboard/Dashboard"
import EarningsCenter from "./features/earnings/EarningsCenter"
import ReferralTracking from "./features/referrals/ReferralTracking"
import MarketingTools from "./features/marketing/MarketingTools"
import TrainingCenter from "./features/training/TrainingCenter"
import SupportHub from "./features/support/SupportHub"
import ZimbabweIntegrations from "./features/zimbabwe/ZimbabweIntegrations"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="referrals" element={<ReferralTracking />} />
            <Route path="earnings" element={<EarningsCenter />} />
            <Route path="marketing" element={<MarketingTools />} />
            <Route path="training" element={<TrainingCenter />} />
            <Route path="support" element={<SupportHub />} />
            <Route path="settings" element={<ZimbabweIntegrations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
