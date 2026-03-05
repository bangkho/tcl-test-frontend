import type { Customer, CustomerFormData } from './customerModel'

// Mock data
let customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, New York, NY',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    address: '456 Oak Ave, Los Angeles, CA',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-123-4567',
    address: '789 Pine Rd, Chicago, IL',
    createdAt: '2024-03-10T09:15:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay(500)
    return [...customers]
  },

  async addCustomer(data: CustomerFormData): Promise<Customer> {
    await delay(500)
    const newCustomer: Customer = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
    }
    customers = [...customers, newCustomer]
    return newCustomer
  },

  async updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
    await delay(500)
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Customer not found')

    customers[index] = { ...customers[index], ...data }
    return customers[index]
  },

  async deleteCustomer(id: string): Promise<void> {
    await delay(500)
    customers = customers.filter((c) => c.id !== id)
  },
}
