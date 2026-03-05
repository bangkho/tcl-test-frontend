# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Run development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run a single test file
pnpm test -- src/some-test.test.ts
```

## Architecture

This is a **TanStack Start** (React full-stack) application with SSR capabilities.

### Routing
- **TanStack Router** with file-based routing
- Routes are defined in `src/routes/` directory
- Route tree is auto-generated in `src/routeTree.gen.ts` - do not edit manually
- Use `beforeLoad` in route definitions for route middleware/guards
- Auth middleware is currently **commented out** in all admin routes

### State Management
- **Zustand** for global state with persist middleware
- Auth state in `src/stores/authStore.ts` - persisted to localStorage

### Authentication
- Mock authentication implemented (no real API)
- Uses simulated delay and generates mock token
- Auth middleware in `src/middleware/auth.ts` - currently unused (commented out)
- Add `beforeLoad: authMiddleware` to protect routes when needed

### Modules (Domain Layer)
- `src/modules/inventory/` - Product/inventory management with service and repository
- `src/modules/customer/` - Customer management with service
- `src/modules/transaction/` - Transaction history with service
- All modules use in-memory mock data with simulated API delay

### Form Input
- Using **React-Hooks-Form** for input forms

### Key Files
- `src/routes/__root.tsx` - Root layout with Header/Footer
- `src/routes/index.tsx` - Home/login page
- `src/routes/admin/route.tsx` - Admin layout with Sidebar
- `src/routes/admin/index.tsx` - Dashboard with stats cards
- `src/routes/admin/inventory.tsx` - Product inventory management
- `src/routes/admin/customer.tsx` - Customer management
- `src/routes/admin/transaction.tsx` - Transaction history
- `src/stores/authStore.ts` - Authentication state (mocked)
- `src/middleware/auth.ts` - Auth middleware (currently unused)
- `src/styles.css` - Global styles with Tailwind

### Components
- `src/components/ui/` - Reusable UI components (Card, Modal, Table)
- `src/components/Header.tsx` - Application header
- `src/components/Footer.tsx` - Application footer
- `src/components/Sidebar.tsx` - Admin dashboard sidebar
- `src/components/LoginBox.tsx` - Login form component

### Styling
- Tailwind CSS v4
- Components use Tailwind utility classes
- Dark-themed admin interface

### Dependencies
- @tanstack/react-start - Full-stack React framework
- @tanstack/react-router - File-based routing
- zustand - State management
- react-hook-form - Form handling
- tailwindcss - Styling
- lucide-react - Icons
