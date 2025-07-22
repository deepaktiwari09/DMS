

## ✅ Landing Page + Auth Implementation Plan

### 🎯 Goals

1. Convert HTML prototypes to React components with Storybook.
2. Implement login, register, and onboarding flows with API integration.
3. Develop all components in isolation using Storybook.
4. Fully integrate authentication APIs as per OpenAPI spec.

---

### 📋 Step-by-Step Implementation

#### 1. Global Styles & Design System

* Update `src/index.css` with Tailwind utilities:

  * `.button_primary`, `.button_secondary`
  * `.typography_h1`, `.typography_h2`, `.typography_body`
  * `.input_field` for auth forms
* Add CSS variables for theme consistency.
* Ensure Tailwind config supports all design tokens.

---

#### 2. Landing Page Components (+ Storybook)

Create these with Storybook stories:

* `Header.tsx`
* `HeroSection.tsx`
* `ModulesSection.tsx`
* `TestimonialsSection.tsx`
* `PricingSection.tsx`
* `CTASection.tsx`
* `Footer.tsx`
* `LandingPage.tsx` (composed layout)

> Directory: `src/components/landing/` and `src/pages/landing/`

---

#### 3. Authentication Components (+ Storybook)

Build based on `auth.html` prototype:

* `LoginForm.tsx`
* `RegisterForm.tsx`
* `OnboardingForm.tsx`
* `AuthTabs.tsx`
* `AuthPage.tsx`

> Directory: `src/components/auth/` and `src/pages/auth/`

---

#### 4. Zod Schemas & Form Validation

Extend shared schemas in `src/types/schemas.ts`:

```ts
LoginFormData, RegisterFormData, OrganizationFormData
```

Use:

* `React Hook Form` with `Zod` via `@hookform/resolvers/zod`
* Reuse schemas across frontend/backend

---

#### 5. API Integration (ky + TanStack Query)

Update `src/services/auth.service.ts` for:

* `POST /auth/login`
* `POST /auth/register`
* `GET /auth/profile`
* `POST /auth/refresh`

Use `ky` + `TanStack Query` for:

* Smart caching, retries, background refetch
* Type-safe calls via OpenAPI-generated types

---

#### 6. Zustand Auth Store

Enhance `src/stores/auth-store.ts` with:

* Auth actions: login, register, logout
* User profile & organization state
* JWT token persistence using `persist` middleware

---

#### 7. Routing

Configure `src/lib/router.tsx` using **TanStack Router**:

* `/` → Landing page
* `/auth` → Login/Register/Onboarding
* `/dashboard` → Authenticated routes
* Add route guards with Zustand's auth state

---

#### 8. UI Components & Styling

Update/extend components in `src/components/ui/`:

* `Button.tsx`, `Input.tsx` for new styles
* Add new components (e.g., `Tabs`, `Modal`) as needed
* Use:

  * Radix UI primitives
  * `clsx` + `tailwind-merge`
  * `class-variance-authority` for scalable variants

---

#### 9. Framer Motion Animations

Use lightweight animations (under 2KB):

* Fade-in for hero sections
* Hover effects on cards/modules
* Smooth form/page transitions

---

#### 10. Storybook Setup

* Ensure every component has stories with:

  * Variants, states, and interactivity
  * Accessibility annotations (via `@storybook/addon-a11y`)
  * Responsive behavior previews
  * Design token docs (via `@storybook/addon-design-tokens`)

---

#### 11. TypeScript Integration

* Use OpenAPI-generated types for all auth endpoints
* Type-safe routes with TanStack Router
* Strict typing for all forms, states, services, and props

---

### 🛠 Tech Stack Summary (from `frontendPlan.md`)

* **Framework**: Vite + React 18 + TypeScript
* **Router**: TanStack Router v1
* **API**: ky + TanStack Query
* **Forms**: React Hook Form + Zod
* **State**: Zustand + persist
* **UI**: Radix UI + Tailwind + clsx
* **Animations**: Framer Motion
* **Docs**: Storybook (Vite builder)

---

### 🎨 Design System Alignment

* Colors, typography, spacing from HTML prototypes
* Font: Inter with Tailwind hierarchy
* Mobile-first responsiveness
* Radix accessibility standards

---

### 📱 Mobile Responsiveness

* Hamburger navigation
* Responsive layouts for modules/pricing
* Touch-friendly form elements
* Optimized for all device sizes
