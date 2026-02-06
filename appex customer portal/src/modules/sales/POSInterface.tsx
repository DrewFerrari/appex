import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Package, X, CreditCard, Smartphone, Wallet, Minus, User, ShoppingCart } from 'lucide-react'
import { usePrice } from '@/hooks/usePrice'
import { generateReceiptNumber, getTotalStock } from '@/lib/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { CartItem, Product, Sale, Customer } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { CurrencySwitcher } from '@/components/shared/CurrencySwitcher'
import { ReceiptModal } from './ReceiptModal'

export default function POSInterface() {
  const { formatPrice, convert, activeCurrency } = usePrice()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'ecocash' | 'onemoney' | 'credit'>('cash')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const [lastSale, setLastSale] = useState<{
    receiptNumber: string,
    total: number,
    customerName?: string,
    customerId?: string,
    items: any[],
    createdAt: Date,
    paymentMethod: string
  } | null>(null)

  // Real data from IndexedDB
  const products = useLiveQuery(() => db.products.toArray()) || []
  const customers = useLiveQuery(() => db.customers.toArray()) || []

  const handleShareWhatsApp = async (receiptNumber: string, total: number, customerId?: string) => {
    const message = `Receipt from Appex Business: #${receiptNumber}\nTotal: ${formatPrice(total)}\nThank you for your business!`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')

    await db.communications.add({
      id: crypto.randomUUID(),
      customerId,
      type: 'whatsapp',
      content: message,
      status: 'sent',
      createdAt: new Date()
    })
  }

  const handleShareEmail = async (receiptNumber: string, total: number, customerId?: string) => {
    const subject = `Receipt #${receiptNumber}`
    const body = `Thank you for your business!\n\nReceipt Number: #${receiptNumber}\nTotal: ${formatPrice(total)}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    await db.communications.add({
      id: crypto.randomUUID(),
      customerId,
      type: 'email',
      content: body,
      status: 'sent',
      createdAt: new Date()
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId))
      return
    }

    setCart(prevCart => prevCart.map(item => {
      if (item.productId === productId) {
        const newTotalUSD = quantity * item.unitPriceUSD;
        return { ...item, quantity, totalUSD: newTotalUSD }
      }
      return item
    }))
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        const newTotalUSD = newQuantity * existingItem.unitPriceUSD
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity, totalUSD: newTotalUSD }
            : item
        )
      }

      return [...prevCart, {
        productId: product.id,
        quantity: 1,
        unitPriceUSD: product.sellingPriceUSD,
        totalUSD: product.sellingPriceUSD,
        product: product
      }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId))
  }

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + item.totalUSD, 0)
  const calculateVAT = () => calculateSubtotal() * 0.15
  const calculateTotal = () => calculateSubtotal() + calculateVAT()

  const handleCheckout = async () => {
    if (cart.length === 0) return

    if (selectedPaymentMethod === 'credit' && !selectedCustomerId) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for Store Credit payment.",
        variant: "destructive"
      })
      return
    }

    const receiptNumber = generateReceiptNumber()
    const subTotalUSD = calculateSubtotal()
    const vatAmountUSD = calculateVAT()
    const totalAmountUSD = calculateTotal()
    const totalAmountZiG = convert(totalAmountUSD)
    const saleId = crypto.randomUUID()

    const newSale: Sale = {
      id: saleId,
      businessId: 'offline-default',
      receiptNumber,
      cashierId: 'current-user-id',
      customerId: selectedCustomerId || undefined,
      subTotalUSD,
      vatAmountUSD,
      discountAmountUSD: 0,
      totalAmountUSD,
      totalAmountZiG: activeCurrency === 'ZiG' ? totalAmountZiG : undefined,
      paymentMethod: selectedPaymentMethod,
      isOffline: !navigator.onLine,
      status: 'completed',
      syncStatus: 'pending',
      createdAt: new Date(),
      items: cart.map(item => ({
        id: crypto.randomUUID(),
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceUSD: item.unitPriceUSD,
        unitPriceZiG: activeCurrency === 'ZiG' ? convert(item.unitPriceUSD) : undefined,
        totalUSD: item.totalUSD,
        totalZiG: activeCurrency === 'ZiG' ? convert(item.totalUSD) : undefined,
        discountAmountUSD: 0,
        createdAt: new Date()
      }))
    }

    try {
      await (db as any).transaction('rw', db.sales, db.products, db.customers, db.syncQueue, async () => {
        await db.sales.add(newSale)

        for (const item of cart) {
          const product = await db.products.get(item.productId)
          if (product && product.stockLevels && product.stockLevels.length > 0) {
            // Simplify: deduct from the first warehouse available
            const updatedStockLevels = [...product.stockLevels]
            updatedStockLevels[0] = {
              ...updatedStockLevels[0],
              quantity: Math.max(0, updatedStockLevels[0].quantity - item.quantity),
              updatedAt: new Date()
            }

            await db.products.update(item.productId, {
              stockLevels: updatedStockLevels,
              updatedAt: new Date()
            })
          }
        }

        if (selectedCustomerId) {
          const customer = await db.customers.get(selectedCustomerId)
          if (customer) {
            const loyaltyPointsEarned = Math.floor(totalAmountUSD / 10)
            const updates: any = {
              totalSpentUSD: (customer.totalSpentUSD || 0) + totalAmountUSD,
              lastPurchaseDate: new Date(),
              loyaltyPoints: (customer.loyaltyPoints || 0) + loyaltyPointsEarned,
              updatedAt: new Date()
            }
            if (selectedPaymentMethod === 'credit') {
              updates.currentBalanceUSD = (customer.currentBalanceUSD || 0) + totalAmountUSD
            }
            await db.customers.update(selectedCustomerId, updates)
            await db.syncQueue.add({
              id: crypto.randomUUID(),
              entityType: 'customer',
              entityId: selectedCustomerId,
              operation: 'update',
              data: updates,
              status: 'pending',
              retryCount: 0,
              createdAt: new Date()
            })
          }
        }

        await db.syncQueue.add({
          id: crypto.randomUUID(),
          entityType: 'sale',
          entityId: saleId,
          operation: 'create',
          data: newSale,
          status: 'pending',
          retryCount: 0,
          createdAt: new Date()
        })
      })

      setLastSale({
        receiptNumber,
        total: totalAmountUSD,
        customerName: customers?.find((c: Customer) => c.id === selectedCustomerId)?.name,
        customerId: selectedCustomerId || undefined,
        items: [...cart],
        createdAt: new Date(),
        paymentMethod: selectedPaymentMethod
      })

      setCart([])
      setSelectedCustomerId('')
      setSelectedPaymentMethod('cash')

      toast({
        title: "Sale Completed",
        description: `Receipt #${receiptNumber} generated.`,
      })

    } catch (error) {
      console.error("Sale processing failed", error)
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-hidden relative">
      {/* Products Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              POS <span className="text-accent-blue">Terminal</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <CurrencySwitcher />
              <div className="w-64">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default bg-background-secondary/50 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                >
                  <option value="">Guest Customer</option>
                  {customers.map((customer: Customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-4">
            {filteredProducts.map((product: Product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex flex-col h-full">
                  <div className="aspect-square bg-background-tertiary rounded-lg mb-2 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-text-muted" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <h3 className="font-medium text-text-primary text-xs truncate" title={product.name}>{product.name}</h3>
                    <p className="text-[10px] text-text-muted mb-1">{product.sku}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-text-primary">
                        {formatPrice(product.sellingPriceUSD)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() => addToCart(product)}
                      disabled={getTotalStock(product) === 0}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-text-muted">
                <Package className="h-12 w-12 mb-2 opacity-50" />
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section - Tablet/Desktop View */}
      <div className="hidden md:flex w-96 bg-background-secondary border border-background-tertiary rounded-lg flex-col shrink-0 h-full overflow-hidden">
        <CartContentUI
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          calculateSubtotal={calculateSubtotal}
          calculateVAT={calculateVAT}
          calculateTotal={calculateTotal}
          formatPrice={formatPrice}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          handleCheckout={handleCheckout}
        />
      </div>

      {/* Mobile Cart FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full h-16 w-16 shadow-2xl relative"
          onClick={() => setIsMobileCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 h-6 w-6 bg-status-error text-white text-xs rounded-full flex items-center justify-center border-2 border-background-primary font-bold">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Cart Overlay */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex flex-col">
          <div className="mt-auto bg-background-secondary rounded-t-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-background-tertiary flex justify-between items-center">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileCartOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1">
              <CartContentUI
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                calculateSubtotal={calculateSubtotal}
                calculateVAT={calculateVAT}
                calculateTotal={calculateTotal}
                formatPrice={formatPrice}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                handleCheckout={() => {
                  handleCheckout();
                  setIsMobileCartOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <ReceiptModal
        isOpen={!!lastSale}
        onClose={() => setLastSale(null)}
        sale={lastSale}
        onShareWhatsApp={() => lastSale && handleShareWhatsApp(lastSale.receiptNumber, lastSale.total, lastSale.customerId)}
        onShareEmail={() => lastSale && handleShareEmail(lastSale.receiptNumber, lastSale.total, lastSale.customerId)}
      />
    </div>
  )
}

function CartContentUI({
  cart, updateQuantity, removeFromCart, calculateSubtotal,
  calculateVAT, calculateTotal, formatPrice, selectedPaymentMethod,
  setSelectedPaymentMethod, handleCheckout
}: any) {
  return (
    <div className="flex flex-col h-full bg-background-secondary p-4">
      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
        <Wallet className="w-5 h-5 mr-2" />
        Shopping Cart
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin">
        {cart.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center h-full">
            <Package className="h-12 w-12 text-text-muted mb-2 opacity-50" />
            <p className="text-text-muted">Cart is empty</p>
          </div>
        ) : (
          cart.map((item: any) => (
            <div key={item.productId} className="bg-background-primary rounded-lg p-3 shadow-sm border border-background-tertiary">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-text-primary text-sm line-clamp-2">{item.product.name}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-text-muted hover:text-status-error"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">
                    {formatPrice(item.totalUSD)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-background-tertiary pt-4 space-y-2">
        <div className="flex justify-between text-sm italic">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text-primary">{formatPrice(calculateSubtotal())}</span>
        </div>
        <div className="flex justify-between text-sm italic">
          <span className="text-text-muted">VAT (15%)</span>
          <span className="text-text-primary">{formatPrice(calculateVAT())}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-dashed border-background-tertiary pt-2 mt-2">
          <span className="text-text-primary">Total</span>
          <span className="text-text-primary">{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase text-text-muted">Payment Method</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedPaymentMethod === 'cash' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPaymentMethod('cash')}
            className="flex flex-col h-14 py-2"
          >
            <Wallet className="h-4 w-4 mb-1" />
            <span className="text-xs">Cash</span>
          </Button>
          <Button
            variant={selectedPaymentMethod === 'ecocash' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPaymentMethod('ecocash')}
            className="flex flex-col h-14 py-2"
          >
            <Smartphone className="h-4 w-4 mb-1" />
            <span className="text-xs">EcoCash</span>
          </Button>
          <Button
            variant={selectedPaymentMethod === 'onemoney' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPaymentMethod('onemoney')}
            className="flex flex-col h-14 py-2"
          >
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">OneMoney</span>
          </Button>
          <Button
            variant={selectedPaymentMethod === 'credit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPaymentMethod('credit')}
            className="flex flex-col h-14 py-2"
          >
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs">Credit</span>
          </Button>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        size="lg"
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        Complete Sale
      </Button>
    </div>
  )
}
