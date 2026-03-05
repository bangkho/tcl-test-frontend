import type { Product, ProductFormData } from './inventoryModel'
import { inventoryService } from './inventoryService'

// Repository layer - delegates to service
// In a real app, this would handle database operations
export const inventoryRepository = {
  async findAll(): Promise<Product[]> {
    return inventoryService.getProducts()
  },

  async findById(id: string): Promise<Product | null> {
    return inventoryService.getProductById(id)
  },

  async findBySku(sku: string): Promise<Product | null> {
    const products = await inventoryService.getProducts()
    return products.find((p) => p.sku === sku) || null
  },

  async findByCategory(category: string): Promise<Product[]> {
    const products = await inventoryService.getProducts()
    return products.filter((p) => p.category === category)
  },

  async findLowStock(): Promise<Product[]> {
    const products = await inventoryService.getProducts()
    return products.filter((p) => p.stock <= p.minStock)
  },

  async findOutOfStock(): Promise<Product[]> {
    const products = await inventoryService.getProducts()
    return products.filter((p) => p.stock === 0)
  },

  async create(data: ProductFormData): Promise<Product> {
    return inventoryService.addProduct(data)
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    return inventoryService.updateProduct(id, data)
  },

  async delete(id: string): Promise<void> {
    return inventoryService.deleteProduct(id)
  },

  async adjustStock(
    id: string,
    quantity: number,
    type: 'Stock In' | 'Stock Out'
  ): Promise<Product> {
    return inventoryService.updateStock(id, quantity, type)
  },

  async bulkAdjustStock(
    items: { productId: string; quantity: number; type: 'Stock In' | 'Stock Out' }[]
  ): Promise<Product[]> {
    return inventoryService.bulkUpdateStock(items)
  },
}
