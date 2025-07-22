

### 📋 Frontend Tech Stack

#### Core Framework

* Vite + React 18 + TypeScript
* Tailwind CSS (with existing design system variables)

#### Routing & Layout

* **TanStack Router v1** – Type-safe, code-splitting, zero runtime errors
* **Framer Motion (light)** – 2KB spring animations

#### Data Fetching

* **TanStack Query + ky** – Smart caching, retries, background refetch
* **TanStack Query Devtools** – Built-in network inspector

#### Forms & Validation

* **React Hook Form + Zod**
* Shared validation schemas (frontend & backend)

#### UI & Styling

* **Radix UI** – Headless, accessible components
* **Tailwind CSS** – Design system implementation
* **clsx + tailwind-merge** – Clean conditional styling

#### State Management

* **Zustand + persist middleware** – Auto localStorage persistence
* Zustand slices (auth, customers, inventory, etc.)

#### Development & Documentation

* **Storybook** – Component development, testing, documentation
* Addons: `@storybook/addon-essentials`, `a11y`, `design-tokens`

---

### 🚀 Implementation Plan

#### 1. Project Setup

* Create `frontend/`
* Initialize Vite + React + TypeScript
* Configure Tailwind with existing tokens
* Setup TanStack Router
* Initialize Storybook with Vite builder

#### 2. Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Radix + Tailwind
│   │   ├── layout/       # Layout components
│   │   └── forms/        # Hook Form + Zod
│   ├── pages/            # Route components
│   ├── hooks/            # TanStack Query hooks
│   ├── services/         # ky-based API clients
│   ├── stores/           # Zustand slices
│   ├── types/            # Shared Zod schemas
│   └── lib/              # Utils (clsx, tailwind-merge)
├── .storybook/           # Storybook config
└── stories/              # Storybook stories
```

#### 3. Storybook Integration

* Develop UI in isolation
* Document design tokens, accessibility, and variants
* Visual regression support via Chromatic (optional)

#### 4. API Integration

* Replace Axios with **ky**
* Use **TanStack Query** for caching, background updates
* Typed clients from OpenAPI schema
* Devtools for debugging

#### 5. State Management

* Zustand + persist for auth and other domains
* Split by domain (keep files < 100 LoC)

#### 6. UI Components

* Radix UI + Tailwind
* `clsx` and `tailwind-merge` for styles
* Framer Motion for transitions
* Storybook stories for each component

#### 7. Forms

* React Hook Form + Zod
* Shared validation
* Storybook stories for all states and variants

#### 8. Routing

* TanStack Router with file-based, type-safe routes
* Route guards and lazy-loaded components

#### 9. DX & Productivity

* Hot reload via Vite
* Devtools and type-safety throughout
* Storybook for component testing

---

### 🎯 Key Benefits

#### ⚡ Performance

* ky (4KB) < Axios (15KB)
* Built-in code splitting
* Only ship what you use (Radix, Framer)

#### 💻 Dev Experience

* Type-safe everything
* Storybook = isolated development & documentation
* Devtools for API inspection
* Zod = DRY validation
* Zustand = simple global state

#### 🔁 Maintainability

* Headless UI = future-proof
* Domain-split stores
* Shared schemas across fullstack
* Fully documented design system

#### ⏱ Time Savings

* Radix = skip accessibility boilerplate
* TanStack Query = avoid manual loading logic
* Storybook = fast iterations

---

### 📦 Final Stack Summary

* **TanStack Router** – Routing
* **TanStack Query + ky** – API & caching
* **Zustand + persist** – State
* **React Hook Form + Zod** – Forms
* **Radix + Tailwind** – UI
* **clsx + tailwind-merge** – Styling
* **Framer Motion** – Animations
* **Storybook** – Components & Docs
