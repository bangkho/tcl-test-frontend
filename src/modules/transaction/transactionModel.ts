export type TransactionType = 'Stock In' | 'Stock Out'

export type TransactionStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled'

export interface TransactionItem {
  productId: string
  productName: string
  quantity: number
  unit: string
}

export interface Transaction {
  id: string
  referenceNumber: string
  type: TransactionType
  status: TransactionStatus
  items: TransactionItem[]
  totalItems: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TransactionFormData {
  type: TransactionType
  items: TransactionItem[]
  notes?: string
}
