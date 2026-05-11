import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { DashboardData, ApiResponse } from '../../types/auth'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Activity, 
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      const data: ApiResponse<DashboardData> = await response.json()
      
      if (data.success && data.data) {
        setDashboardData(data.data)
      } else {
        setError(data.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-t-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-t-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-card border-b border-white/10 dark:bg-appex-navy/80 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-appex-blue rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-appex-cyan font-black text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold text-appex-blue dark:text-white tracking-tight">Affiliate Network Control</h1>
              <span className="px-3 py-1 text-xs font-black text-white bg-appex-accent rounded-full uppercase tracking-widest shadow-sm">
                {dashboardData.user.affiliateTier}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-appex-blue/5 dark:bg-white/5 rounded-lg border border-appex-blue/10 dark:border-white/10">
                <Target className="h-4 w-4 text-appex-purple" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  Trust: {dashboardData.user.trustLevel}/5
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className={dashboardData.user.emailVerified ? 'text-appex-cyan' : 'text-appex-purple opacity-70'}>
                  {dashboardData.user.emailVerified ? '● CORE_SECURE' : '○ PENDING_ID'}
                </span>
                <span className={dashboardData.user.phoneVerified ? 'text-appex-cyan' : 'text-appex-purple opacity-70'}>
                  {dashboardData.user.phoneVerified ? '● MOBILE_LINKED' : '○ NO_MOBILE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Commissions */}
          <div className="glass-card overflow-hidden rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all group">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-appex-blue flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <DollarSign className="h-6 w-6 text-appex-cyan" />
              </div>
              <div className="ml-5">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Earnings</div>
                <div className="text-2xl font-black text-appex-blue dark:text-white">
                  {formatCurrency(dashboardData.totalCommissions)}
                </div>
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="glass-card overflow-hidden rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all group">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-appex-navy flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="h-6 w-6 text-appex-purple" />
              </div>
              <div className="ml-5">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Network Sales</div>
                <div className="text-2xl font-black text-appex-blue dark:text-white">
                  {dashboardData.totalSales}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Commissions */}
          <div className="glass-card overflow-hidden rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all group">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-appex-blue flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Calendar className="h-6 w-6 text-appex-cyan" />
              </div>
              <div className="ml-5">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Cycle Revenue</div>
                <div className="text-2xl font-black text-appex-blue dark:text-white">
                  {formatCurrency(dashboardData.monthlyCommissions)}
                </div>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="glass-card overflow-hidden rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all group">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-appex-navy flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Activity className="h-6 w-6 text-appex-purple" />
              </div>
              <div className="ml-5">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Active Sessions</div>
                <div className="text-2xl font-black text-appex-blue dark:text-white">
                  {dashboardData.activeSessions}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Rates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Commission Structure */}
          <div className="glass-card rounded-2xl border border-white/20 overflow-hidden shadow-xl">
            <div className="p-8">
              <h3 className="text-xl font-black text-appex-blue dark:text-white mb-6 flex items-center gap-2 italic uppercase">
                <Award className="h-5 w-5 text-appex-cyan" />
                Network Multipliers
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Standard Base', value: dashboardData.commissionRates.standard },
                  { label: 'Performance Bonus', value: dashboardData.commissionRates.bonus, highlight: true },
                  { label: 'Residual Stream', value: dashboardData.commissionRates.recurring },
                  { label: 'Direct Referral', value: dashboardData.commissionRates.referral }
                ].map((rate, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{rate.label}</span>
                    <span className={`text-lg font-black ${rate.highlight ? 'text-appex-purple' : 'text-appex-cyan'}`}>
                      {formatPercentage(rate.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Data */}
          <div className="glass-card rounded-2xl border border-white/20 overflow-hidden shadow-xl">
            <div className="p-8">
              <h3 className="text-xl font-black text-appex-blue dark:text-white mb-6 flex items-center gap-2 italic uppercase">
                <BarChart3 className="h-5 w-5 text-appex-purple" />
                Velocity Metrics
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Mean Commission</span>
                    <span className="text-lg font-black text-white">{formatCurrency(dashboardData.stats.averageCommission)}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10 text-center">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2">Lead Conversion Efficiency</span>
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-appex-accent h-full shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all duration-1000" 
                      style={{ width: `${dashboardData.stats.conversionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xl font-black text-appex-cyan mt-2 block">{formatPercentage(dashboardData.stats.conversionRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Referrals Table */}
        <div className="mt-10">
          <div className="glass-card rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-black text-appex-blue dark:text-white flex items-center gap-2 italic uppercase">
                <Users className="h-5 w-5 text-appex-cyan" />
                Referral Feed
              </h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Protocol Status</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dashboardData.recentReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-appex-blue/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{referral.referredName || 'IDENT_UNKNOWN'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{referral.referredEmail}</div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-300 italic">
                        {referral.businessName || 'UNREGISTERED'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1 text-[10px] font-black rounded-lg border flex items-center w-fit shadow-sm ${
                          referral.status === 'CONVERTED' ? 'bg-appex-cyan/10 border-appex-cyan text-appex-cyan' :
                          referral.status === 'INTERESTED' ? 'bg-appex-purple/10 border-appex-purple text-appex-purple' :
                          'bg-white/5 border-white/10 text-gray-400'
                        }`}>
                          <span className="mr-1.5 h-1 w-1 rounded-full bg-current animate-pulse"></span>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Access Decals */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'Add Referral', color: 'bg-appex-blue text-appex-cyan', path: '/affiliate/referrals' },
            { icon: CreditCard, label: 'Settlement', color: 'bg-appex-navy text-appex-purple', path: '/affiliate/payouts' },
            { icon: BarChart3, label: 'Deep Intel', color: 'bg-appex-blue text-appex-cyan', path: '/affiliate/analytics' },
            { icon: Award, label: 'Access Key', color: 'bg-appex-navy text-appex-purple', path: '/affiliate/referrals/link' }
          ].map((action, i) => (
            <button
              key={i}
              className="glass-card p-6 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/20 hover:scale-[1.05] active:scale-95 transition-all group"
              onClick={() => window.location.href = action.path}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${action.color} shadow-lg shadow-black/20 group-hover:rotate-12 transition-transform`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-appex-blue dark:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
