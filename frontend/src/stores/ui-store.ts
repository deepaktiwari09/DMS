import { create } from 'zustand'

// Types
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  isLoading: boolean
  modals: {
    [key: string]: boolean
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  setLoading: (loading: boolean) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
}

type UIStore = UIState & UIActions

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Create UI store
export const useUIStore = create<UIStore>()((set, get) => ({
  // State
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  isLoading: false,
  modals: {},

  // Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (sidebarOpen: boolean) => {
    set({ sidebarOpen })
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme })
  },

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      timestamp: new Date(),
      read: false,
    }
    
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))

    // Auto-remove after 5 seconds for success notifications
    if (notificationData.type === 'success') {
      setTimeout(() => {
        get().removeNotification(notification.id)
      }, 5000)
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  clearAllNotifications: () => {
    set({ notifications: [] })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  openModal: (modalId: string) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    }))
  },

  closeModal: (modalId: string) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    }))
  },

  toggleModal: (modalId: string) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] },
    }))
  },
}))