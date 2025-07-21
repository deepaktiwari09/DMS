# MotoCorp DMS Frontend

A modern, type-safe React frontend for the MotoCorp Dealership Management System, built with the latest technologies and best practices.

## 🚀 Tech Stack

### Core Framework
- **React 18** - Modern React with concurrent features
- **TypeScript** - Full type safety throughout the application
- **Vite** - Lightning-fast build tool with HMR

### UI & Styling
- **Tailwind CSS** - Utility-first CSS with custom design system
- **Radix UI** - Headless, accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Inter Font** - Modern, readable typography

### State Management & Data Fetching
- **TanStack Query** - Powerful data synchronization for React
- **ky** - Lightweight HTTP client (replaces Axios)
- **Zustand** - Simple, scalable state management
- **Persist Middleware** - Automatic localStorage persistence

### Routing & Navigation
- **TanStack Router** - Type-safe routing with code splitting
- Built-in route preloading and navigation guards

### Forms & Validation
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Seamless integration between RHF and Zod

### Development Tools
- **Storybook** - Component development and documentation
- **React Query Devtools** - Debug queries and cache
- **ESLint + Prettier** - Code formatting and linting

## 🎨 Design System

The frontend perfectly matches the existing HTML prototypes with:

- **Primary Color**: `#3d98f4` (Blue)
- **Secondary Color**: `#e0f2fe` (Light Blue)
- **Background**: `#f9f9f9` (Light Gray)
- **Text Primary**: `#111827` (Dark Gray)
- **Text Secondary**: `#6b7280` (Medium Gray)
- **Accent**: `#bfdbfe` (Blue Accent)

All components use consistent spacing, typography, and interaction patterns.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives (Button, Input, Card)
│   ├── forms/          # Form components with validation
│   └── layout/         # Layout components (Sidebar, AppLayout)
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── customers/      # Customer management
│   ├── inventory/      # Inventory management
│   ├── sales/          # Sales pipeline
│   └── service/        # Service appointments
├── stores/             # Zustand stores
│   ├── auth-store.ts   # Authentication state
│   └── ui-store.ts     # UI state (modals, notifications)
├── services/           # API service layers
├── types/              # TypeScript type definitions
├── lib/                # Utility functions and configuration
└── hooks/              # Custom React hooks
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open Storybook for component development
npm run storybook

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
VITE_APP_NAME=MotoCorp DMS
VITE_APP_VERSION=1.0.0
```

## 🔧 Key Features

### Type-Safe API Integration
- Strongly typed API client with automatic error handling
- JWT token management with automatic refresh
- Optimistic updates and background refetching

### Form Validation
- Zod schemas shared between frontend and backend
- Real-time validation with helpful error messages
- Consistent form patterns across all modules

### State Management
- Zustand stores with localStorage persistence
- Separate stores for different domains (auth, UI, etc.)
- Minimal boilerplate with maximum type safety

### Component Library
- Reusable, accessible components built on Radix UI
- Consistent styling with design system classes
- Storybook documentation for all components

### Performance Optimizations
- Route-based code splitting with TanStack Router
- Query caching and background updates
- Optimized bundle size with tree shaking

## 🎭 Component Testing

The app includes a built-in component showcase. Click the "🧪 Test Components" button to see:

- Button variants (Primary, Secondary, Outline, Ghost)
- Input components with icons and validation
- Form examples with real-time validation
- Card layouts and typography
- Color palette demonstration

## 🔐 Authentication Flow

The app supports a complete authentication system:

1. **Login**: JWT-based authentication with form validation
2. **Token Management**: Automatic token refresh and storage
3. **Protected Routes**: Route guards for authenticated users
4. **User Context**: Global user state with Zustand

## 📊 API Integration

All API services are strongly typed and include:

- **Auth Service**: Login, register, profile management
- **Customers Service**: CRUD operations with filtering
- **Inventory Service**: Stock management and reporting
- **Sales Service**: Pipeline management
- **Service Service**: Appointment scheduling

## 🧪 Development Workflow

### Component Development
```bash
# Start Storybook
npm run storybook

# Create new component story
# stories/MyComponent.stories.tsx
```

### API Integration
```typescript
// Use React Query hooks
const { data, isLoading, error } = useQuery({
  queryKey: ['customers'],
  queryFn: () => customersService.getCustomers(),
})
```

### State Management
```typescript
// Use Zustand store
const { user, login, logout } = useAuthStore()
```

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Deploy
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Railway

## 📚 Documentation

- **Storybook**: Component documentation and examples
- **TypeScript**: Full type coverage with JSDoc comments
- **README files**: Detailed setup and usage instructions

## 🤝 Integration with Backend

The frontend is designed to work seamlessly with the NestJS backend:

- **Shared Types**: TypeScript interfaces match backend DTOs
- **API Endpoints**: Service methods mirror backend controllers
- **Authentication**: JWT tokens with automatic header injection
- **Error Handling**: Consistent error responses and user feedback

## 📈 Performance Features

- **Query Caching**: Intelligent caching with TanStack Query
- **Code Splitting**: Route-based lazy loading
- **Optimistic Updates**: Immediate UI updates with rollback
- **Background Sync**: Keep data fresh without blocking UI

## 🎨 Customization

The design system is fully customizable through:

- **Tailwind Config**: Modify colors, spacing, fonts
- **CSS Variables**: Runtime theme switching
- **Component Variants**: Extend existing component styles

---

This frontend provides a solid foundation for the MotoCorp DMS with modern best practices, excellent developer experience, and production-ready features! 🚀