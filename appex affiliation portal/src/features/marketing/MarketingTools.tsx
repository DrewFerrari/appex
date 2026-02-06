import {
    Link as LinkIcon,
    Image as ImageIcon,
    Plus,
    Copy,
    QrCode,
    Share2,
    MoreVertical,
    Download,
    Eye,
    Mail,
    Video,
    Facebook,
    Instagram,
    Rocket
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { cn } from "../../utils/cn"

export default function MarketingTools() {
    const [activeTab, setActiveTab] = useState<'links' | 'assets' | 'campaigns'>('links')

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Marketing Tools</h1>
                    <p className="text-text-muted mt-1">Access high-converting assets and track your link performance</p>
                </div>
                <div className="flex bg-background-secondary p-1 rounded-lg border border-border-default">
                    {[
                        { id: 'links', label: 'Links', icon: <LinkIcon size={16} /> },
                        { id: 'assets', label: 'Assets', icon: <ImageIcon size={16} /> },
                        { id: 'campaigns', label: 'Campaigns', icon: <Rocket size={16} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-accent-blue text-text-primary shadow-sm"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {activeTab === 'links' && (
                <div className="space-y-8">
                    {/* Link Generator */}
                    <Card className="border-accent-blue/20">
                        <CardHeader>
                            <CardTitle>Link Generator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Campaign Name</label>
                                        <Input placeholder="e.g. Instagram Bio Link Feb 2026" className="bg-background-tertiary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Target Page</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {['Homepage', 'Pricing', 'Features', 'Free Trial'].map(p => (
                                                <button key={p} className="text-left px-3 py-2 rounded-lg border border-border-default text-xs hover:bg-background-tertiary transition-colors">
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Custom Slug (Optional)</label>
                                        <div className="flex items-center">
                                            <span className="px-3 py-2 bg-background-tertiary border border-r-0 border-border-default rounded-l-md text-xs text-text-muted">appex.af/</span>
                                            <Input placeholder="sarah-special" className="rounded-l-none bg-background-tertiary" />
                                        </div>
                                    </div>
                                    <Button className="w-full">Generate Link</Button>
                                </div>

                                <div className="p-6 rounded-xl bg-background-tertiary border border-border-default flex flex-col justify-center items-center text-center space-y-4">
                                    <div className="h-40 w-40 bg-white p-2 rounded-lg">
                                        {/* Placeholder for QR Code */}
                                        <QrCode size={144} className="text-background-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary">appex.af/sarah-instagram</p>
                                        <p className="text-xs text-text-muted mt-1 underline">https://appex.com/signup?ref=tendai-99&utm_source=instagram</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm"><Copy size={14} className="mr-2" /> Copy</Button>
                                        <Button variant="outline" size="sm"><Download size={14} className="mr-2" /> QR</Button>
                                        <Button variant="outline" size="sm"><Share2 size={14} className="mr-2" /> Share</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Link Library */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="group hover:border-accent-blue/30 transition-all">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="success" className="bg-status-successBg text-status-success border-status-success/10">Active</Badge>
                                        <Button variant="ghost" size="icon" className="text-text-muted"><MoreVertical size={16} /></Button>
                                    </div>
                                    <h4 className="font-bold text-text-primary mb-1">Instagram Bio Link</h4>
                                    <p className="text-xs text-text-muted mb-4 font-mono">appex.af/sarah-insta</p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-default">
                                        <div>
                                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Clicks</p>
                                            <p className="text-lg font-bold text-text-primary">1,248</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Earnings</p>
                                            <p className="text-lg font-bold text-accent-green">$630.00</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'assets' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-4 custom-scrollbar">
                        {['All Assets', 'Banners', 'Social Media', 'Email Templates', 'Videos', 'Logos'].map((cat, i) => (
                            <Button key={cat} variant={i === 0 ? 'primary' : 'outline'} size="sm" className="whitespace-nowrap px-6">
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[
                            { type: 'Banner', size: '728x90', title: 'January Promo Banner', icon: <ImageIcon /> },
                            { type: 'Social', size: '1080x1080', title: 'Instagram Square - POS', icon: <Instagram /> },
                            { type: 'Email', size: 'Template', title: 'Welcome Sequence #1', icon: <Mail /> },
                            { type: 'Video', size: '2:30', title: 'Appex Product Demo', icon: <Video /> },
                            { type: 'Banner', size: '300x250', title: 'Sidebar Promo', icon: <ImageIcon /> },
                            { type: 'Social', size: '1200x628', title: 'Facebook Link Post', icon: <Facebook /> },
                            { type: 'Logo', size: 'PNG/SVG', title: 'Main Appex Logo', icon: <ImageIcon /> },
                            { type: 'Social', size: '1080x1920', title: 'Instagram Story', icon: <Instagram /> },
                        ].map((asset, i) => (
                            <Card key={i} className="overflow-hidden group">
                                <div className="h-40 bg-background-tertiary flex items-center justify-center relative overflow-hidden">
                                    <div className="text-text-disabled group-hover:scale-110 transition-transform duration-500">
                                        {asset.icon}
                                    </div>
                                    <div className="absolute inset-0 bg-background-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                        <Button variant="primary" size="sm" className="h-8"><Download size={14} className="mr-2" /> Get</Button>
                                        <Button variant="secondary" size="sm" className="h-8"><Eye size={14} /></Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-[10px] text-accent-blue font-bold uppercase tracking-widest">{asset.type} • {asset.size}</p>
                                    <h5 className="text-sm font-bold text-text-primary mt-1 line-clamp-1">{asset.title}</h5>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'campaigns' && (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                    <Card className="bg-gradient-to-br from-background-secondary to-background-tertiary border-accent-blue/30 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-accent-blue/5 rounded-full blur-3xl" />
                        <CardContent className="pt-8 pb-12 text-center max-w-2xl mx-auto space-y-6">
                            <div className="h-16 w-16 rounded-full bg-status-infoBg flex items-center justify-center mx-auto text-accent-blue mb-4">
                                <Rocket size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-text-primary">Create Your First Campaign</h2>
                            <p className="text-text-muted">
                                Group your links, assets, and follow-up emails into a single campaign to track multi-channel performance and automate your nurture sequence.
                            </p>
                            <div className="flex items-center justify-center space-x-4 pt-4">
                                <Button size="lg" className="px-12">Start Campaign Wizard</Button>
                                <Button variant="ghost">Learn More About Campaigns</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader pb-2>
                                <CardTitle className="text-lg">Active Automated Sequences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: 'Trial User Nurture', trigger: 'User starts free trial', steps: 4, ctr: '18%' },
                                    { name: 'Cold Lead Re-engagement', trigger: 'No activity for 30 days', steps: 2, ctr: '5%' }
                                ].map((seq, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background-tertiary border border-border-default">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-status-infoBg text-accent-blue flex items-center justify-center">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{seq.name}</p>
                                                <p className="text-xs text-text-muted">{seq.trigger}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-text-primary">{seq.steps} STEPS</p>
                                            <p className="text-xs text-status-success">{seq.ctr} CTR</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full text-xs">Manage All Sequences</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader pb-2>
                                <CardTitle className="text-lg">Conversion Performance by Channel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                {[
                                    { name: 'WhatsApp', value: 85, color: '#10b981' },
                                    { name: 'Facebook', value: 62, color: '#3b82f6' },
                                    { name: 'Instagram', value: 45, color: '#8b5cf6' },
                                    { name: 'Email', value: 28, color: '#f59e0b' },
                                ].map((channel, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-text-primary uppercase tracking-widest">{channel.name}</span>
                                            <span className="text-text-muted">{channel.value}% OF QUOTA</span>
                                        </div>
                                        <div className="h-2 w-full bg-background-tertiary rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-1000" style={{ backgroundColor: channel.color, width: `${channel.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
