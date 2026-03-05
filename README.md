# TS-Inventory

A full-stack inventory management application built with TanStack Start, featuring product management, customer management, and transaction tracking.

## Architecture

### Tech Stack
- **Framework**: TanStack Start (React full-stack with SSR)
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand with persist middleware
- **Forms**: React Hook Form
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Testing**: Vitest

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/             # Base UI components (Card, Modal, Table)
│   ├── Header.tsx      # Application header
│   ├── Footer.tsx      # Application footer
│   ├── Sidebar.tsx     # Admin dashboard sidebar
│   └── LoginBox.tsx    # Login form component
├── middleware/         # Route middleware
│   └── auth.ts        # Authentication middleware
├── modules/            # Domain layer (services & repositories)
│   ├── customer/      # Customer management module
│   ├── inventory/     # Product/inventory module
│   └── transaction/   # Transaction history module
├── routes/             # TanStack Router file-based routing
├── stores/            # Zustand state stores
├── router.tsx         # Router configuration
└── styles.css         # Global Tailwind styles
```

### Routes

| Path | Description |
|------|-------------|
| `/` | Home page with login |
| `/admin` | Admin layout with sidebar |
| `/admin/` | Dashboard with stats |
| `/admin/inventory` | Product inventory management |
| `/admin/customer` | Customer management |
| `/admin/transaction` | Transaction history |

### Authentication
- Mock authentication with simulated API delay
- Zustand store persists to localStorage
- Auth middleware available in `src/middleware/auth.ts` (currently commented out)

### Data Layer
- All data is stored in-memory (mock data)
- Services simulate API calls with artificial delays
- Repository pattern implemented for inventory module

---

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm (enabled via corepack)

### Installation

```bash
pnpm install
```

---

## Development

Run the development server on port 3000:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run all tests
pnpm test -- <file>  # Run a specific test file
```

---

## Production (Docker)

### Using Docker Compose

Build and run the production container:

```bash
docker-compose up -d --build
```

The production app will be available at `http://localhost:3000`

### Using Dockerfile Directly

```bash
# Build the image
docker build -t ts-inventory .

# Run the container
docker run -p 3000:3000 ts-inventory
```

### Docker Configuration

The Dockerfile uses a multi-stage build:
1. **Builder stage**: Installs dependencies and builds the application
2. **Production stage**: Runs the built output with a non-root user

Environment variables:
- `NODE_ENV=production` (set in docker-compose.yml)

### Managing the Container

```bash
# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## Testing

Run tests with Vitest:

```bash
pnpm test
```

Run a specific test file:

```bash
pnpm test -- src/some-test.test.ts
```
