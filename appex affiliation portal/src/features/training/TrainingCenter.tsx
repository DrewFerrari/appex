import {
    Play,
    FileText,
    Award,
    Download,
    Clock,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"

export default function TrainingCenter() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Training Center</h1>
                    <p className="text-text-muted mt-1">Master the Appex POS system and boost your commissions</p>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                    <div className="text-right mr-4 hidden sm:block">
                        <p className="text-text-muted">Your Progress</p>
                        <p className="font-bold text-text-primary text-lg">65%</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background-secondary border-4 border-accent-blue border-r-background-tertiary flex items-center justify-center font-bold text-accent-blue">
                        65%
                    </div>
                </div>
            </section>

            {/* Featured Course */}
            <Card className="bg-gradient-to-br from-background-secondary via-background-secondary to-accent-blue/5 border-accent-blue/20">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 space-y-6">
                        <Badge variant="success" className="bg-status-successBg text-status-success">Next Lesson: Module 4</Badge>
                        <h2 className="text-3xl font-bold text-text-primary leading-tight">Closing Enterprise Deals for Appex Retail</h2>
                        <p className="text-text-muted text-lg">
                            Learn the advanced sales strategies used by top Zimbabwe partners to secure multi-store retail contracts.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            {[
                                { icon: <Clock size={16} />, label: '45 mins left' },
                                { icon: <BookOpen size={16} />, label: '8 Lessons' },
                                { icon: <Award size={16} />, label: 'Certificate' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center text-sm text-text-muted">
                                    <span className="text-accent-blue mr-2">{item.icon}</span>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-4">
                            <Button size="lg" className="px-8"><Play size={18} className="mr-2 fill-current" /> Resume Now</Button>
                            <Button variant="outline" size="lg">Module Details</Button>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center justify-center p-8 bg-background-tertiary/30 rounded-r-xl border-l border-border-default/50">
                        <div className="relative group cursor-pointer">
                            <div className="h-64 w-96 rounded-xl bg-background-primary overflow-hidden border border-border-default shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" alt="Retail Training" className="h-full w-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-full bg-accent-blue/90 text-text-primary flex items-center justify-center shadow-lg group-hover:bg-accent-blue transition-colors">
                                        <Play size={24} className="fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-background-secondary p-4 rounded-lg border border-border-default shadow-xl animate-bounce-slow">
                                <div className="flex items-center space-x-3">
                                    <div className="h-2 w-2 rounded-full bg-accent-green" />
                                    <p className="text-xs font-bold text-text-primary">1,240 Partners reached Platinum via this course</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Course Library */}
                {[
                    { title: 'Intro to SaaS Sales', desc: 'The fundamentals of selling Appex POS in Zimbabwe.', category: 'Basics', time: '2h 15m', level: 'Beginner', status: 'completed' },
                    { title: 'POS Hardware Setup', desc: 'A-Z guide on printer and scanner integration.', category: 'Technical', time: '1h 45m', level: 'Intermediate', status: 'lock' },
                    { title: 'Inventory Mastery', desc: 'How to pitch advanced inventory features.', category: 'Product', time: '3h 30m', level: 'Advanced', status: 'lock' },
                ].map((course, i) => (
                    <Card key={i} className="group hover:border-accent-blue/30 transition-all flex flex-col">
                        <CardHeader pb-2>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{course.category}</Badge>
                                {course.status === 'completed' && <CheckCircle2 className="text-accent-green" size={20} />}
                            </div>
                            <CardTitle className="group-hover:text-accent-blue transition-colors">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <CardDescription>{course.desc}</CardDescription>
                            <div className="flex items-center justify-between pt-4 border-t border-border-default text-xs text-text-muted">
                                <div className="flex items-center"><Clock size={12} className="mr-1" /> {course.time}</div>
                                <div className="flex items-center"><Zap size={12} className="mr-1 text-accent-gold" /> {course.level}</div>
                            </div>
                            <Button variant={course.status === 'completed' ? 'outline' : 'primary'} className="w-full">
                                {course.status === 'completed' ? 'Review Content' : 'Start Course'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Certification Center */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Certification Center</CardTitle>
                        <CardDescription>Earn badges to display on your profile and increase your tier status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { name: 'Appex Sales Pro', status: 'Earned', date: 'Jan 2026', icon: <Award className="text-accent-gold" /> },
                                { name: 'Technical Architect', status: 'In Progress', date: '60%', icon: <Award className="text-text-disabled" /> },
                                { name: 'Customer Success Star', status: 'Not Started', date: '-', icon: <Award className="text-text-disabled" /> },
                                { name: 'Market Expert (Zim)', status: 'Earned', date: 'Dec 2025', icon: <Award className="text-accent-blue" /> },
                            ].map((cert, i) => (
                                <div key={i} className="flex items-center p-4 rounded-xl bg-background-tertiary border border-border-default hover:border-accent-blue/20 transition-colors cursor-pointer">
                                    <div className="h-12 w-12 rounded-full bg-background-primary flex items-center justify-center mr-4 border border-border-default">
                                        {cert.icon}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-text-primary text-sm">{cert.name}</h5>
                                        <p className="text-xs text-text-muted">{cert.status} • {cert.date}</p>
                                    </div>
                                    <ChevronRight size={16} className="ml-auto text-text-disabled" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Resources & Assets */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: 'Product Comparison Sheet', type: 'PDF', size: '2.4 MB' },
                            { name: 'Objection Handling Guide', type: 'DOCX', size: '1.1 MB' },
                            { name: 'Appex Pitch Deck 2026', type: 'PPTX', size: '8.2 MB' },
                            { name: 'Case Study: Hardware Stores', type: 'PDF', size: '3.5 MB' },
                        ].map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-background-tertiary transition-colors group cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <FileText className="text-text-muted group-hover:text-accent-blue transition-colors" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                        <p className="text-[10px] text-text-muted font-bold uppercase">{file.type} • {file.size}</p>
                                    </div>
                                </div>
                                <Download size={14} className="text-text-disabled group-hover:text-text-primary transition-colors" />
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs text-accent-blue">View Documentation Hub</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Community / Mentor Section */}
            <Card className="bg-status-infoBg border-accent-blue/10">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-4 overflow-hidden">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-background-secondary" src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                                ))}
                            </div >
                            <div>
                                <h4 className="font-bold text-text-primary">Join the Partner Community</h4>
                                <p className="text-sm text-text-muted">Connect with 30,000+ active Zimbabwe partners.</p>
                            </div>
                        </div >
                        <div className="flex space-x-3">
                            <Button variant="primary">Join Discord</Button>
                            <Button variant="outline">WhatsApp Group</Button>
                        </div>
                    </div >
                </CardContent >
            </Card >
        </div >
    )
}
