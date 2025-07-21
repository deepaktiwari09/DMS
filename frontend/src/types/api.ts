// API Response Types
export interface APIResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Auth Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'sales' | 'service' | 'viewer'
  organizationId: string
  dealershipId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: string
}

export interface Organization {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Customer Types
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  notes?: string
  status: 'lead' | 'active' | 'inactive'
  organizationId: string
  dealershipId?: string
  assignedUserId?: string
  lastInteraction?: string
  createdAt: string
  updatedAt: string
}

// Inventory Types
export interface InventoryItem {
  id: string
  name: string
  description?: string
  sku: string
  category: 'motorcycle' | 'part' | 'accessory'
  brand: string
  model?: string
  year?: number
  price: number
  cost?: number
  quantity: number
  minStock: number
  location?: string
  isActive: boolean
  organizationId: string
  dealershipId?: string
  createdAt: string
  updatedAt: string
}

// Sales Types
export interface Sale {
  id: string
  customerId: string
  customer?: Customer
  stage: 'inquiry' | 'quote' | 'negotiation' | 'closed_won' | 'closed_lost'
  totalAmount: number
  notes?: string
  expectedCloseDate?: string
  actualCloseDate?: string
  probability: number
  assignedUserId?: string
  assignedUser?: User
  organizationId: string
  dealershipId?: string
  createdAt: string
  updatedAt: string
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  saleId: string
  inventoryId: string
  inventoryItem?: InventoryItem
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
  updatedAt: string
}

// Service Types
export interface ServiceAppointment {
  id: string
  customerId: string
  customer?: Customer
  vehicleInfo: string
  serviceType: 'maintenance' | 'repair' | 'inspection' | 'warranty'
  description: string
  scheduledDate: string
  completedDate?: string
  estimatedDuration: number
  actualDuration?: number
  assignedTechnician?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes?: string
  totalCost?: number
  organizationId: string
  dealershipId?: string
  createdAt: string
  updatedAt: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  userId: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

// Activity Feed Types
export interface ActivityFeed {
  id: string
  action: string
  description: string
  entityType: 'customer' | 'inventory' | 'sale' | 'service' | 'user'
  entityId: string
  userId: string
  user?: User
  organizationId: string
  createdAt: string
}

// Filter/Search Types
export interface CustomerFilter {
  search?: string
  status?: Customer['status']
  dealershipId?: string
  assignedUserId?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface InventoryFilter {
  search?: string
  category?: InventoryItem['category']
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  dealershipId?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SaleFilter {
  search?: string
  stage?: Sale['stage']
  customerId?: string
  assignedUserId?: string
  dealershipId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ServiceFilter {
  search?: string
  status?: ServiceAppointment['status']
  serviceType?: ServiceAppointment['serviceType']
  priority?: ServiceAppointment['priority']
  customerId?: string
  assignedTechnician?: string
  dealershipId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Dashboard Statistics
export interface DashboardStats {
  customers: {
    total: number
    active: number
    leads: number
    newThisMonth: number
  }
  inventory: {
    totalItems: number
    lowStock: number
    totalValue: number
    categories: {
      motorcycles: number
      parts: number
      accessories: number
    }
  }
  sales: {
    totalSales: number
    monthlyRevenue: number
    averageDealSize: number
    conversionRate: number
    pipeline: {
      inquiry: number
      quote: number
      negotiation: number
    }
  }
  service: {
    totalAppointments: number
    completedThisMonth: number
    averageServiceTime: number
    upcomingAppointments: number
  }
}

// Error Types
export interface APIError {
  message: string
  statusCode: number
  error?: string
  timestamp: string
}