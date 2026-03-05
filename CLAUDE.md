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

### State Management
- **Zustand** for global state with persist middleware
- Auth state in `src/stores/authStore.ts` - persisted to localStorage

### Authentication
- Token stored in both cookie (`auth_token`) and Zustand store
- Auth middleware in `src/middleware/auth.ts` protects routes
- Add `beforeLoad: authMiddleware` to protect new routes

### Form Input
- Using **React-Hooks-Form** for input form

### Key Files
- `src/routes/__root.tsx` - Root layout with Header/Footer
- `src/routes/index.tsx` - Home/login page
- `src/routes/dashboard/index.tsx` - Protected dashboard
- `src/utils/cookies.ts` - Cookie helpers
- `src/styles.css` - Global styles with Tailwind

### Styling
- Tailwind CSS v4
- Components use Tailwind utility classes
