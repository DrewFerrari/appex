import {
    Smartphone,
    CheckCircle2,
    AlertTriangle,
    Building2,
    ShieldCheck,
    Globe,
    ArrowRight,
    Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { cn } from "../../utils/cn"

export default function ZimbabweIntegrations() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Zimbabwe Center</h1>
                    <p className="text-text-muted mt-1">Manage local payout methods and regulatory compliance</p>
                </div>
                <Badge variant="success" className="h-fit py-1 px-4 text-xs font-bold bg-status-successBg text-status-success border-status-success/10 capitalize">
                    Region: Southern Africa (ZIM)
                </Badge>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mobile Money Configuration */}
                <Card className="lg:col-span-2 border-accent-blue/20">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Smartphone className="mr-2 text-accent-blue" /> Mobile Money Integration
                        </CardTitle>
                        <CardDescription>Link your EcoCash, OneMoney, or Telecash wallets for instant commissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { name: 'EcoCash', logo: 'EC', color: 'bg-[#005a9c]', text: 'text-white' },
                                { name: 'OneMoney', logo: 'OM', color: 'bg-[#f39200]', text: 'text-white' },
                                { name: 'Telecash', logo: 'TC', color: 'bg-[#ef4444]', text: 'text-white' },
                            ].map((m, i) => (
                                <div key={i} className="p-4 rounded-xl border border-border-default hover:border-accent-blue transition-all cursor-pointer group hover:bg-background-tertiary">
                                    <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center font-black text-xl mb-3", m.color, m.text)}>
                                        {m.logo}
                                    </div>
                                    <h5 className="font-bold text-text-primary">{m.name}</h5>
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Instant Payouts Available</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-xl bg-background-tertiary border border-border-default space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Primary Mobile Number</label>
                                <div className="flex">
                                    <span className="px-3 py-2 bg-background-secondary border border-r-0 border-border-default rounded-l-md text-sm text-text-muted">+263</span>
                                    <Input placeholder="771 234 567" className="rounded-l-none" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-3 bg-status-infoBg border border-accent-blue/10 rounded-lg">
                                <ShieldCheck size={18} className="text-accent-blue" />
                                <p className="text-xs text-text-primary">Your number will be verified with a 2FA code via SMS.</p>
                            </div>
                            <Button className="w-full h-11">Verify and Link Wallet</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Local Verification Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">KYC & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-1 items-center">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs text-text-muted font-bold tracking-widest uppercase">Verification Status</span>
                                <span className="text-2xl font-black text-status-warning">75%</span>
                            </div>
                            <div className="h-2 w-full bg-background-tertiary rounded-full overflow-hidden">
                                <div className="h-full bg-status-warning w-[75%]" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'National ID / Passport', status: 'Verified', icon: <CheckCircle2 className="text-accent-green" size={14} /> },
                                { label: 'Proof of Residence', status: 'Pending', icon: <AlertTriangle className="text-status-warning" size={14} /> },
                                { label: 'Tax ID (ZIMRA)', status: 'Verified', icon: <CheckCircle2 className="text-accent-green" size={14} /> },
                                { label: 'Bank Statement', status: 'Not Uploaded', icon: <Info className="text-text-disabled" size={14} /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-text-muted">{item.icon}</span>
                                        <span className="text-text-primary font-medium">{item.label}</span>
                                    </div>
                                    <Badge variant={item.status === 'Verified' ? 'success' : item.status === 'Pending' ? 'warning' : 'secondary'} className="text-[10px]">
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full text-xs">Upload Missing Documents</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Local Bank Support */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Building2 className="mr-2 text-accent-blue" /> RTGS & Nostro Bank Payouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-text-muted">
                            We support all major Zimbabwean financial institutions for bulk commission transfers.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {['CBZ Bank', 'Stanbic Bank', 'CABS', 'Nedbank ZIM', 'FBC Bank', 'Stewart Bank'].map(bank => (
                                <div key={bank} className="px-3 py-2 rounded border border-border-default text-[10px] font-bold text-text-muted uppercase text-center hover:border-accent-blue hover:text-text-primary transition-all cursor-default">
                                    {bank}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-background-tertiary border border-border-default border-dashed text-center">
                            <Button variant="ghost" className="text-xs"><ArrowRight size={14} className="mr-2" /> Add Bank Account</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Localized Opportunities */}
                <Card className="bg-gradient-to-br from-background-secondary to-accent-gold/5 border-accent-gold/20">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Globe className="mr-2 text-accent-gold" /> Zimbabwe Market Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {[
                                { title: 'Harare CBD Expansion', detail: 'Increased demand for POS in hardware sector.', target: '+25% Commission' },
                                { title: 'Bulawayo Tech Hub', detail: 'High conversion rate in boutique startups.', target: 'Premium Bonus' }
                            ].map((opt, i) => (
                                <div key={i} className="p-4 rounded-lg bg-background-primary border border-border-default space-y-2 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 h-10 w-10 bg-accent-gold/10 rounded-bl-full flex items-center justify-end p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <TrendingUp size={16} className="text-accent-gold" />
                                    </div>
                                    <h6 className="font-bold text-text-primary text-sm">{opt.title}</h6>
                                    <p className="text-xs text-text-muted">{opt.detail}</p>
                                    <Badge variant="outline" className="text-accent-gold border-accent-gold/30 text-[10px]">{opt.target}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="primary" className="w-full bg-accent-gold hover:bg-accent-gold/80 text-background-primary font-bold">
                            View Territory Map
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
