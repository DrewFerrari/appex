import {
    DollarSign,
    Clock,
    TrendingUp,
    Target,
    Link as LinkIcon,
    Send,
    CheckCircle,
    MousePointer,
    Award,
    AlertTriangle,
    Lightbulb
} from "lucide-react"
import { Button } from "../../components/ui/Button"
import { MetricCard } from "../../components/shared/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts"
import { cn } from "../../utils/cn"

const earningsData = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 600 },
    { name: "Thu", value: 800 },
    { name: "Fri", value: 500 },
    { name: "Sat", value: 900 },
    { name: "Sun", value: 1000 },
]

const funnelData = [
    { name: 'Clicks', value: 1250, color: '#3b82f6' },
    { name: 'Visits', value: 980, color: '#6366f1' },
    { name: 'Sign Ups', value: 145, color: '#8b5cf6' },
    { name: 'Trials', value: 98, color: '#a855f7' },
    { name: 'Paid', value: 42, color: '#10b981' },
]

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Welcome back, Tendai! 👋
                    </h1>
                    <div className="flex items-center space-x-3">
                        <Badge variant="gold" className="px-3 py-1">
                            <Award size={14} className="mr-1" /> Gold Tier Partner
                        </Badge>
                        <span className="text-sm text-text-muted">
                            75% to Platinum • 5 conversions needed
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-status-infoBg">
                        <LinkIcon size={18} className="mr-2" /> Generate Link
                    </Button>
                    <Button variant="secondary">
                        <Send size={18} className="mr-2" /> Invite Partner
                    </Button>
                    <Button variant="success">
                        <DollarSign size={18} className="mr-2" /> Request Payout
                    </Button>
                </div>
            </section>

            {/* Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Earnings"
                    value="$4,850.00"
                    change="+24%"
                    trend="up"
                    period="vs last month"
                    icon={<DollarSign size={20} />}
                    color="green"
                />
                <MetricCard
                    label="Pending Commissions"
                    value="$320.00"
                    subtitle="15 active conversions"
                    icon={<Clock size={20} />}
                    color="blue"
                    actionButton="View Details"
                />
                <MetricCard
                    label="This Month"
                    value="12"
                    change="+33%"
                    trend="up"
                    subtitle="Conversions"
                    icon={<TrendingUp size={20} />}
                    color="purple"
                />
                <MetricCard
                    label="Conversion Rate"
                    value="3.4%"
                    change="+0.8%"
                    trend="up"
                    badge="Above Average"
                    period="Industry avg: 2.1%"
                    icon={<Target size={20} />}
                    color="gold"
                />
            </section>

            {/* Live Notification Bar */}
            <div className="bg-status-successBg border border-status-success/20 rounded-xl p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-status-success" />
                    <p className="text-sm text-text-primary">
                        🎉 <strong>New conversion!</strong> ABC Hardware Store signed up for Enterprise plan.
                        <span className="ml-2 text-status-success font-bold">+$150 commission earned</span>
                    </p>
                </div>
                <span className="text-xs text-text-muted font-mono">JUST NOW</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Earnings Timeline</CardTitle>
                        <div className="flex bg-background-tertiary rounded-lg p-1">
                            {['7d', '30d', '90d'].map(t => (
                                <button key={t} className={cn(
                                    "px-3 py-1 text-xs rounded-md transition-colors",
                                    t === '7d' ? "bg-accent-blue text-white" : "text-text-muted hover:text-text-primary"
                                )}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Insights */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center">
                        <Lightbulb className="text-accent-gold mr-2" size={20} /> AI Powered Insights
                    </h2>
                    <div className="space-y-3">
                        {[
                            { type: 'success', icon: <TrendingUp size={16} />, text: "Your conversion rate is 62% higher than average. Your WhatsApp strategy is working!" },
                            { type: 'info', icon: <Lightbulb size={16} />, text: "Try sharing on weekdays (8-10 AM). CTR is 3x higher during these hours." },
                            { type: 'warning', icon: <AlertTriangle size={16} />, text: "Instagram engagement dropped 15%. Consider refreshing your content." }
                        ].map((insight, i) => (
                            <div key={i} className={cn(
                                "p-4 rounded-lg flex items-start space-x-3 border",
                                insight.type === 'success' ? "bg-status-successBg border-status-success/20 text-text-primary" :
                                    insight.type === 'info' ? "bg-status-infoBg border-status-info/20 text-text-primary" :
                                        "bg-status-errorBg border-status-error/20 text-text-primary"
                            )}>
                                <div className={cn(
                                    "mt-1",
                                    insight.type === 'success' ? "text-status-success" :
                                        insight.type === 'info' ? "text-status-info" :
                                            "text-status-error"
                                )}>
                                    {insight.icon}
                                </div>
                                <p className="text-sm">{insight.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { type: 'conversion', time: '2 mins ago', text: 'New customer signed up via Facebook', amount: '+$75' },
                            { type: 'click', time: '15 mins ago', text: '5 new clicks from Instagram bio link', amount: null },
                            { type: 'payout', time: '2 hours ago', text: 'Commission payout processed to EcoCash', amount: '$850' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center justify-between pb-4 border-b border-border-default last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center",
                                        activity.type === 'conversion' ? "bg-status-successBg text-status-success" :
                                            activity.type === 'click' ? "bg-status-infoBg text-status-info" :
                                                "bg-status-warningBg text-status-warning"
                                    )}>
                                        {activity.type === 'conversion' ? <CheckCircle size={14} /> :
                                            activity.type === 'click' ? <MousePointer size={14} /> :
                                                <DollarSign size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{activity.text}</p>
                                        <p className="text-xs text-text-muted">{activity.time}</p>
                                    </div>
                                </div>
                                {activity.amount && (
                                    <span className={cn(
                                        "text-sm font-bold",
                                        activity.type === 'conversion' ? "text-status-success" : "text-text-primary"
                                    )}>
                                        {activity.amount}
                                    </span>
                                )}
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs text-text-muted hover:text-text-primary">
                            View All Activity
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
