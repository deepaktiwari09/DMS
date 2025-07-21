import { apiMethods } from '../lib/api'
import { Customer, CustomerFilter, PaginatedResponse } from '../types/api'
import { CustomerFormData } from '../types/schemas'

export const customersService = {
  // Get all customers with filtering and pagination
  getCustomers: async (filters?: CustomerFilter): Promise<PaginatedResponse<Customer>> => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.dealershipId) params.append('dealershipId', filters.dealershipId)
    if (filters?.assignedUserId) params.append('assignedUserId', filters.assignedUserId)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const url = queryString ? `customers?${queryString}` : 'customers'
    
    return await apiMethods.get<PaginatedResponse<Customer>>(url)
  },

  // Get customer by ID
  getCustomer: async (id: string): Promise<Customer> => {
    return await apiMethods.get<Customer>(`customers/${id}`)
  },

  // Create new customer
  createCustomer: async (customerData: CustomerFormData): Promise<Customer> => {
    return await apiMethods.post<Customer>('customers', customerData)
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    return await apiMethods.put<Customer>(`customers/${id}`, customerData)
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    await apiMethods.delete(`customers/${id}`)
  },

  // Transfer customer to another user/dealership
  transferCustomer: async (id: string, data: {
    assignedUserId?: string
    dealershipId?: string
  }): Promise<Customer> => {
    return await apiMethods.patch<Customer>(`customers/${id}/transfer`, data)
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<{
    total: number
    active: number
    leads: number
    newThisMonth: number
    byStatus: Record<string, number>
  }> => {
    return await apiMethods.get('customers/stats')
  },

  // Search customers by various criteria
  searchCustomers: async (query: string): Promise<Customer[]> => {
    return await apiMethods.get<Customer[]>(`customers/search?q=${encodeURIComponent(query)}`)
  },

  // Export customers to CSV
  exportCustomers: async (filters?: CustomerFilter): Promise<Blob> => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.dealershipId) params.append('dealershipId', filters.dealershipId)

    const queryString = params.toString()
    const url = queryString ? `customers/export?${queryString}` : 'customers/export'
    
    // Return blob for CSV download
    const response = await fetch(url)
    return await response.blob()
  },
}