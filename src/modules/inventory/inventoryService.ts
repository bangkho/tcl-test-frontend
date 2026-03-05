import type { Product, ProductFormData } from './inventoryModel'

// Mock data
let products: Product[] = [
  {
    id: '1',
    sku: 'LAP-HP-001',
    name: 'Laptop HP EliteBook',
    description: 'HP EliteBook 840 G8 - Intel Core i5, 16GB RAM, 512GB SSD',
    category: 'Laptops',
    stock: 15,
    unit: 'pcs',
    price: 12000000,
    minStock: 5,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    sku: 'MOU-WL-001',
    name: 'Mouse Wireless',
    description: 'Logitech MX Master 3 - Wireless Mouse',
    category: 'Accessories',
    stock: 45,
    unit: 'pcs',
    price: 450000,
    minStock: 10,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    sku: 'KEY-MC-001',
    name: 'Keyboard Mechanical',
    description: 'Keychron K2 - Mechanical Keyboard with RGB',
    category: 'Accessories',
    stock: 0,
    unit: 'pcs',
    price: 850000,
    minStock: 8,
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '4',
    sku: 'MON-24-001',
    name: 'Monitor 24 inch',
    description: 'Samsung S24F350 - 24 inch LED Monitor',
    category: 'Monitors',
    stock: 8,
    unit: 'pcs',
    price: 2100000,
    minStock: 3,
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    sku: 'HDP-SNY-001',
    name: 'Headphone Sony',
    description: 'Sony WH-1000XM4 - Wireless Noise Cancelling Headphone',
    category: 'Audio',
    stock: 12,
    unit: 'pcs',
    price: 3500000,
    minStock: 5,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  {
    id: '6',
    sku: 'WEB-HD-001',
    name: 'Webcam HD',
    description: 'Logitech C920 - 1080p HD Webcam',
    category: 'Accessories',
    stock: 20,
    unit: 'pcs',
    price: 750000,
    minStock: 5,
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: '7',
    sku: 'USB-32-001',
    name: 'Flash Drive 32GB',
    description: 'Sandisk Ultra - 32GB USB 3.0',
    category: 'Storage',
    stock: 3,
    unit: 'pcs',
    price: 85000,
    minStock: 20,
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '8',
    sku: 'LAP-DL-001',
    name: 'Dell XPS 13',
    description: 'Dell XPS 13 9310 - Intel Core i7, 16GB RAM, 1TB SSD',
    category: 'Laptops',
    stock: 5,
    unit: 'pcs',
    price: 18500000,
    minStock: 2,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const inventoryService = {
  async getProducts(): Promise<Product[]> {
    await delay(500)
    return [...products].sort((a, b) => a.name.localeCompare(b.name))
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(300)
    return products.find((p) => p.id === id) || null
  },

  async addProduct(data: ProductFormData): Promise<Product> {
    await delay(500)
    const newProduct: Product = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products = [...products, newProduct]
    return newProduct
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    await delay(500)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Product not found')

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return products[index]
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(500)
    products = products.filter((p) => p.id !== id)
  },

  async updateStock(
    id: string,
    quantity: number,
    type: 'Stock In' | 'Stock Out'
  ): Promise<Product> {
    await delay(300)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Product not found')

    const newStock = type === 'Stock In'
      ? products[index].stock + quantity
      : products[index].stock - quantity

    if (newStock < 0) throw new Error('Insufficient stock')

    products[index] = {
      ...products[index],
      stock: newStock,
      updatedAt: new Date().toISOString(),
    }
    return products[index]
  },

  async bulkUpdateStock(
    items: { productId: string; quantity: number; type: 'Stock In' | 'Stock Out' }[]
  ): Promise<Product[]> {
    await delay(500)
    const updatedProducts: Product[] = []

    for (const item of items) {
      const index = products.findIndex((p) => p.id === item.productId)
      if (index === -1) throw new Error(`Product ${item.productId} not found`)

      const newStock = item.type === 'Stock In'
        ? products[index].stock + item.quantity
        : products[index].stock - item.quantity

      if (newStock < 0) throw new Error(`Insufficient stock for ${products[index].name}`)

      products[index] = {
        ...products[index],
        stock: newStock,
        updatedAt: new Date().toISOString(),
      }
      updatedProducts.push(products[index])
    }

    return updatedProducts
  },
}
