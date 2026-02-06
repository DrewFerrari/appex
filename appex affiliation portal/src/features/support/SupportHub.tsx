import {
    MessageSquare,
    Search,
    FileText,
    ExternalLink,
    HelpCircle,
    Mail,
    Phone,
    MessageCircle,
    Clock,
    CheckCircle2,
    ChevronRight,
    LifeBuoy,
    Plus,
    Zap,
    DollarSign,
    Users,
    Code2 as Code,
    Shield
} from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { cn } from "../../utils/cn"

export default function SupportHub() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="text-center max-w-3xl mx-auto space-y-6 pt-12 pb-8">
                <h1 className="text-4xl font-black text-text-primary tracking-tight">How can we help you?</h1>
                <p className="text-lg text-text-muted italic">Our dedicated support team is available 24/7 for you.</p>
                <div className="relative max-w-xl mx-auto group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-blue transition-colors" />
                    <Input
                        placeholder="Search help articles, tutorials, or FAQs..."
                        className="pl-12 h-14 text-lg bg-background-secondary border-2 border-border-default focus:border-accent-blue transition-all shadow-xl"
                    />
                </div>
            </section>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <MessageSquare size={24} />, title: 'Live Chat', desc: 'Average wait: 2 mins', color: 'text-accent-blue', action: 'Start Chat' },
                    { icon: <Mail size={24} />, title: 'Email Support', desc: 'Response in 4 hours', color: 'text-accent-purple', action: 'Send Email' },
                    { icon: <MessageCircle size={24} />, title: 'WhatsApp', desc: 'Instant support bot', color: 'text-accent-green', action: 'Open WhatsApp' },
                    { icon: <Phone size={24} />, title: 'Hotline', desc: 'Mon-Fri, 8am - 5pm', color: 'text-accent-gold', action: 'Call Now' },
                ].map((item, i) => (
                    <Card key={i} className="group hover:-translate-y-1 transition-transform cursor-pointer">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <div className={cn("p-4 rounded-full bg-background-tertiary mb-4", item.color)}>
                                {item.icon}
                            </div>
                            <h4 className="font-bold text-text-primary mb-1">{item.title}</h4>
                            <p className="text-xs text-text-muted mb-6">{item.desc}</p>
                            <Button variant="ghost" size="sm" className="w-full text-xs group-hover:bg-accent-blue group-hover:text-text-primary transition-all">
                                {item.action}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                {/* Help Center Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-text-primary flex items-center">
                        <HelpCircle className="mr-2 text-accent-blue" /> Browse by Topic
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: 'Getting Started', articles: 12, icon: <Zap /> },
                            { title: 'Commission & Payouts', articles: 24, icon: <DollarSign /> },
                            { title: 'Lead Generation', articles: 18, icon: <Users /> },
                            { title: 'Technical Integration', articles: 15, icon: <Code /> },
                            { title: 'Partner Agreement', articles: 8, icon: <FileText /> },
                            { title: 'Account Security', articles: 6, icon: <Shield /> },
                        ].map((topic, i) => (
                            <div key={i} className="p-4 rounded-xl bg-background-secondary border border-border-default hover:border-accent-blue/30 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-lg bg-background-tertiary flex items-center justify-center text-text-muted group-hover:text-accent-blue transition-colors">
                                            {topic.icon}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-text-primary group-hover:text-accent-blue transition-colors">{topic.title}</h5>
                                            <p className="text-[10px] text-text-muted uppercase font-bold">{topic.articles} Articles</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-text-disabled group-hover:text-text-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <h3 className="text-xl font-bold text-text-primary flex items-center mb-6">
                            <CheckCircle2 className="mr-2 text-accent-green" /> Recently Added Articles
                        </h3>
                        <div className="space-y-3">
                            {[
                                'How to set up EcoCash payouts for Zimbabwean partners',
                                'Understanding the multi-tier commission structure',
                                'Best practices for retail hardware demonstrations',
                                'Reporting fraudulent lead claims',
                                'Troubleshooting printer connectivity issues'
                            ].map((article, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background-tertiary/50 border border-transparent hover:border-border-default hover:bg-background-tertiary transition-all cursor-pointer group">
                                    <div className="flex items-center space-x-3">
                                        <FileText size={16} className="text-text-muted group-hover:text-accent-blue" />
                                        <span className="text-sm text-text-primary font-medium">{article}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-text-disabled group-hover:text-text-primary" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Existing Tickets */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-text-primary">My Tickets</h3>
                        <Button size="sm" variant="outline"><Plus size={14} className="mr-2" /> New Ticket</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: '#TK-84920', subject: 'Payout delays with OneMoney', status: 'Pending', statusVar: 'warning', date: '2 hours ago' },
                            { id: '#TK-84815', subject: 'Account verification documents', status: 'Solved', statusVar: 'success', date: 'Yesterday' },
                            { id: '#TK-84702', subject: 'Custom landing page request', status: 'Closed', statusVar: 'secondary', date: '3 days ago' },
                        ].map((ticket, i) => (
                            <Card key={i} className="hover:border-accent-blue/30 transition-all cursor-pointer group">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-tighter">{ticket.id}</span>
                                        <Badge variant={ticket.statusVar as any} className="text-[10px] py-0 px-2">{ticket.status}</Badge>
                                    </div>
                                    <p className="text-sm font-bold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">{ticket.subject}</p>
                                    <p className="text-[10px] text-text-muted flex items-center">
                                        <Clock size={10} className="mr-1" /> Updated {ticket.date}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-accent-blue/30 mt-8">
                        <CardContent className="p-6 text-center space-y-4">
                            <LifeBuoy size={32} className="mx-auto text-accent-blue animate-pulse" />
                            <h4 className="font-bold text-text-primary font-serif">A.I. Support Assistant</h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Connect with our AI to solve technical issues 10x faster using our local knowledge base.
                            </p>
                            <Button variant="primary" size="sm" className="w-full">Launch AI Helper</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// End of SupportHub
