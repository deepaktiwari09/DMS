
## ✅ Complete Auth API Integration Plan

### 📊 Current State Analysis

#### ✅ Already Implemented:

* Auth system using **React 19 + TypeScript + Zustand**
* Login, Register, and Onboarding UIs with full **design system** adherence
* Multi-tenant setup with **JWT authentication**
* Storybook integration and consistent UI components

#### ❌ Missing:

* Forgot/reset/change password flows (UI + Backend)
* Missing **Prisma schema fields** for password reset
* Some **OpenAPI endpoints** not implemented
* No Storybook stories for password components

---

## 🔧 Implementation Plan

### **Phase 1: Prisma Schema Updates (Backend - Day 1 AM)**

Update `/api/prisma/schema.prisma`:

```ts
model User {
  ...
  passwordResetToken   String?   @map("password_reset_token")
  passwordResetExpires DateTime? @map("password_reset_expires")
}
```

* Run migration: `npx prisma migrate dev --name add_password_reset_fields`

---

### **Phase 2: Backend API Endpoints (Backend - Day 1 PM)**

Update `/api/src/auth/auth.controller.ts` and `/auth.service.ts`

#### Endpoints:

1. `POST /auth/forgot-password`
2. `POST /auth/reset-password`
3. `PUT /auth/change-password`
4. ✅ Fix `POST /auth/refresh` implementation

#### Actions:

* Add DTOs for password reset and change
* Token generation & email logic (use Nodemailer or SES)
* Add expiration handling
* Password hashing with bcrypt

---

### **Phase 3: Frontend Components (Frontend - Day 2 AM)**

Create components in `/src/components/auth/`:

1. `ForgotPasswordForm.tsx`

   * Email input
   * Success/error messages

2. `ResetPasswordForm.tsx`

   * Password & confirm password
   * Read token from route params

3. `ChangePasswordForm.tsx`

   * Current + new password
   * Authenticated users only

4. Pages:

   * `ForgotPasswordPage.tsx`
   * `ResetPasswordPage.tsx`

All must use:

* Existing `<Input />` and `<Button />`
* CSS classes: `.button_primary_auth`, `.input`, `.card`
* Responsive design & accessibility best practices

---

### **Phase 4: Storybook Integration (Frontend - Day 2 PM)**

Create `.stories.tsx` files for:

* `ForgotPasswordForm`
* `ResetPasswordForm`
* `ChangePasswordForm`

Ensure:

* 📱 Responsive viewports
* ✅ Controls for inputs/states
* 🧪 Success/Error/Loading states
* ♿ Accessibility tags

Story Template:

```tsx
const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
```

---

### **Phase 5: Service Layer & Zustand (Frontend - Day 2 PM)**

#### Update `/src/services/auth.service.ts`:

```ts
forgotPassword: (email: string) => Promise<void>
resetPassword: (token: string, password: string) => Promise<void>
changePassword: (current: string, newPassword: string) => Promise<void>
```

#### Update `/src/stores/auth-store.ts`:

Add actions mirroring above service methods, integrated with Zustand.

---

### **Phase 6: Routing & Navigation (Frontend - Day 2)**

Update `/src/lib/router.tsx`:

Routes to add:

* `/auth/forgot-password`
* `/auth/reset-password/:token`
* Add `ChangePasswordForm` to user settings

Update:

* `AuthTabs.tsx` – add "Forgot password?" link
* Handle invalid/expired token navigation

---

### **Phase 7: Design System Compliance (Ongoing)**

* Use design tokens: `--primary-color`, `--text-primary`, etc.
* Apply:

  * `.typography_h1`, `.typography_body`
  * `.input`, `.button_primary_auth`, `.card`
* Ensure spacing, typography, and interactions are consistent
* Support keyboard and screen reader accessibility

---

### **Phase 8: Form Validation with Zod (Frontend - Day 2)**

Add to `/src/types/schemas.ts`:

```ts
export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

---

### **Phase 9: Testing & QA (Day 3)**

#### ✅ Component Tests

* Test field validation
* Button states (disabled, loading, etc.)

#### ✅ Integration Tests

* Simulate full reset flow using test backend

#### ✅ API Tests

* Test all new auth endpoints (unit + Postman suite)

#### ✅ Visual & Accessibility Testing

* Storybook visual diffing
* Tab/Keyboard nav
* Screen reader audit (e.g., using axe)

---

## 🗂️ Files To Be Created or Modified

### 🟢 Frontend:

```
/components/auth/
  ForgotPasswordForm.tsx
  ResetPasswordForm.tsx
  ChangePasswordForm.tsx
  *.stories.tsx

/pages/auth/
  ForgotPasswordPage.tsx
  ResetPasswordPage.tsx

/services/
  auth.service.ts  // Update

/stores/
  auth-store.ts    // Update

/lib/
  router.tsx       // Add routes

/types/
  schemas.ts       // Add Zod schemas

/components/auth/
  AuthTabs.tsx     // Modify for "Forgot Password" link
```

### 🔵 Backend:

```
/api/prisma/schema.prisma  // + reset token fields
/api/src/auth/
  auth.controller.ts        // + new endpoints
  auth.service.ts           // + implementations
  dto/                      // + new DTOs
```

---

## ✅ Design Compliance Checklist

* ✅ Existing Button/Input components
* ✅ CSS custom properties used throughout
* ✅ Inter font and consistent typography
* ✅ Component states covered in Storybook
* ✅ Fully accessible and responsive
* ✅ Error + loading states for all forms
