import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Printer, Smartphone, Mail, CheckCircle2 } from 'lucide-react'
import { usePrice } from '@/hooks/usePrice'

interface ReceiptModalProps {
    isOpen: boolean
    onClose: () => void
    sale: {
        receiptNumber: string
        total: number
        customerId?: string
        customerName?: string
        items: any[]
        createdAt: Date
        paymentMethod: string
    } | null
    onShareWhatsApp: () => void
    onShareEmail: () => void
}

export function ReceiptModal({ isOpen, onClose, sale, onShareWhatsApp, onShareEmail }: ReceiptModalProps) {
    const { formatPrice } = usePrice()
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!isOpen || !sale) return null

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-background-primary rounded-2xl shadow-2xl overflow-hidden border border-border-default/50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-border-default flex items-center justify-between bg-background-secondary/50">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-status-success" />
                        <h2 className="text-lg font-bold text-white">Transaction Success</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Digital Receipt View */}
                    <div
                        ref={receiptRef}
                        className="bg-white text-gray-900 rounded-xl p-8 shadow-inner relative overflow-hidden"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue" />
                        <div className="absolute top-4 right-4 text-[10px] font-bold text-accent-blue/20 rotate-12 select-none uppercase pointer-events-none">
                            Appex Digital Receipt
                        </div>

                        {/* Business Info */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-black tracking-tighter text-black">APPEX<span className="text-accent-blue">.</span></h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Business Management Suite</p>
                            <div className="mt-4 text-[10px] text-gray-400 font-mono">
                                {new Date(sale.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {/* Receipt Metadata */}
                        <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-4 mb-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Receipt No.</p>
                                <p className="text-sm font-mono font-bold">#{sale.receiptNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Payment</p>
                                <p className="text-sm font-bold uppercase">{sale.paymentMethod}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        {sale.customerName && (
                            <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Billed To</p>
                                <p className="text-sm font-bold">{sale.customerName}</p>
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                <span>Description</span>
                                <span>Total</span>
                            </div>
                            <div className="space-y-2">
                                {sale.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-tight">{item.product?.name || 'Unknown Product'}</p>
                                            <p className="text-[10px] text-gray-500">
                                                {item.quantity} x {formatPrice(item.unitPriceUSD)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold">{formatPrice(item.totalUSD)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="border-t-2 border-gray-900 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">{formatPrice(sale.total * 0.85)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">VAT (15%)</span>
                                <span className="font-medium">{formatPrice(sale.total * 0.15)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black mt-2 pt-2 border-t border-gray-100">
                                <span>TOTAL</span>
                                <span className="text-accent-blue">{formatPrice(sale.total)}</span>
                            </div>
                        </div>

                        {/* Footer Message */}
                        <div className="mt-10 text-center">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] mb-2">Thank you for your business</p>
                            <div className="flex justify-center gap-1 opacity-20">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-1 h-3 bg-black rounded-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-border-default bg-background-secondary/50 grid grid-cols-2 gap-3">
                    <Button
                        className="col-span-2 group"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        Print physical receipt
                    </Button>

                    <Button
                        variant="outline"
                        className="flex flex-col h-16 py-2 border-white/10 hover:bg-status-success/10 hover:border-status-success/50 transition-all"
                        onClick={onShareWhatsApp}
                    >
                        <Smartphone className="h-5 w-5 mb-1 text-status-success" />
                        <span className="text-[10px] uppercase font-bold">WhatsApp</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex flex-col h-16 py-2 border-white/10 hover:bg-accent-blue/10 hover:border-accent-blue/50 transition-all"
                        onClick={onShareEmail}
                    >
                        <Mail className="h-5 w-5 mb-1 text-accent-blue" />
                        <span className="text-[10px] uppercase font-bold">Email Receipt</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="col-span-2 text-text-muted hover:text-white mt-2"
                        onClick={onClose}
                    >
                        Start New Transaction
                    </Button>
                </div>
            </div>
        </div>
    )
}
