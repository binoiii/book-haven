# Architecture Decision Records

Each decision is recorded with its context, options considered, and rationale.

---

## ADR-001 — Framework

**Status:** Decided

**Context:** BookHaven is a public-facing e-commerce storefront. The homepage displays a live book catalogue sourced from a database, and cart mutations must be validated server-side against stock levels. Both pages are user-facing and the homepage is SEO-relevant (product listings should be indexable). The stack must support server-side data fetching, server-side business logic, and client-side interactivity within the same codebase.

---

### Decision: Next.js 16.2.4 — App Router

**Summary:** Next.js is chosen because SEO matters for online shops. Product listings must be indexable, images and fonts must be optimised for web performance, and stock levels must reflect what is actually in the database at the moment a user visits — not a cached snapshot. These are built-in Next.js capabilities. TanStack Router + Vite is the right choice when SEO is not a concern: internal tools, admin dashboards, and SPA applications where the app sits behind authentication and search engine visibility is irrelevant.

---

**Why Next.js over TanStack Router + Vite:**

TanStack Router + Vite produces a Single-Page Application by default. In an SPA, the browser receives a near-empty HTML shell and waits for JavaScript to download, parse, and execute before any content renders. For a book catalogue this has two concrete problems:

1. **SEO** — Search engine crawlers index the HTML they receive. An empty shell means book titles, authors, and prices are invisible to crawlers. A shop's product listings are its primary indexable content.
2. **Stock accuracy** — Without SSR, book data must be fetched client-side via an API route. This introduces a loading waterfall: the user sees a blank grid, then a spinner, then the books. Every request also hits an API that must in turn hit the database — an unnecessary round trip Next.js Server Components eliminate entirely.
3. **Web performance** — Next.js ships `next/image` (automatic format conversion, lazy loading, size optimisation for Amazon CDN covers) and `next/font` (self-hosted Google Fonts with zero layout shift). Both are non-trivial to replicate in a Vite SPA.

To use TanStack Router + Vite for this project you would need to add: a separate API server (or API routes via a plugin), an SSR adapter, and manual configuration for image and font optimisation. You are building what Next.js provides out of the box.

**When TanStack Router + Vite is the right choice:**
- Internal tools and admin dashboards that sit behind authentication — crawlers never reach them, so SEO is irrelevant
- Pure SPAs where the team wants zero framework conventions and full control over the bundle
- Applications where the backend is owned by a separate team and the frontend only consumes a REST or GraphQL API
- When server rendering is genuinely not needed and you want the fastest possible dev startup and lightest bundle

---

### Decision: App Router over Pages Router

**Why App Router:**

| Concern | App Router | Pages Router |
|---------|-----------|--------------|
| Data fetching | Fetch directly inside Server Components — data lives next to the component that needs it | `getServerSideProps` runs outside the component; data is passed down as props |
| Server-side mutations | Server Actions — stock check and cart validation in the same file as the UI | Requires a separate `/api` route for every mutation |
| Layouts | Nested layouts re-render only the changed segment | `_app.tsx` and `_document.tsx` are global; shared layouts require manual wrapping |
| Rendering model | Per-component (Server or Client, declared explicitly) | Per-page (SSR, SSG, or ISR via export functions) |
| React alignment | Built on React Server Components — the direction React itself is moving | Pre-RSC model; not receiving new features from Vercel |

For this project specifically:
- The homepage fetches books **inside** the Server Component — no `getServerSideProps`, no prop drilling
- The "Add to Cart" stock check runs as a **Server Action** — no `/api/cart` route needed
- The cart page layout shares the same Header as the homepage via a **nested layout** with zero extra configuration

**When Pages Router is the right choice:**
- Existing Next.js codebases already on Pages Router where the migration cost outweighs the benefit
- Teams with deep Pages Router familiarity working under a tight deadline
- When a critical third-party library has not yet added RSC/App Router support and a workaround is not acceptable
- Simpler projects where the RSC mental model (server/client boundaries, serialisable props) adds more confusion than value

---

### Rendering strategy per route

| Route / Component | Strategy | Rationale |
|-------|----------|-----------|
| `/` | **SSR** | Stock levels are time-sensitive. ISR would cache stale availability — a user could add an out-of-stock book to cart. Fresh DB read on every request is the correct trade-off for a shop. |
| `/cart` | **Server shell + CSR content** | `app/cart/page.tsx` is a Server Component — the heading, back link, and page layout are server-rendered. `CartContent` inside it is a Client Component: cart state lives in Zustand, hydrated from `localStorage`. Rendering the cart server-side would cause a hydration mismatch since the server has no cart state. |
| `BookCatalogClient` | **Client Component** | The Server→Client handoff for the homepage. Receives the full book list from `BookCatalog` (Server Component) as a serialisable prop, then manages client-side search/filter state via `useSearchStore`. |
| `BookCard` | **Client Component** | The "Add to Cart" button calls a Server Action and updates Zustand — both require a client context. The component receives the `Book` as a serialisable prop from its server-rendered parent. |
| `CartContent` | **Client Component** | Reads Zustand store which hydrates from `localStorage` on mount. Must be a Client Component; there is no server-side cart state. |

**Consequences:** The `app/` directory structure is used throughout. All database access happens in Server Components or Server Actions — never in Client Components. The client/server boundary is explicit via `'use client'` directives.

---

## ADR-002 — Database

**Status:** Decided

**Context:** Book data must come from somewhere. The README explicitly marks PostgreSQL + Docker as the preferred option and lists four evaluation signals: industry-standard relational database, production-grade approach, full-stack understanding, and containerisation skills. The ORM must generate TypeScript types from the schema to maintain a single source of truth.

---

### Decision: PostgreSQL 16 (Docker) + Prisma

**Summary:** PostgreSQL + Docker is chosen because it directly satisfies the four evaluation signals in the README. Prisma is chosen as the ORM because it generates TypeScript types from the schema (eliminating the need to maintain types separately), produces readable versioned migration files, and is the most widely recognised ORM in the Next.js ecosystem.

---

**Why PostgreSQL + Docker over Supabase:**

Supabase is PostgreSQL under the hood and is a valid choice, but it requires an external account and internet connectivity. More importantly, it abstracts away the containerisation layer — the very skill the assessment is evaluating. Docker Compose with a properly configured PostgreSQL service (pinned version, health check, named volume, environment variables from `.env`) is a concrete demonstration of production infrastructure knowledge.

**When Supabase is the right choice:**
- You need to ship quickly with no local infrastructure setup
- The project requires Supabase-specific features (real-time subscriptions, built-in auth, storage)
- Docker is not available or not permitted in the environment

---

**Why Prisma over Drizzle or raw `pg`:**

| Concern | Prisma | Drizzle | Raw `pg` |
|---------|--------|---------|----------|
| Type generation | Auto-generated from schema | Inferred from TypeScript schema | Manual — cast from `any` |
| Migrations | Timestamped SQL files in `prisma/migrations/` | Generated via `drizzle-kit` | Write by hand |
| Seeding | `prisma db seed` built-in | Manual script | Manual script |
| Ecosystem recognition | Highest | Growing fast | Universal |
| Bundle / overhead | Generates a query engine binary | Lightweight, no binary | Minimal |

Prisma's migration files are human-readable SQL stored under version control — a reviewer can read the schema evolution like a changelog. The `prisma/schema.prisma` file replaces `src/lib/books.ts` as the single source of truth for the `Book` type.

**When Drizzle is the right choice:**
- You want SQL-like syntax in TypeScript and maximum control over queries
- Bundle size and cold-start performance are critical (no binary generation step)
- The team is already familiar with Drizzle and the SQL-first mental model
- You need fine-grained query optimisation that Prisma's abstraction gets in the way of

---

**Docker Compose setup:**

```yaml
services:
  postgres:
    image: postgres:16-alpine        # pinned version, not latest
    container_name: bookhaven_db
    environment:
      POSTGRES_DB: bookhaven
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data   # data persists across restarts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d bookhaven"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Next.js runs locally (`npm run dev`), not in Docker. Hot reloading inside a container adds friction without benefit during development. The Docker skill is demonstrated through the database setup.

---

**Schema:**

```prisma
model Book {
  id     Int    @id @default(autoincrement())
  title  String
  author String
  price  Float
  cover  String  // Amazon CDN URL
  sku    String  @unique
  stock  Int     @default(0)
}
```

---

**`stock` field — beyond the requirements**

The README does not explicitly require stock management. It is included deliberately as a production-grade consideration. A real online shop must prevent users from adding unavailable books to their cart and surface availability clearly at every stage of the journey.

How `stock` is used across the shopping journey:

| Stage | Usage | In scope |
|-------|-------|----------|
| **Homepage** | Books with `stock === 0` display an "Out of Stock" badge; "Add to Cart" button is disabled | ✅ |
| **Add to Cart** | Server Action validates `stock > 0` before confirming the cart update; client rolls back optimistic update on failure | ✅ |
| **Cart page** | Stock re-validated on load; user warned if a book sold out while in the cart | ✅ |
| **Checkout** | `stock` decremented; final hard enforcement against race conditions | ❌ Out of scope |

Including `stock` without a checkout flow is intentional — it demonstrates awareness of the full e-commerce lifecycle and keeps the schema production-realistic from day one.

---

**Stock reservation — Level 1 vs Level 2**

There are two industry approaches to preventing overselling. Understanding the difference is part of designing the schema and cart correctly.

**Level 1 — Soft reservation (this project)**

Stock is checked at the point of "Add to Cart" but not locked. No inventory is held while the book sits in a user's cart. Stock is only decremented at checkout.

- Risk: Two users can both have the last copy in their cart simultaneously. Only the first to check out succeeds; the second receives an error at payment.
- Mitigation: Clear error messaging at checkout ("Sorry, this item is no longer available").
- Used by: Most e-commerce platforms — Amazon, Book Depository, Shopify stores.
- Why it fits here: No checkout flow exists. The Server Action stock check on "Add to Cart" is sufficient to demonstrate the pattern.

**Level 2 — Hard reservation (not implemented)**

Adding to cart creates a server-side reservation row in the database with a TTL (e.g. 15 minutes). The available stock displayed to other users is `stock - reserved`. When the TTL expires or the user removes the item, the hold is released automatically.

- Risk eliminated: Overselling is impossible — the second user sees "Out of Stock" before they can add to cart.
- Added complexity: Requires a `reservations` table, a session or user identifier, a background job to expire stale holds, and the cart is no longer purely client-side.
- Used by: Airlines (seat holds), concert ticketing (Ticketmaster), limited-edition product drops.
- Why it does not fit here: No authentication, no session management, no checkout. The complexity cost is not justified by the project scope.

**Schema addition required for Level 2 (not built, documented for completeness):**
```prisma
model Reservation {
  id        Int      @id @default(autoincrement())
  bookId    Int
  sessionId String
  expiresAt DateTime
  book      Book     @relation(fields: [bookId], references: [id])
}
```

**Consequences:** Prisma Client is used in Server Components and Server Actions only — never imported into Client Components. The `DATABASE_URL` environment variable connects to the Docker container. `prisma migrate dev` manages schema changes; `prisma db seed` populates initial book data.

---

## ADR-003 — Styling

**Status:** Decided

**Context:** The application needs a consistent visual design with responsive layouts, a white light theme, and accessible interactive components. Book cover images arrive from Amazon CDN in inconsistent sizes and aspect ratios — the styling solution must handle visual normalisation cleanly. The assessment explicitly evaluates accessibility.

---

### Decision: Tailwind CSS + shadcn/ui

**Summary:** Tailwind CSS handles all layout, typography, spacing, and custom styling. shadcn/ui provides the interactive, accessibility-critical components (buttons, badges, cards, toasts, skeletons). Together they cover the full surface area without competing styling systems or unnecessary reinvention.

---

**Why Tailwind CSS over CSS Modules:**

CSS Modules scope styles per component, which prevents conflicts — but that discipline must be maintained manually through CSS custom properties and consistent naming. Tailwind enforces consistency through its design system: spacing, colour, and typography tokens are defined once (in `globals.css` via `@theme inline` for v4) and used everywhere. There are no class name collisions because there are no custom class names to collide.

For a responsive book grid with consistent card layouts, Tailwind's utility classes express the intent directly in the markup — `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6` is more readable than importing a module and maintaining a separate `.grid` class that does the same thing.

**When CSS Modules is the right choice:**
- Large teams where Tailwind's inline classes become hard to scan in code review
- Projects with a complex, pre-existing design system expressed in CSS variables
- When you want strict separation between structure (JSX) and style (CSS) as a team convention

---

**Why shadcn/ui over alternatives:**

shadcn/ui is not a traditional npm component library — components are copied into `src/components/ui/` via `npx shadcn@latest add <component>`. You own the code and can modify it freely. The accessibility layer comes from **Radix UI primitives** underneath: ARIA roles, keyboard navigation, focus trapping, and screen reader announcements are handled correctly without building them from scratch.

| Library | Accessibility | Tailwind-native | Ownership | Fit |
|---------|--------------|-----------------|-----------|-----|
| **shadcn/ui** | Radix UI (excellent) | Yes — built for it | Copy-paste, lives in your repo | ✅ |
| **Headless UI** | Good (Tailwind Labs) | Yes | npm package | Fewer components |
| **Radix UI (primitives only)** | Excellent | No styling | npm package | shadcn/ui is Radix + Tailwind — redundant |
| **MUI / Chakra / Mantine** | Good | No — own styling system | npm package | Conflicts with Tailwind |
| **HeroUI** | Radix-based | Yes | npm package | Less community adoption than shadcn/ui |

The key insight: Radix UI is the accessibility layer; shadcn/ui is Radix UI with Tailwind styling and a copy-paste workflow. Using MUI or Chakra alongside Tailwind introduces two competing styling systems — unnecessary complexity for no gain.

---

**Components used from shadcn/ui:**

| Component | Used for |
|-----------|---------|
| `Badge` | Out of Stock / low stock indicator on `StockBadge` |
| `Card` | `BookCard` container |
| `Skeleton` | Loading skeleton for book cards and grid |
| `Sonner` (Toast) | Out-of-stock error feedback on Add to Cart rollback |

All buttons in the application are custom styled HTML `<button>` elements — the shadcn/ui `Button` component is installed but not consumed. All layout, grid, typography, and custom styling is built on Tailwind directly — shadcn/ui covers only the structural and feedback pieces.

---

**Image normalisation strategy:**

Book covers from Amazon CDN arrive in inconsistent sizes and aspect ratios. Rather than a fill container, `BookCardImage` renders each cover at fixed dimensions (90×150px by default) with `object-contain`, framed inside a decorative book effect — a left-edge spine shadow and right-edge page lines rendered as `aria-hidden` overlays:

```tsx
<Image
  src={src}
  alt={`Book cover of ${alt}`}
  width={width}
  height={height}
  sizes={`${width}px`}
  className="rounded-md object-contain shadow-lg"
  style={{ width, height }}
/>
```

`object-contain` is chosen over `object-cover` — book covers have meaningful content at their edges (titles, spine text). Cropping is worse than letterboxing. Fixed dimensions enforce visual consistency across all cards regardless of source image proportions.

**Consequences:** Tailwind CSS v4 has no `tailwind.config.ts` — all design tokens (colours, typography, spacing) are defined in `globals.css` via `@theme inline` as CSS custom properties. PostCSS is still required via `@tailwindcss/postcss`. shadcn/ui components are initialised via `npx shadcn@latest init` and added individually as needed. `next.config.ts` must include `m.media-amazon.com` in `images.remotePatterns` for `next/image` to serve Amazon CDN URLs.

---

## ADR-004 — Cart State Management

**Status:** Decided

**Context:** Cart state must be centralised, shared across the Homepage and Cart page without prop drilling, and persisted across page refreshes via `localStorage`. Cart mutations (Add to Cart) are async — they go through a Server Action for stock validation before the cart is confirmed. The state solution must handle optimistic updates and rollbacks cleanly.

---

### Decision: Zustand + optimistic update pattern

**Summary:** Zustand is chosen for its minimal boilerplate, built-in `persist` middleware, and native support for async actions. Cart mutations follow an optimistic-first pattern — the store updates immediately for instant UI feedback, the Server Action validates stock in parallel, and the update is rolled back if the server returns an error.

---

**Why Zustand over the alternatives:**

| | Zustand | React Context + useReducer | Jotai | Redux Toolkit |
|---|---|---|---|---|
| Bundle cost | ~1 kB | Zero (built-in) | ~3 kB | ~10 kB |
| Boilerplate | Very low | Low–medium | Low | High |
| DevTools | Yes | Requires extra setup | Yes | Yes |
| localStorage persistence | `persist` middleware — one line | Manual `useEffect` + localStorage hook | `atomWithStorage` | `redux-persist` |
| Async actions | Native — just use `async/await` in actions | Requires middleware or side effects in components | Native | `createAsyncThunk` |
| Complexity fit | Right-sized for cart | Right-sized but more setup | Right-sized | Overkill |

The decisive factor is the `persist` middleware. With Zustand, localStorage persistence is a single wrapper:

```ts
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({ ... }),
    { name: "cart" }
  )
)
```

With React Context + useReducer, you write a `useEffect` that listens to state changes and serialises to `localStorage`, plus a separate initialisation step that reads from `localStorage` on mount and dispatches a hydration action — all before the first render to avoid a flash of empty cart. That is not complex, but it is boilerplate Zustand eliminates entirely.

**When React Context + useReducer is the right choice:**
- Zero-dependency constraint — no external packages permitted
- The team is deeply familiar with the Context + useReducer pattern and wants to demonstrate pure React knowledge
- The state shape is simple enough that the extra persistence boilerplate is not a burden
- A codebase that deliberately avoids third-party state libraries for long-term maintainability

**When Jotai is the right choice:**
- You prefer an atomic model where individual pieces of state are composed rather than a single store object
- The application has many independent state slices that benefit from fine-grained subscription (only re-renders the component that reads the changed atom)

**When Redux Toolkit is the right choice:**
- Large-scale application with many developers where standardised patterns and strict conventions matter more than conciseness
- Complex state with many interdependent slices, middleware requirements (logging, analytics), and time-travel debugging needs

---

### Add to Cart — Optimistic Update Pattern

Cart mutations go through a Server Action that validates stock before confirming. Two approaches exist:

**Optimistic first (chosen):**
1. User clicks "Add to Cart"
2. Zustand store updates immediately — UI reflects the change instantly
3. Server Action called in parallel to validate stock
4. If server returns success — state is already correct, nothing to do
5. If server returns error — roll back the Zustand update, show a toast ("Sorry, this book is out of stock")

**Wait for server:**
1. User clicks "Add to Cart"
2. Server Action called — UI shows a loading state
3. On success — Zustand store updates
4. On error — show error, nothing to roll back

Optimistic first is chosen because it matches how users expect a modern shop to feel — the cart updates the moment they click, not after a round trip to the server. The rollback path handles the failure case gracefully. For a book shop where stock errors are rare, optimistic first is the right UX trade-off.

**When wait-for-server is the right choice:**
- Stock errors are frequent and a rollback would feel jarring (e.g. very limited inventory drops where most add-to-cart attempts will fail)
- The action has irreversible side effects that cannot be undone client-side (e.g. a payment charge — never optimistic)
- The latency of the Server Action is low enough that the loading state is imperceptible

```tsx
// Optimistic update pattern in BookCard
async function handleAddToCart() {
  const existing = items.find((i) => i.book.id === book.id);
  const newQuantity = (existing?.quantity ?? 0) + 1;

  if (newQuantity > book.stock) {                          // client-side guard
    toast.error(`Only ${book.stock} in stock`);
    return;
  }

  addToCart(book);                                                    // 1. update Zustand immediately
  const result = await addToCartAction(book.id, newQuantity);        // 2. validate server-side
  if (!result.success) {
    updateQuantity(book.id, newQuantity - 1);              // 3. roll back on failure
    toast.error(result.message);                           // 4. inform the user
  }
}
```

The rollback uses `updateQuantity` rather than `removeFromCart` so that it correctly handles both a first-add (rolls quantity to 0, which the store treats as a removal) and an increment of an existing item (rolls back to the previous quantity).

**Consequences:** The Zustand store is imported only in Client Components. Server Components and Server Actions never touch Zustand directly — they return results that Client Components use to confirm or roll back. `localStorage` rehydration happens automatically on mount via the `persist` middleware, eliminating flash of empty cart.

---

## ADR-005 — Testing Strategy

**Status:** Decided

**Context:** The README mandates exactly 11 Jest tests covering critical paths. Tests must be meaningful — behaviour over implementation. The stack introduces two async boundaries that affect how tests are written: Server Actions (stock validation) and Zustand persistence (localStorage). Both must be mocked at the module boundary so tests remain fast and isolated.

---

### Decision: Jest + @testing-library/react

**Summary:** Jest is the mandated framework. @testing-library/react is the standard companion for React component testing — it queries by role, label, and text (what the user sees) rather than by class names or component internals. Tests are written against user-facing behaviour, not implementation details.

---

**Why Jest over Vitest:**

Vitest is built on Vite's transform pipeline. Next.js does not use Vite — it uses SWC (its own Rust-based compiler). Using Vitest with Next.js requires manually mocking every framework-specific import: `next/image`, `next/navigation`, `next/headers`, `next/font`. Server Components are particularly problematic because they use Next.js-specific async APIs Vitest has no awareness of.

Next.js ships `@next/jest` — an official Jest transformer built on SWC that handles all framework-specific transforms automatically. The README also explicitly mandates Jest, removing any ambiguity.

**When Vitest is the right choice:**
- Vite-based projects (React + Vite, TanStack Router + Vite) — natively compatible, faster than Jest, no mocking overhead
- If this project had used TanStack Router + Vite instead of Next.js, Vitest would be the obvious pick
- Projects with no framework-specific imports that require special handling

---

**Why @testing-library/react over Enzyme:**

Enzyme queries component internals — instance methods, component state, class names. It tests how a component is built, not what it does. @testing-library/react queries by ARIA role, label text, and visible content — the same signals a user (or screen reader) uses. Tests written this way survive refactors; Enzyme tests break when you rename a class or restructure a component tree.

Enzyme is largely deprecated in the React community and has limited support for React 18+.

**When Enzyme might still be encountered:**
- Legacy codebases on React 16 or earlier that have not migrated
- Maintaining existing Enzyme test suites where migration cost is high

---

**Mocking strategy:**

| Boundary | Mock approach |
|----------|--------------|
| Server Actions (`addToCartAction`) | `jest.mock` at the module level — return success or error to test both paths |
| Book data | `__fixtures__/books.ts` exports typed mock `Book` objects — passed as props or injected via `useCartStore.setState()`. No Prisma mock needed; component tests never reach the database layer. |
| `localStorage` | jsdom provides a working `localStorage` — no mock needed; test Zustand rehydration directly |
| `next/navigation` | `jest.mock('next/navigation')` — mock `useRouter`, `usePathname` as needed |

---

**PRD coverage audit:**

Tests were chosen by mapping against PRD user stories first, not by filling a quota.

| User Story | Test | Coverage |
|-----------|------|----------|
| US-01: Homepage renders books | Tests 5, 6 (BookCard renders correctly) | ⚠️ No direct homepage fetch test |
| US-02: Add to cart | Tests 1, 2, 7 | ✅ |
| US-03: Navigate to cart | Not tested — anchor tag, not logic | ➖ Intentionally skipped |
| US-04: See all cart items | Tests 9, 10 | ✅ |
| US-05: See cart total | Tests 4, 9 | ✅ |
| US-06: Remove from cart | Test 3 | ✅ |
| US-07: Cart persists after refresh | Test 11 | ✅ |
| US-08: Back link | Not tested — anchor tag, not logic | ➖ Intentionally skipped |
| US-09: Loading state | Not directly tested | ⚠️ Skeleton components exist but no dedicated test |
| US-10: Error state (fetch fails) | Test 7 (cart Server Action error path only) | ⚠️ Homepage fetch failure not covered |
| US-11: Empty cart state | Test 8 | ✅ |

Known gaps within the 11-test constraint: homepage fetch failure (US-10), homepage book rendering (US-01), and the loading skeleton (US-09) are not directly tested. These are acknowledged trade-offs — the 11 slots are allocated to higher-risk, higher-value behaviours.

---

**Final test distribution:**

| # | Test | File | User Story | Type |
|---|------|------|-----------|------|
| 1 | `addToCart` adds a new book to the store | `store/cartStore.test.ts` | US-02 | Unit |
| 2 | `addToCart` increments quantity for a duplicate book | `store/cartStore.test.ts` | US-02 | Unit |
| 3 | `removeFromCart` removes a book by id | `store/cartStore.test.ts` | US-06 | Unit |
| 4 | Cart total is correct for multiple items with quantities | `store/cartStore.test.ts` | US-05 | Unit |
| 5 | `BookCard` renders title, author, SKU, price and Add to Cart button | `components/features/BookCard.test.tsx` | US-01 | Component |
| 6 | `BookCard` shows Out of Stock badge and disabled button when `stock === 0` | `components/features/BookCard.test.tsx` | US-01, US-02 | Component |
| 7 | `BookCard` rolls back Zustand update and shows toast when Server Action returns an error | `components/features/BookCard.test.tsx` | US-02, US-10 | Integration |
| 8 | Cart page shows empty state when cart has no items | `components/features/CartContent.test.tsx` | US-11 | Component |
| 9 | Cart page renders all cart items with correct line totals and cart total | `components/features/CartContent.test.tsx` | US-04, US-05 | Component |
| 10 | Header shows the correct cart item count | `components/layout/Header.test.tsx` | US-04 | Component |
| 11 | Cart state is persisted to `localStorage` and rehydrated on remount | `store/cartStore.test.ts` | US-07 | Integration |

**Consequences:** Tests are co-located with their modules (`*.test.ts` / `*.test.tsx`). `jest.config.ts` uses `@next/jest` transformer. `jest.setup.ts` imports `@testing-library/jest-dom`. Environment is `jest-environment-jsdom`.

---

## ADR-007 — Git Hooks & Code Quality Gates

**Status:** Decided

**Context:** Every commit to the repository should pass linting, type checking, and formatting validation before it lands. Enforcing this at the CI level catches problems late; enforcing it at commit time catches them immediately and keeps the history clean. The solution must run only on staged files (not the full repo) to stay fast.

---

### Decision: Husky + lint-staged + commitlint + Prettier

**Summary:** Husky manages git hooks as files checked into `.husky/`. lint-staged runs linters only on the staged subset of files. commitlint enforces the Conventional Commits format on every commit message. Prettier enforces consistent formatting.

---

**Tools and their roles:**

| Tool | Role | Hook |
|------|------|------|
| `husky` | Installs and manages `.husky/` hook scripts in the repo | — |
| `lint-staged` | Runs configured commands against staged files only | `pre-commit` |
| `eslint` | Catches code quality issues and type-unsafe patterns | `pre-commit` via lint-staged |
| `tsc --noEmit` | Full TypeScript type check across the project | `pre-commit` via lint-staged |
| `prettier --write` | Enforces consistent code formatting, auto-fixes staged files | `pre-commit` via lint-staged |
| `commitlint` | Validates commit message format against Conventional Commits spec | `commit-msg` |

---

**Why lint-staged over running linters on the full repo:**

Running `eslint .` and `tsc --noEmit` on every commit in a growing codebase becomes progressively slower. lint-staged scopes each command to the files in the staging area — a one-file change runs the linter on one file. The TypeScript check is an exception: `tsc --noEmit` must check the whole project because a type error in an untouched file can be caused by a change in a staged file.

---

**Conventional Commits enforced by commitlint:**

All commit messages must follow the format: `type(optional-scope): description`

Valid types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`

Examples:
- `chore: configure Husky with lint-staged and commitlint` ✅
- `feat(cart): add optimistic update with rollback` ✅
- `fix stuff` ❌ — rejected by commitlint

**Why Conventional Commits:**
- Commit messages become machine-readable — changelogs can be generated automatically
- Type prefix makes the purpose of a commit immediately scannable in `git log`
- Enforced consistency across contributors regardless of habit

---

**Why Prettier:**

ESLint catches logical and type errors; Prettier handles formatting (indentation, quotes, trailing commas, line length). They solve different problems and do not overlap when configured correctly. Prettier is run with `--write` in the pre-commit hook — it auto-fixes staged files rather than failing the commit, so formatting is never a manual chore.

**Consequences:** `.husky/` is committed to the repo. `husky install` runs automatically via the `prepare` npm script so hooks are active for every developer after `pnpm install`. A commit with a linting error, type error, or malformed commit message is rejected before it reaches the history.

---

## ADR-006 — Project File Naming Conventions

**Status:** Decided

**Decision:**

| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `BookCard.tsx` |
| Hooks | camelCase, `use` prefix | `useCart.ts` |
| Constants files | camelCase | `ui.ts`, `routes.ts` |
| Test files | Same name, `.test.tsx` suffix | `BookCard.test.tsx` |
| CSS Modules | Same name, `.module.css` | `BookCard.module.css` |
| Page files (Next.js) | `page.tsx` (App Router) | `app/cart/page.tsx` |

**Consequences:** Predictable file locations. Co-located tests make coverage obvious at a glance.
