import {
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    DollarSign,
    Search,
    Filter,
    Eye,
    MessageCircle,
    ChevronRight,
    ShieldCheck,
    AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { cn } from "../../utils/cn"

export default function ReferralTracking() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Referral Tracking</h1>
                    <p className="text-text-muted mt-1">Monitor your lead funnel and conversion attribution</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline"><Users size={18} className="mr-2" /> Export Leads</Button>
                    <Button variant="primary"><MessageCircle size={18} className="mr-2" /> Bulk Message</Button>
                </div>
            </section>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Referrals", value: "247", change: "+12", trend: "up", icon: <Users size={20} />, color: "blue" },
                    { label: "Converted", value: "89", change: "+5", trend: "up", icon: <CheckCircle size={20} />, color: "green" },
                    { label: "In Trial", value: "45", change: "-2", trend: "down", icon: <Clock size={20} />, color: "purple" },
                    { label: "Est. Revenue", value: "$6, 320", change: "+18%", trend: "up", icon: <DollarSign size={20} />, color: "gold" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    stat.color === 'blue' ? "bg-status-infoBg text-accent-blue" :
                                        stat.color === 'green' ? "bg-status-successBg text-accent-green" :
                                            stat.color === 'purple' ? "bg-status-infoBg text-accent-purple" :
                                                "bg-status-warningBg text-accent-gold"
                                )}>
                                    {stat.icon}
                                </div>
                                <div className={cn(
                                    "flex items-center text-xs font-bold",
                                    stat.trend === 'up' ? "text-status-success" : "text-status-error"
                                )}>
                                    {stat.change}
                                    {stat.trend === 'up' ? <TrendingUp size={12} className="ml-1" /> : <TrendingUp size={12} className="ml-1 rotate-180" />}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Referral List */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Recent Referrals</CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <Input placeholder="Search by name, email..." className="pl-9 h-9 w-64 bg-background-tertiary" />
                                </div>
                                <Button variant="outline" size="icon"><Filter size={16} /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-text-muted uppercase bg-background-tertiary border-b border-border-default">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Stage</th>
                                        <th className="px-6 py-4 font-medium">Source</th>
                                        <th className="px-6 py-4 font-medium text-right">Est. Value</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {[
                                        { name: 'John Doe', email: 'john@example.com', stage: 'Converted', stageVar: 'success', source: 'Facebook', value: '$150/mo' },
                                        { name: 'Sarah Wilson', email: 'sarah.w@tech.co', stage: 'Trialing', stageVar: 'info', source: 'Insta Bio', value: '$75/mo' },
                                        { name: 'Michael Chen', email: 'm.chen@retailz.com', stage: 'Signed Up', stageVar: 'warning', source: 'WhatsApp', value: '$45/mo' },
                                        { name: 'Retail Solutions', email: 'admin@retailsol.co.zw', stage: 'Converted', stageVar: 'success', source: 'Cold Email', value: '$300/mo' },
                                        { name: 'Grace Moyo', email: 'grace@boutique.com', stage: 'Inquiry', stageVar: 'secondary', source: 'Direct Link', value: 'N/A' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-background-tertiary transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 rounded-full bg-background-tertiary flex items-center justify-center text-xs font-bold text-accent-blue border border-border-default">
                                                        {row.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-primary">{row.name}</p>
                                                        <p className="text-xs text-text-muted">{row.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={row.stageVar as any}>{row.stage}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">{row.source}</td>
                                            <td className="px-6 py-4 text-right font-medium text-text-primary">{row.value}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted"><Eye size={16} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted"><MessageCircle size={16} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs text-text-muted hover:text-text-primary">
                            View All Referrals <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* Lead Scoring */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <ShieldCheck className="text-accent-green mr-2" /> High Quality Leads
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'ABC Hardware', industry: 'Retail', score: 95, signal: 'Viewed pricing 3 times' },
                                { name: 'Metro Supermarket', industry: 'FMCG', score: 88, signal: 'Matched Ideal Customer Profile' },
                            ].map((lead, i) => (
                                <div key={i} className="p-4 rounded-lg bg-background-tertiary border border-border-default space-y-3 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent to-accent-green" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-text-primary">{lead.name}</p>
                                            <p className="text-xs text-text-muted">{lead.industry}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-accent-green">{lead.score}</span>
                                            <p className="text-[10px] text-text-muted font-bold tracking-tighter uppercase">LEAD SCORE</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-text-primary bg-status-successBg p-2 rounded border border-status-success/10">
                                        <TrendingUp size={12} className="text-status-success mr-2" />
                                        {lead.signal}
                                    </div>
                                    <Button size="sm" className="w-full text-xs" variant="outline">Reach Out Now</Button>
                                </div>
                            ))}
                            <div className="flex items-center justify-center p-2 rounded-lg bg-status-infoBg border border-accent-blue/10">
                                <AlertCircle size={14} className="text-accent-blue mr-2" />
                                <p className="text-[10px] text-accent-blue italic">AI models updated 2 hours ago</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attribution Analysis */}
                    <Card className="bg-background-tertiary border-border-light shadow-lg">
                        <CardHeader pb-2>
                            <CardTitle className="text-base uppercase tracking-widest text-text-muted">Attribution Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-text-primary">
                                        <span>Last Touch (Direct Link)</span>
                                        <span>50%</span>
                                    </div>
                                    <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden flex">
                                        <div className="h-full bg-accent-blue w-[50%]" />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-text-primary">
                                        <span>First Touch (Facebook Ad)</span>
                                        <span>30%</span>
                                    </div>
                                    <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden flex">
                                        <div className="h-full bg-accent-purple w-[30%]" />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-text-primary">
                                        <span>Middle Touch (Email)</span>
                                        <span>20%</span>
                                    </div>
                                    <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden flex">
                                        <div className="h-full bg-accent-green w-[20%]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-text-muted italic leading-tight">
                                * Based on Time Decay model. We credit partners who drive final conversions while rewarding top-of-funnel activity.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
