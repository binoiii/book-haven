# BookHaven

An online bookshop built with Next.js 16, PostgreSQL, Prisma, Zustand, and Tailwind CSS.

---

## Tech Stack

| Layer     | Choice                              |
| --------- | ----------------------------------- |
| Framework | Next.js 16 (App Router)             |
| Database  | PostgreSQL 16 (Docker)              |
| ORM       | Prisma 6                            |
| State     | Zustand 5 with `persist` middleware |
| Styling   | Tailwind CSS 4 + shadcn/ui          |
| Testing   | Jest 30 + React Testing Library     |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Docker** + Docker Compose (for the database)

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

The defaults in `.env.example` work out of the box with the Docker setup:

```
POSTGRES_USER=bookhaven
POSTGRES_PASSWORD=bookhaven
DATABASE_URL="postgresql://bookhaven:bookhaven@localhost:5432/bookhaven"
```

### 3. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container named `bookhaven_db` on port `5432`. Data is persisted in a named Docker volume (`postgres_data`) across restarts.

Wait for the health check to pass before the next step:

```bash
docker compose ps
# STATUS should show "healthy"
```

### 4. Run database migrations

```bash
pnpm exec prisma migrate deploy
```

This applies the migration in `prisma/migrations/` and creates the `Book` table.

### 5. Seed the database

```bash
pnpm exec prisma db seed
```

Seeds the database with the book catalogue from `prisma/data/books.ts` using upsert — safe to run multiple times.

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
# Run all tests once
pnpm test

# Run in watch mode (re-runs on file change)
pnpm test:watch

# Run a single test file
pnpm exec jest components/features/CartContent.test.tsx

# Run tests matching a name pattern
pnpm exec jest -t "adds a new book"
```

### Test suite overview

| #   | Test                                                                       | File                                       | Type        |
| --- | -------------------------------------------------------------------------- | ------------------------------------------ | ----------- |
| 1   | `addToCart` adds a new book to the store                                   | `store/cartStore.test.ts`                  | Unit        |
| 2   | `addToCart` increments quantity for a duplicate book                       | `store/cartStore.test.ts`                  | Unit        |
| 3   | `removeFromCart` removes a book by id                                      | `store/cartStore.test.ts`                  | Unit        |
| 4   | Cart total is correct for multiple items with quantities                   | `store/cartStore.test.ts`                  | Unit        |
| 5   | `BookCard` renders title, author, SKU, price and Add to Cart button        | `components/features/BookCard.test.tsx`    | Component   |
| 6   | `BookCard` shows Out of Stock badge and disabled button when `stock === 0` | `components/features/BookCard.test.tsx`    | Component   |
| 7   | `BookCard` rolls back Zustand update and shows toast on server error       | `components/features/BookCard.test.tsx`    | Integration |
| 8   | Cart page shows empty state when cart has no items                         | `components/features/CartContent.test.tsx` | Component   |
| 9   | Cart page renders all cart items with correct line totals and cart total   | `components/features/CartContent.test.tsx` | Component   |
| 10  | Header shows the correct cart item count                                   | `components/layout/Header.test.tsx`        | Component   |
| 11  | Cart state is persisted to `localStorage` and rehydrated on remount        | `store/cartStore.test.ts`                  | Integration |

---

## Project Structure

```
app/
  page.tsx                  # Homepage — SSR, fetches books from DB
  cart/page.tsx             # Cart page — Server Component shell, content client-rendered from Zustand
  layout.tsx                # Root layout (Header + Footer)
  loading.tsx               # Suspense fallback for homepage
  error.tsx                 # Error boundary for homepage
  global-error.tsx          # Root-level error boundary

components/
  features/                 # Domain components
    BookCard.tsx            # Book card with Add to Cart (optimistic update)
    BookCardImage.tsx       # Image subcomponent for BookCard
    BookCardSkeleton.tsx    # Loading skeleton for a single book card
    BookCatalog.tsx         # Server component — fetches and renders the book grid
    BookCatalogClient.tsx   # Client wrapper — server→client handoff for search/filter
    BookGrid.tsx            # Responsive grid layout for book cards
    BookGridSkeleton.tsx    # Loading skeleton for the full book grid
    BrowseSectionHeader.tsx # Section heading + result count for the catalogue
    CartContent.tsx         # Cart page container
    CartItem.tsx            # Individual cart row (quantity controls)
    CartSummary.tsx         # Cart total + checkout CTA
    SearchInput.tsx         # Controlled search/filter input
    StockBadge.tsx          # Out of Stock / low stock badge
  layout/
    Header.tsx              # Site header with cart icon + item count
    Footer.tsx              # Site footer
    Logo.tsx                # BookHaven logo mark
    PageTransition.tsx      # Page-level transition wrapper
  ui/                       # shadcn/ui primitives (Badge, Card, Skeleton, Sonner)

store/
  cartStore.ts              # Zustand cart store — add, remove, update quantity, total, persist
  searchStore.ts            # Zustand search/filter store

hooks/
  useCart.ts                # Selector hook — exposes cart store to components

server/
  db.ts                     # Prisma client singleton
  actions/
    cartActions.ts          # Server Action — validates stock before confirming add to cart

lib/
  utils.ts                  # Tailwind class merge utility (cn)

prisma/
  schema.prisma             # Book model
  migrations/               # Versioned SQL migrations
  seed.ts                   # Upserts book catalogue
  data/books.ts             # Seed data

docs/
  ARCHITECTURE_DECISIONS.md # ADRs — framework, database, styling, state, testing, conventions
  FIRST_PRINCIPLES.md       # Engineering standards and best practices

constants/                  # Centralised UI strings and config
types/                      # Shared TypeScript types
__fixtures__/books.ts       # Mock Book objects for tests
```

---

## Key Architecture Decisions

Full rationale for each decision is in `docs/ARCHITECTURE_DECISIONS.md`.

**Next.js App Router** — Homepage uses SSR so book availability and stock levels are always fresh from the database. The cart page is a Server Component shell; its content (`CartContent`) is client-rendered because cart state lives in `localStorage` via Zustand.

**Optimistic cart updates** — Clicking "Add to Cart" updates Zustand immediately for instant feedback, then a Server Action validates stock server-side. On failure the store is rolled back and a toast is shown.

**Zustand + `persist`** — Cart survives page refreshes via automatic `localStorage` serialisation with a single middleware wrapper.

**Prisma** — Generates TypeScript types from `schema.prisma`, eliminating a separate types file. Migrations are human-readable SQL under version control.

---

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start Next.js development server     |
| `pnpm build`      | Production build                     |
| `pnpm start`      | Start production server              |
| `pnpm lint`       | Run ESLint                           |
| `pnpm test`       | Run Jest (all tests)                 |
| `pnpm test:watch` | Run Jest in watch mode               |
| `pnpm commit`     | Commitizen interactive commit prompt |

---

## Database Management

```bash
# Open Prisma Studio (visual DB browser)
pnpm exec prisma studio

# Create a new migration after schema changes
pnpm exec prisma migrate dev --name describe-your-change

# Reset the database (drops all data)
pnpm exec prisma migrate reset

# Stop the database container
docker compose down

# Stop and delete all data
docker compose down -v
```
