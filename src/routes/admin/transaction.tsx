import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Loader2, ArrowDownToLine, ArrowUpFromLine, Check, X } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import type { Transaction, TransactionStatus } from '../../modules/transaction/transactionModel'
import { transactionService } from '../../modules/transaction/transactionService'

export const Route = createFileRoute('/admin/transaction')({
  component: RouteComponent,
})

function RouteComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleConfirm = async (transaction: Transaction) => {
    if (window.confirm(`Confirm transaction ${transaction.referenceNumber}? This will complete the ${transaction.type}.`)) {
      try {
        await transactionService.updateTransactionStatus(transaction.id, 'Completed')
        await fetchTransactions()
      } catch (error) {
        console.error('Failed to confirm transaction:', error)
      }
    }
  }

  const handleCancel = async (transaction: Transaction) => {
    if (window.confirm(`Cancel transaction ${transaction.referenceNumber}? This action cannot be undone.`)) {
      try {
        await transactionService.updateTransactionStatus(transaction.id, 'Cancelled')
        await fetchTransactions()
      } catch (error) {
        console.error('Failed to cancel transaction:', error)
      }
    }
  }

  const getStatusBadge = (status: TransactionStatus) => {
    const styles: Record<TransactionStatus, string> = {
      Pending: 'bg-yellow-500/20 text-yellow-400',
      InProgress: 'bg-blue-500/20 text-blue-400',
      Completed: 'bg-green-500/20 text-green-400',
      Cancelled: 'bg-red-500/20 text-red-400',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    )
  }

  const getTypeBadge = (type: 'Stock In' | 'Stock Out') => {
    const isStockIn = type === 'Stock In'
    return (
      <span
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          isStockIn
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-orange-500/20 text-orange-400'
        }`}
      >
        {isStockIn ? (
          <ArrowDownToLine size={14} />
        ) : (
          <ArrowUpFromLine size={14} />
        )}
        {type}
      </span>
    )
  }

  const columns = [
    { key: 'referenceNumber' as const, header: 'Reference #', sortable: true },
    {
      key: 'type' as const,
      header: 'Type',
      sortable: true,
      render: (transaction: Transaction) => getTypeBadge(transaction.type),
    },
    {
      key: 'status' as const,
      header: 'Status',
      sortable: true,
      render: (transaction: Transaction) => getStatusBadge(transaction.status),
    },
    {
      key: 'totalItems' as const,
      header: 'Total Items',
      sortable: true,
      render: (transaction: Transaction) => (
        <span className="font-medium">{transaction.totalItems}</span>
      ),
    },
    {
      key: 'items' as const,
      header: 'Products',
      render: (transaction: Transaction) => (
        <div className="max-w-xs">
          {transaction.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="text-sm text-gray-400 truncate">
              {item.productName} ({item.quantity} {item.unit})
            </div>
          ))}
          {transaction.items.length > 2 && (
            <div className="text-xs text-gray-500">
              +{transaction.items.length - 2} more item(s)
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt' as const,
      header: 'Date',
      sortable: true,
      render: (transaction: Transaction) =>
        new Date(transaction.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      key: 'actions' as const,
      header: 'Actions',
      render: (transaction: Transaction) => {
        if (transaction.status !== 'InProgress') {
          return <span className="text-gray-500">-</span>
        }
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConfirm(transaction)}
              className="p-1.5 rounded-md bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
              title="Confirm (Complete)"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => handleCancel(transaction)}
              className="p-1.5 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Transactions"
          subtitle="View all inventory transactions (Stock In & Stock Out)"
        />
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <Table
              data={transactions}
              columns={columns}
              searchable
              searchPlaceholder="Search by reference or product..."
              emptyMessage="No transactions found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
