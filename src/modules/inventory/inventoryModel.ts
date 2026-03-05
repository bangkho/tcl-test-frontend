export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  stock: number
  unit: string
  price: number
  minStock: number
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  sku: string
  name: string
  description: string
  category: string
  stock: number
  unit: string
  price: number
  minStock: number
}

export interface TransactionItemInput {
  productId: string
  productName: string
  quantity: number
  unit: string
}

export interface TransactionFormData {
  type: 'Stock In' | 'Stock Out'
  customerId?: string
  items: TransactionItemInput[]
  notes?: string
}
