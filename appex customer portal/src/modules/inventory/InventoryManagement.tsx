import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Package, Edit, Trash2, Barcode, X, RefreshCw, Bell } from 'lucide-react'
import { usePrice } from '@/hooks/usePrice'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { Product } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { getTotalStock, isLowStock } from '@/lib/utils'

export default function InventoryManagement() {
  const { formatPrice } = usePrice()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustQuantity, setAdjustQuantity] = useState(1)
  const [adjustMode, setAdjustMode] = useState<'add' | 'remove'>('add')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [adjustReason, setAdjustReason] = useState('Restock')

  // Real data from IndexedDB
  const products = useLiveQuery(() => db.products.toArray()) || []
  const warehouses = useLiveQuery(() => db.warehouses.toArray()) || []

  // Derived state
  const categories = ['all', ...Array.from(new Set(products.map((p: Product) => p.categoryId || 'Uncategorized')))]

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery)
    // Handle optional category
    const productCategory = product.categoryId || 'Uncategorized'
    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (stock: number, reorderLevel: number = 10) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'text-status-error' }
    if (stock <= reorderLevel) return { status: 'Low Stock', color: 'text-status-warning' }
    return { status: 'In Stock', color: 'text-status-success' }
  }

  const calculateProfit = (price: number, cost: number) => {
    if (cost === 0) return 100
    return ((price - cost) / cost) * 100
  }

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newProduct: Product = {
      id: crypto.randomUUID(),
      businessId: 'offline-default', // Default for offline mode
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      barcode: formData.get('barcode') as string || undefined,
      categoryId: formData.get('category') as string,
      costPriceUSD: parseFloat(formData.get('cost') as string),
      sellingPriceUSD: parseFloat(formData.get('price') as string),
      reorderLevel: 10,
      isActive: true,
      images: [],
      attributes: {},
      stockLevels: warehouses.length > 0 ? [{
        warehouseId: warehouses[0].id,
        quantity: parseInt(formData.get('stock') as string),
        updatedAt: new Date()
      }] : [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      await db.products.add(newProduct)

      // Add to sync queue
      await db.syncQueue.add({
        id: crypto.randomUUID(),
        entityType: 'product',
        entityId: newProduct.id,
        operation: 'create',
        data: newProduct,
        status: 'pending',
        retryCount: 0,
        createdAt: new Date()
      })

      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to inventory.`,
      })

      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add product:', error)
      toast({
        title: "Error",
        description: "Failed to add product. SKU/Barcode must be unique.",
        variant: "destructive"
      })
    }
  }

  const handleAdjustStock = async () => {
    if (!selectedProduct) return

    const adjustment = adjustMode === 'add' ? adjustQuantity : -adjustQuantity

    try {
      if (!selectedProduct.stockLevels || selectedProduct.stockLevels.length === 0) {
        // If no levels exist, create one assuming a default warehouse
        const defaultWarehouse = warehouses[0]?.id || 'default'
        const newLevels = [{
          warehouseId: defaultWarehouse,
          quantity: Math.max(0, adjustment),
          updatedAt: new Date()
        }]
        await db.products.update(selectedProduct.id, {
          stockLevels: newLevels,
          updatedAt: new Date()
        })
      } else {
        // Deduct/Add from the first location for now (simplified)
        const updatedLevels = [...selectedProduct.stockLevels]
        updatedLevels[0] = {
          ...updatedLevels[0],
          quantity: Math.max(0, updatedLevels[0].quantity + adjustment),
          updatedAt: new Date()
        }
        await db.products.update(selectedProduct.id, {
          stockLevels: updatedLevels,
          updatedAt: new Date()
        })
      }

      const postAdjustmentStock = getTotalStock(await db.products.get(selectedProduct.id) || selectedProduct)

      // Sync queue entry for update
      await db.syncQueue.add({
        id: crypto.randomUUID(),
        entityType: 'product',
        entityId: selectedProduct.id,
        operation: 'update',
        data: { stockLevels: (await db.products.get(selectedProduct.id))?.stockLevels, updatedAt: new Date() },
        status: 'pending',
        retryCount: 0,
        createdAt: new Date()
      })

      toast({
        title: "Stock Adjusted",
        description: `${selectedProduct.name} stock updated to ${postAdjustmentStock} (${adjustReason}).`,
      })

      setIsAdjustModalOpen(false)
      setSelectedProduct(null)
      setAdjustQuantity(1)
    } catch (error) {
      console.error('Failed to adjust stock:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await db.products.delete(id)

      // Add to sync queue
      await db.syncQueue.add({
        id: crypto.randomUUID(),
        entityType: 'product',
        entityId: id,
        operation: 'delete',
        data: {},
        status: 'pending',
        retryCount: 0,
        createdAt: new Date()
      })

      toast({
        title: "Product Deleted",
        description: "The product has been removed.",
      })
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <div className="p-6 space-y-6 relative">
      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background-primary shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-background-tertiary">
              <CardTitle>Add New Product</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input name="name" required placeholder="Product name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU</label>
                    <Input name="sku" required placeholder="SKU-001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input name="category" placeholder="e.g. Beverages" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cost (USD)</label>
                    <Input name="cost" type="number" step="0.01" required placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input name="price" type="number" step="0.01" required placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Stock</label>
                    <Input name="stock" type="number" required placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Barcode (Optional)</label>
                    <Input name="barcode" placeholder="Scan..." />
                  </div>
                </div>
                <div className="pt-4 flex space-x-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Save Product</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background-primary shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-background-tertiary">
              <CardTitle>Adjust Stock: {selectedProduct.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsAdjustModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex bg-background-tertiary p-1 rounded-md">
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded ${adjustMode === 'add' ? 'bg-background-primary shadow-sm text-accent-blue' : 'text-text-muted'}`}
                  onClick={() => setAdjustMode('add')}
                >
                  Add Items
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded ${adjustMode === 'remove' ? 'bg-background-primary shadow-sm text-status-error' : 'text-text-muted'}`}
                  onClick={() => setAdjustMode('remove')}
                >
                  Remove Items
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  <option value="Restock">New Stock Arrivals</option>
                  <option value="Damage">Damaged Goods</option>
                  <option value="Return">Customer Return</option>
                  <option value="Correction">Inventory Correction</option>
                  <option value="Expiry">Expired Items</option>
                </select>
              </div>

              <div className="pt-4 flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
                <Button
                  className={`flex-1 ${adjustMode === 'add' ? 'bg-accent-blue' : 'bg-status-error hover:bg-status-error/90'}`}
                  onClick={handleAdjustStock}
                >
                  Confirm Adjustment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Inventory Management</h1>
          <p className="text-text-muted">
            Manage your products, stock levels, and suppliers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stock Alerts Widget */}
      {products.some(isLowStock) && (
        <Card className="border-status-error/30 bg-status-error/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center text-status-error">
              <Bell className="h-4 w-4 mr-2" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs">
              {products.filter(isLowStock).slice(0, 5).map(p => (
                <div key={p.id} className="bg-background-primary border border-status-error/20 px-3 py-1.5 rounded-full flex items-center">
                  <span className="font-semibold mr-2">{p.name}</span>
                  <span className="text-status-error">{getTotalStock(p) === 0 ? 'Out of Stock' : `Low (${getTotalStock(p)})`}</span>
                </div>
              ))}
              {products.filter(isLowStock).length > 5 && (
                <span className="text-text-muted self-center ml-2">+{products.filter(isLowStock).length - 5} more items</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-accent-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Products</p>
                <p className="text-2xl font-bold text-text-primary">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-status-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">In Stock</p>
                <p className="text-2xl font-bold text-text-primary">
                  {products.filter((p: Product) => getTotalStock(p) > 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-status-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Low Stock</p>
                <p className="text-2xl font-bold text-text-primary">
                  {products.filter((p: Product) => {
                    const stock = getTotalStock(p);
                    return stock > 0 && stock <= 10;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-status-error" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Out of Stock</p>
                <p className="text-2xl font-bold text-text-primary">
                  {products.filter((p: Product) => getTotalStock(p) === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search products by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            title="Scan barcode"
          >
            <Barcode className="h-4 w-4" />
          </Button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background-tertiary border border-background-tertiary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-background-tertiary border border-background-tertiary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="all">All Locations</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-background-tertiary">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Profit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product: Product) => {
                  const totalStock = getTotalStock(product)
                  const displayStock = selectedWarehouse === 'all'
                    ? totalStock
                    : (product.stockLevels?.find(l => l.warehouseId === selectedWarehouse)?.quantity || 0)

                  const stockStatus = getStockStatus(displayStock, product.reorderLevel)
                  const profit = calculateProfit(product.sellingPriceUSD, product.costPriceUSD)

                  return (
                    <tr key={product.id} className="border-b border-background-tertiary hover:bg-background-tertiary/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-text-primary">{product.name}</p>
                          <p className="text-xs text-text-muted">{product.categoryId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">{product.sku}</td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {formatPrice(product.sellingPriceUSD)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {formatPrice(product.costPriceUSD)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <span className={displayStock <= product.reorderLevel ? 'text-status-warning font-bold' : ''}>
                          {displayStock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-medium ${profit >= 20 ? 'text-status-success' : profit >= 0 ? 'text-text-primary' : 'text-status-error'}`}>
                          {profit.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-accent-blue"
                            title="Adjust Stock"
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsAdjustModalOpen(true)
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-status-error"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted">No products found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
