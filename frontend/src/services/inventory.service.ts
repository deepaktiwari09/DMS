import { apiMethods } from '../lib/api'
import { InventoryItem, InventoryFilter, PaginatedResponse } from '../types/api'
import { InventoryFormData } from '../types/schemas'

export const inventoryService = {
  // Get all inventory items with filtering and pagination
  getInventoryItems: async (filters?: InventoryFilter): Promise<PaginatedResponse<InventoryItem>> => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.brand) params.append('brand', filters.brand)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString())
    if (filters?.dealershipId) params.append('dealershipId', filters.dealershipId)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const url = queryString ? `inventory?${queryString}` : 'inventory'
    
    return await apiMethods.get<PaginatedResponse<InventoryItem>>(url)
  },

  // Get inventory item by ID
  getInventoryItem: async (id: string): Promise<InventoryItem> => {
    return await apiMethods.get<InventoryItem>(`inventory/${id}`)
  },

  // Create new inventory item
  createInventoryItem: async (itemData: InventoryFormData): Promise<InventoryItem> => {
    return await apiMethods.post<InventoryItem>('inventory', itemData)
  },

  // Update inventory item
  updateInventoryItem: async (id: string, itemData: Partial<InventoryFormData>): Promise<InventoryItem> => {
    return await apiMethods.put<InventoryItem>(`inventory/${id}`, itemData)
  },

  // Delete inventory item
  deleteInventoryItem: async (id: string): Promise<void> => {
    await apiMethods.delete(`inventory/${id}`)
  },

  // Update stock quantity
  updateStock: async (id: string, data: {
    quantity: number
    type: 'add' | 'subtract' | 'set'
    reason?: string
  }): Promise<InventoryItem> => {
    return await apiMethods.patch<InventoryItem>(`inventory/${id}/stock`, data)
  },

  // Get low stock items
  getLowStockItems: async (): Promise<InventoryItem[]> => {
    return await apiMethods.get<InventoryItem[]>('inventory/low-stock')
  },

  // Get inventory statistics
  getInventoryStats: async (): Promise<{
    totalItems: number
    totalValue: number
    lowStockCount: number
    categories: {
      motorcycles: number
      parts: number
      accessories: number
    }
    topBrands: { brand: string; count: number }[]
  }> => {
    return await apiMethods.get('inventory/stats')
  },

  // Search inventory items
  searchInventoryItems: async (query: string): Promise<InventoryItem[]> => {
    return await apiMethods.get<InventoryItem[]>(`inventory/search?q=${encodeURIComponent(query)}`)
  },

  // Get unique brands
  getBrands: async (): Promise<string[]> => {
    return await apiMethods.get<string[]>('inventory/brands')
  },

  // Bulk import inventory items
  bulkImport: async (file: File): Promise<{
    success: number
    failed: number
    errors: string[]
  }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    return await apiMethods.post('inventory/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Export inventory to CSV
  exportInventory: async (filters?: InventoryFilter): Promise<Blob> => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.brand) params.append('brand', filters.brand)

    const queryString = params.toString()
    const url = queryString ? `inventory/export?${queryString}` : 'inventory/export'
    
    const response = await fetch(url)
    return await response.blob()
  },
}