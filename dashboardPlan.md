

## ✅ Dashboard Implementation Plan

### 🧭 Overview

Convert the 5 HTML prototypes into a functional React dashboard using modern tools, proper routing, shared components, and full API integration.

---

### 📐 1. Layout & Navigation

* Create a main `DashboardLayout.tsx` with:

  * Sidebar navigation
  * Main content area
* Sidebar Modules:

  * Dashboard (home)
  * Customers
  * Inventory
  * Sales
  * Service
  * Settings (bottom section)
* Add responsive behavior (collapsible sidebar)
* Extract reusable design styles from HTML into Tailwind

---

### 🧱 2. Core Components

**Shared Components:**

* `DashboardSidebar.tsx` – Navigation with MotoCorp branding
* `DashboardHeader.tsx` – Title, breadcrumbs, action buttons
* `DataTable.tsx` – Reusable table with pagination, sorting
* `StatusBadge.tsx` – Status indicator chips
* `TabNavigation.tsx` – Tabs within pages

**Page Components:**

* `DashboardHome.tsx` – Overview/metrics
* `CustomersPage.tsx` – Customer management
* `InventoryPage.tsx` – Vehicle/parts inventory
* `SalesPage.tsx` – Sales pipeline
* `ServicePage.tsx` – Service jobs, scheduling
* `FinancePage.tsx` – Invoicing and reports

---

### 🎨 3. Design System Integration

* Convert HTML variables to Tailwind design tokens
* Add:

  * Color palette
  * Typography scale
  * Spacing system
* Apply classes like `.button_primary`, `.typography_h1`, etc.
* Configure Inter font

---

### 🔌 4. API Integration

* Create `src/services/` files per module (e.g., `customer.service.ts`)
* CRUD operations via NestJS backend endpoints
* Use:

  * `ky` + `TanStack Query` for fetching/caching
  * OpenAPI-generated types for full type safety
  * Error/loading states with `TanStack Query`

---

### 🧠 5. State Management

* Extend Zustand with:

  * Sidebar UI state (collapsed/expanded)
  * Active tab/module state
  * User preferences (e.g., theme)
* Keep Zustand stores domain-specific and < 100 LOC

---

### 🧭 6. Routing

Update `src/lib/router.tsx` using **TanStack Router**:

```
/dashboard
/dashboard/customers
/dashboard/inventory
/dashboard/sales
/dashboard/service
/dashboard/finance
```

* Add route guards for authenticated access
* Implement breadcrumb support via route meta

---

### 📱 7. Mobile Responsiveness

* Collapsible sidebar
* Responsive DataTable with scroll for mobile
* Touch-friendly buttons and tabs
* Adaptive layout using Tailwind breakpoints

---

### 📘 8. Storybook Integration

* Create stories for:

  * Sidebar, Header, DataTable, Badges, Tabs
  * Each module page layout
* Include:

  * Variants and edge cases
  * Interaction states
  * Accessibility tags
  * Responsive previews

---

### ✅ 9. Testing & Quality

* Unit tests for UI components (e.g., DataTable logic)
* Integration tests for API (login, CRUD flows)
* Lint + type checking (`eslint`, `tsc`)
* Cross-browser testing (Chrome, Safari, Firefox)

---

### 🧑‍💻 Technical Notes

* Stack: Vite + React + TypeScript
* Matches structure of auth/landing pages
* Uses:

  * **TanStack Query** (data fetching)
  * **Zustand** (state)
  * **Radix UI** (accessible components)
  * **Framer Motion** (animations)
* Maintain pixel-perfect match to HTML designs
* Follow accessibility best practices

---

### 🏁 Result

A fully integrated, modular, and responsive dashboard — aligned with your HTML designs, backend APIs, and the existing frontend architecture.
