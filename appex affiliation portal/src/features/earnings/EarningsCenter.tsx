import {
    Award,
    Clock,
    Smartphone,
    Building,
    Plus,
    Eye,
    Download,
    Filter,
    Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { cn } from "../../utils/cn"

export default function EarningsCenter() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="flex flex-col md:flex-row justify-between gap-6">
                <h1 className="text-3xl font-bold text-text-primary">Earnings & Payouts</h1>
                <div className="flex items-center space-x-3">
                    <Button variant="outline"><Download size={18} className="mr-2" /> Export Report</Button>
                    <Button variant="primary"><Plus size={18} className="mr-2" /> Add Payout Method</Button>
                </div>
            </section>

            {/* Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-gradient-to-br from-background-secondary to-background-tertiary border-accent-blue/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-text-muted mb-1">Available for Withdrawal</p>
                                <h2 className="text-4xl font-bold text-text-primary">$2,380.00</h2>
                            </div>
                            <Badge variant="success" className="px-3 py-1">5% Tax Withheld</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                            {[
                                { label: "Lifetime Earnings", value: "$12,450.75", color: "text-text-primary" },
                                { label: "Paid Out", value: "$9,200.00", color: "text-accent-green" },
                                { label: "Pending", value: "$2,380.00", color: "text-accent-blue" },
                                { label: "Processing", value: "$870.75", color: "text-status-warning" },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-xs text-text-muted mb-1">{item.label}</p>
                                    <p className={cn("text-lg font-bold", item.color)}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-accent-gold/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Award className="text-accent-gold mr-2" /> Current Tier: Gold
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Commission Rate</span>
                            <span className="text-accent-gold font-bold">20%</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-text-muted">Progress to Platinum</span>
                                <span className="text-text-primary">75%</span>
                            </div>
                            <div className="h-2 w-full bg-background-tertiary rounded-full overflow-hidden">
                                <div className="h-full bg-accent-gold w-[75%]" />
                            </div>
                        </div>
                        <p className="text-xs text-text-muted italic">
                            5 more conversions to reach 25% Platinum rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Payout Request */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Request Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Amount to Withdraw (USD)</label>
                                    <Input type="number" placeholder="0.00" className="text-lg font-bold" />
                                    <p className="text-xs text-text-disabled">Min: $20.00 • Max: $2,380.00</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Payout Method</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { name: 'EcoCash (****4523)', icon: <Smartphone size={16} />, primary: true },
                                            { name: 'CBZ Bank (****2345)', icon: <Building size={16} /> },
                                        ].map((m, i) => (
                                            <button key={i} className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border text-sm transition-all",
                                                m.primary ? "border-accent-blue bg-status-infoBg" : "border-border-default hover:bg-background-tertiary"
                                            )}>
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-text-muted">{m.icon}</span>
                                                    <span className="text-text-primary">{m.name}</span>
                                                </div>
                                                {m.primary && <div className="h-2 w-2 rounded-full bg-accent-blue" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-background-tertiary border border-border-default space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Requested Amount</span>
                                    <span className="text-text-primary">$1,000.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Withholding Tax (5%)</span>
                                    <span className="text-status-error">-$50.00</span>
                                </div>
                                <div className="h-[1px] bg-border-default" />
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-text-primary">Net Amount to Receive</span>
                                    <span className="text-accent-green">$950.00</span>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-base" variant="success">
                                Confirm Payout Request
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Payment Methods</CardTitle>
                            <Button variant="ghost" size="icon"><Plus size={18} /></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'EcoCash', id: '*******4523', status: 'Verified', icon: <Smartphone className="text-accent-blue" /> },
                                { name: 'CBZ Bank', id: '*******2345', status: 'Verified', icon: <Building className="text-accent-blue" /> }
                            ].map((method, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary border border-border-default">
                                    <div className="flex items-center space-x-3">
                                        {method.icon}
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{method.name}</p>
                                            <p className="text-xs text-text-muted font-mono">{method.id}</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" className="text-[10px]">{method.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-status-infoBg border-accent-blue/20">
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                                <Clock className="text-accent-blue mt-1" size={18} />
                                <div>
                                    <h4 className="text-sm font-bold text-text-primary">Next Auto-Payout</h4>
                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                        Your next automatic payout is scheduled for <strong>Feb 15, 2026</strong>.
                                        Current estimated amount: <strong>$320.00</strong>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* History Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Earnings History</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <Input placeholder="Search transactions..." className="pl-9 h-9 w-64 bg-background-tertiary" />
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
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Customer/Type</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {[
                                    { date: 'Feb 5, 2026', desc: 'ABC Hardware Store', type: 'Recurring', amount: '+$150.00', status: 'Paid', statusVar: 'success' },
                                    { date: 'Feb 4, 2026', desc: 'Monthly Loyalty Bonus', type: 'Bonus', amount: '+$500.00', status: 'Processing', statusVar: 'warning' },
                                    { date: 'Feb 1, 2026', desc: 'Tech Solutions Ltd', type: 'Professional Plan', amount: '+$75.00', status: 'Paid', statusVar: 'success' },
                                    { date: 'Jan 31, 2026', desc: 'Withdrawal to EcoCash', type: 'Payout', amount: '-$850.00', status: 'Paid', statusVar: 'success' },
                                    { date: 'Jan 28, 2026', desc: 'Fashion Hub', type: 'Starter Plan', amount: '+$25.00', status: 'Paid', statusVar: 'success' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-background-tertiary transition-colors">
                                        <td className="px-6 py-4 text-text-muted whitespace-nowrap">{row.date}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-text-primary">{row.desc}</p>
                                            <p className="text-[10px] text-text-muted uppercase tracking-wider">{row.type}</p>
                                        </td>
                                        <td className={cn(
                                            "px-6 py-4 text-right font-bold",
                                            row.amount.startsWith('+') ? "text-accent-green" : "text-text-primary"
                                        )}>
                                            {row.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={row.statusVar as any}>{row.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary transition-colors">
                                                <Eye size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-xs text-text-muted">Showing 1 to 5 of 247 transactions</p>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm">Next</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
