import type { Transaction, TransactionFormData, TransactionStatus } from './transactionModel'

// Mock data
let transactions: Transaction[] = [
  {
    id: '1',
    referenceNumber: 'TRX-001',
    type: 'Stock In',
    status: 'Completed',
    items: [
      { productId: 'p1', productName: 'Laptop HP EliteBook', quantity: 10, unit: 'pcs' },
      { productId: 'p2', productName: 'Mouse Wireless', quantity: 25, unit: 'pcs' },
    ],
    totalItems: 35,
    notes: 'Monthly restock from supplier',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    referenceNumber: 'TRX-002',
    type: 'Stock Out',
    status: 'Completed',
    items: [
      { productId: 'p1', productName: 'Laptop HP EliteBook', quantity: 3, unit: 'pcs' },
    ],
    totalItems: 3,
    notes: 'Order #12345 - Customer: John Doe',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '3',
    referenceNumber: 'TRX-003',
    type: 'Stock In',
    status: 'InProgress',
    items: [
      { productId: 'p3', productName: 'Keyboard Mechanical', quantity: 50, unit: 'pcs' },
      { productId: 'p4', productName: 'Monitor 24 inch', quantity: 15, unit: 'pcs' },
    ],
    totalItems: 65,
    notes: 'In transit - Expected delivery tomorrow',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
  },
  {
    id: '4',
    referenceNumber: 'TRX-004',
    type: 'Stock Out',
    status: 'Pending',
    items: [
      { productId: 'p5', productName: 'Headphone Sony', quantity: 5, unit: 'pcs' },
    ],
    totalItems: 5,
    notes: 'Order #12346 - Awaiting payment confirmation',
    createdAt: '2024-01-22T15:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
  },
  {
    id: '5',
    referenceNumber: 'TRX-005',
    type: 'Stock Out',
    status: 'Cancelled',
    items: [
      { productId: 'p2', productName: 'Mouse Wireless', quantity: 10, unit: 'pcs' },
    ],
    totalItems: 10,
    notes: 'Order cancelled by customer',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
  },
  {
    id: '6',
    referenceNumber: 'TRX-006',
    type: 'Stock In',
    status: 'Pending',
    items: [
      { productId: 'p6', productName: 'Webcam HD', quantity: 20, unit: 'pcs' },
    ],
    totalItems: 20,
    notes: 'Pre-order from new supplier',
    createdAt: '2024-01-28T09:30:00Z',
    updatedAt: '2024-01-28T09:30:00Z',
  },
  {
    id: '7',
    referenceNumber: 'TRX-007',
    type: 'Stock Out',
    status: 'InProgress',
    items: [
      { productId: 'p3', productName: 'Keyboard Mechanical', quantity: 8, unit: 'pcs' },
      { productId: 'p5', productName: 'Headphone Sony', quantity: 4, unit: 'pcs' },
    ],
    totalItems: 12,
    notes: 'Order #12347 - Being prepared',
    createdAt: '2024-01-29T11:00:00Z',
    updatedAt: '2024-01-29T14:00:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    await delay(500)
    return [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    await delay(300)
    return transactions.find((t) => t.id === id) || null
  },

  async addTransaction(data: TransactionFormData): Promise<Transaction> {
    await delay(500)
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0)
    const newTransaction: Transaction = {
      id: String(Date.now()),
      referenceNumber: `TRX-${String(transactions.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      totalItems,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    transactions = [...transactions, newTransaction]
    return newTransaction
  },

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus
  ): Promise<Transaction> {
    await delay(500)
    const index = transactions.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Transaction not found')

    transactions[index] = {
      ...transactions[index],
      status,
      updatedAt: new Date().toISOString(),
    }
    return transactions[index]
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(500)
    transactions = transactions.filter((t) => t.id !== id)
  },
}
