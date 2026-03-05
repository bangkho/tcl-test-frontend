import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Modal } from '../../components/ui/Modal'
import type { Customer, CustomerFormData } from '../../modules/customer/customerModel'
import { customerService } from '../../modules/customer/customerService'

export const Route = createFileRoute('/admin/customer')({
  component: RouteComponent,
})

function RouteComponent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await customerService.getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setValue('name', customer.name)
      setValue('email', customer.email)
      setValue('phone', customer.phone)
      setValue('address', customer.address)
    } else {
      setEditingCustomer(null)
      reset()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
    reset()
  }

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setSubmitting(true)
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, data)
      } else {
        await customerService.addCustomer(data)
      }
      await fetchCustomers()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save customer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await customerService.deleteCustomer(customer.id)
        await fetchCustomers()
      } catch (error) {
        console.error('Failed to delete customer:', error)
      }
    }
  }

  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'email' as const, header: 'Email' },
    { key: 'phone' as const, header: 'Phone' },
    { key: 'address' as const, header: 'Address' },
    {
      key: 'createdAt' as const,
      header: 'Created At',
      render: (customer: Customer) =>
        new Date(customer.createdAt).toLocaleDateString(),
    },
    { key: 'actions' as const, header: 'Actions' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Customers"
          subtitle="Manage your customer database"
          action={
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add Customer
            </button>
          }
        />
        <CardContent>
          <div className="mb-4 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <Table
              data={filteredCustomers}
              columns={columns}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              emptyMessage="No customers found"
            />
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name *
            </label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              {...register('phone', {
                pattern: {
                  value: /^[0-9-]{10,}$/i,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <input
              {...register('address')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              {editingCustomer ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
