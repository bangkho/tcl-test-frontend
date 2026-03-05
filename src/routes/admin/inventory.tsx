import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, Package, AlertTriangle, Edit, Trash2, Search, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Modal } from '../../components/ui/Modal'
import type { Product, ProductFormData, TransactionItemInput } from '../../modules/inventory/inventoryModel'
import { inventoryService } from '../../modules/inventory/inventoryService'
import { customerService } from '../../modules/customer/customerService'
import type { Customer } from '../../modules/customer/customerModel'
import { transactionService } from '../../modules/transaction/transactionService'

export const Route = createFileRoute('/admin/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  // Edit product modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // Create transaction modal state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<'Stock In' | 'Stock Out'>('Stock Out')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<TransactionItemInput[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [submittingTransaction, setSubmittingTransaction] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCustomers()
  }, [])

  // Edit product handlers
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setValue('sku', product.sku)
    setValue('name', product.name)
    setValue('description', product.description)
    setValue('category', product.category)
    setValue('stock', product.stock)
    setValue('unit', product.unit)
    setValue('price', product.price)
    setValue('minStock', product.minStock)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
    reset()
  }

  const handleEditProduct = async (data: ProductFormData) => {
    if (!editingProduct) return
    try {
      setSubmittingEdit(true)
      await inventoryService.updateProduct(editingProduct.id, data)
      await fetchProducts()
      handleCloseEditModal()
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setSubmittingEdit(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await inventoryService.deleteProduct(product.id)
        await fetchProducts()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  // Transaction modal handlers
  const handleOpenTransactionModal = () => {
    setTransactionType('Stock Out')
    setSelectedCustomerId('')
    setSelectedItems([])
    setProductSearch('')
    setIsTransactionModalOpen(true)
  }

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false)
    setSelectedItems([])
    setSelectedCustomerId('')
    setProductSearch('')
  }

  const handleAddProduct = (product: Product) => {
    const item: TransactionItemInput = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unit: product.unit,
    }
    setSelectedItems(prev => [...prev, item])
    setProductSearch('')
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId))
  }

  const handleUpdateQuantity = (productId: string, quantity: number, product: Product) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    const maxQty = transactionType === 'Stock In' ? undefined : product.stock
    const finalQty = maxQty && quantity > maxQty ? maxQty : quantity

    setSelectedItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: finalQty }
          : item
      )
    )
  }

  const getSelectedProductIds = () => selectedItems.map(item => item.productId)

  const filteredProducts = products.filter(product => {
    const searchLower = productSearch.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower)
    const notSelected = !getSelectedProductIds().includes(product.id)
    return matchesSearch && notSelected
  })

  const handleCreateTransaction = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product')
      return
    }

    if (transactionType === 'Stock Out' && !selectedCustomerId) {
      alert('Please select a customer for Stock Out transaction')
      return
    }

    try {
      setSubmittingTransaction(true)

      // Create the transaction
      await transactionService.addTransaction({
        type: transactionType,
        customerId: transactionType === 'Stock Out' ? selectedCustomerId : undefined,
        items: selectedItems,
        notes: transactionType === 'Stock Out' ? 'Created from inventory' : 'Stock addition',
      })

      // Update stock for each product
      for (const item of selectedItems) {
        await inventoryService.updateStock(item.productId, item.quantity, transactionType)
      }

      await fetchProducts()
      handleCloseTransactionModal()
    } catch (error) {
      console.error('Failed to create transaction:', error)
      alert('Failed to create transaction')
    } finally {
      setSubmittingTransaction(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const columns = [
    { key: 'sku' as const, header: 'SKU', sortable: true },
    { key: 'name' as const, header: 'Product Name', sortable: true },
    { key: 'category' as const, header: 'Category', sortable: true },
    {
      key: 'stock' as const,
      header: 'Stock',
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${product.stock === 0 ? 'text-red-400' : product.stock <= product.minStock ? 'text-yellow-400' : 'text-green-400'}`}>
            {product.stock}
          </span>
          <span className="text-gray-500 text-xs">{product.unit}</span>
          {product.stock === 0 && (
            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Out of Stock</span>
          )}
          {product.stock > 0 && product.stock <= product.minStock && (
            <AlertTriangle size={14} className="text-yellow-400" title="Low Stock" />
          )}
        </div>
      ),
    },
    {
      key: 'price' as const,
      header: 'Price',
      sortable: true,
      render: (product: Product) => formatCurrency(product.price),
    },
    { key: 'actions' as const, header: 'Actions' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Inventory"
          subtitle="Manage your product inventory"
          action={
            <button
              onClick={handleOpenTransactionModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              New Transaction
            </button>
          }
        />
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <Table
              data={products}
              columns={columns}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
              searchable
              searchPlaceholder="Search by SKU or name..."
              emptyMessage="No products found"
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title={editingProduct ? 'Edit Product' : 'Product Details'}
      >
        <form onSubmit={handleSubmit(handleEditProduct)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">SKU *</label>
              <input
                {...register('sku', { required: 'SKU is required' })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <input
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
              <input
                {...register('unit', { required: 'Unit is required' })}
                placeholder="pcs, kg, box..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Stock</label>
              <input
                type="number"
                {...register('minStock', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submittingEdit && <Loader2 className="animate-spin" size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        title="Create Transaction"
      >
        <div className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => {
                setTransactionType(e.target.value as 'Stock In' | 'Stock Out')
                setSelectedItems([])
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Stock Out">Stock Out (Sales)</option>
              <option value="Stock In">Stock In (Purchase)</option>
            </select>
          </div>

          {/* Customer Selection (only for Stock Out) */}
          {transactionType === 'Stock Out' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Customer *</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Product Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Search Products</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Search Results */}
          {productSearch && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search Results</label>
              <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-md">
                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-gray-600">
                    {filteredProducts.map((product) => {
                    const isOutOfStock = product.stock === 0
                    const isDisabled = transactionType === 'Stock Out' && isOutOfStock

                    return (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between px-3 py-2 ${isDisabled ? 'opacity-60' : 'hover:bg-gray-700/50'}`}
                      >
                        <div>
                          <div className="text-white text-sm flex items-center gap-2">
                            {product.name}
                            {isOutOfStock && (
                              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Out of Stock</span>
                            )}
                          </div>
                          <div className="text-gray-400 text-xs">SKU: {product.sku} | Stock: {product.stock} {product.unit}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          disabled={isDisabled}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    )
                  })}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-gray-400 text-sm">
                    No products found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Selected Items ({selectedItems.length})
            </label>
            {selectedItems.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedItems.map((item) => {
                  const product = products.find(p => p.id === item.productId)
                  if (!product) return null

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="text-white text-sm">{item.productName}</div>
                        <div className="text-gray-400 text-xs">Available: {product.stock} {product.unit}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={transactionType === 'Stock In' ? undefined : product.stock}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 0, product)}
                          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm border border-gray-600 rounded-md">
                No items selected. Search and add products above.
              </div>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="bg-gray-700/50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Items:</h4>
              <div className="space-y-1">
                {selectedItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.productName}</span>
                    <span className="text-white">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-600 flex justify-between">
                <span className="text-gray-300 font-medium">Total:</span>
                <span className="text-white font-medium">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseTransactionModal}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTransaction}
              disabled={submittingTransaction || selectedItems.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submittingTransaction && <Loader2 className="animate-spin" size={16} />}
              Create Transaction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
