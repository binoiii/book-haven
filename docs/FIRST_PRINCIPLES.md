# First Principles

This document records the engineering standards and best practices applied in this project. Each principle explains the rule, the reasoning behind it, and how it manifests in the codebase. It is intended as a reference for anyone reading or extending the code.

---

## 1. Component Architecture — Layered Responsibility

Components are organised into three layers, each with a clearly defined role:

| Layer | Directory | Role |
|---|---|---|
| Primitive | `components/ui/` | Stateless, reusable building blocks with no business logic or domain knowledge. Comes from shadcn/ui. |
| Domain | `components/features/` | Business-logic components tied to a specific domain (books, cart). Know about the application. |
| Structural | `components/layout/` | Page-level composition. Define the chrome of the application (Header, Footer, transitions). |

**Why:** Mixing these concerns produces components that are hard to reuse and hard to reason about. A `Button` in `ui/` has no knowledge of books or carts — it can be dropped anywhere. A `BookCard` in `features/` knows about the domain but not about page layout. When a component grows too large, this hierarchy tells you where to extract it.

**Rule:** Never reach upward. A `ui/` component must not import from `features/`. A `features/` component must not import from `layout/`. Each layer may only import from the same layer or below.

---

## 2. Server / Client Boundary — Explicit and Deliberate

Next.js App Router components are Server Components by default. The `"use client"` directive opts a component (and all its imports) into the client bundle. Every boundary is a deliberate decision, not an accident.

| Route / Component | Strategy | Reason |
|---|---|---|
| `app/page.tsx` | SSR | Book availability is time-sensitive. A fresh DB read on every request prevents stale stock data. |
| `app/cart/page.tsx` | CSR | Cart state lives in Zustand/localStorage. There is no server-side cart to render. |
| `BookCard` | Client Component | Calls a Server Action and updates Zustand — both require a client context. |
| `CartContent` | Client Component | Reads Zustand store which hydrates from localStorage on mount. |
| `BookCatalog` | Server Component | Fetches books from Prisma directly. No client context needed. |

**Rule:** Server Components and Server Actions never import Zustand. Client Components never import Prisma. The `server/` directory is server-only by convention — importing it in a Client Component is a build error by design.

**Why:** Keeping data access on the server eliminates an entire class of security bugs (no credentials in the browser bundle) and avoids unnecessary client-side network waterfalls.

---

## 3. State Management — One Store, One Responsibility

Each Zustand store owns one domain of state:

- `cartStore` — cart items, quantities, totals, and persistence
- `searchStore` — the active search query

**Optimistic Update Pattern:** Cart mutations update Zustand immediately (instant UI feedback), then validate server-side via a Server Action. On failure, the store is rolled back and a toast is shown.

```ts
addToCart(book);                              // 1. update store immediately
const result = await addToCartAction(id, qty) // 2. validate server-side
if (!result.success) {
  updateQuantity(book.id, qty - 1);           // 3. roll back on failure
  toast.error(result.message);               // 4. inform the user
}
```

**Why optimistic-first:** For a shop where stock errors are rare, the perceived speed of an instant cart update outweighs the cost of an occasional rollback. The rollback path handles the failure case gracefully without leaving the UI in an inconsistent state.

**Persistence:** The `persist` middleware in `cartStore` serialises cart state to `localStorage` with a single wrapper — no manual `useEffect`, no hydration boilerplate. Cart survives page refreshes automatically.

---

## 4. Semantic HTML — One Landmark Per Role

Every page has exactly one `<main>` element. The root layout uses `<div className="grow">` to fill vertical space; each page renders its own `<main>` with its specific max-width and padding.

**Why:** Screen readers and browser accessibility tools expose landmark elements (`<main>`, `<header>`, `<footer>`, `<nav>`) as navigation targets. Multiple `<main>` elements on a single page confuse assistive technology and violate the HTML specification.

**Rule:** `app/layout.tsx` must never render a `<main>`. Pages own their `<main>`.

---

## 5. Accessibility — Built In, Not Bolted On

Accessibility is treated as a first-class requirement, not an afterthought:

- **ARIA labels** on all icon-only interactive elements (`aria-label` on cart icon, quantity buttons, search clear button).
- **Live regions** (`aria-live="polite"`) on dynamic content — the quantity display in `CartItem` and the search results count in `BookCatalogClient` announce changes to screen readers without stealing focus.
- **`role="group"`** on the quantity control cluster in `CartItem` with a descriptive `aria-label`.
- **`role="alert"`** on the remove confirmation dialog in `CartItem` so screen readers announce it immediately.
- **`sr-only`** on the `<h1>` in `app/page.tsx` so the page has a meaningful document title without duplicating the visible heading.
- **Disabled states** — out-of-stock buttons are `disabled` with a descriptive `aria-label` ("`{title} is out of stock`") so the reason is communicated, not just the state.

---

## 6. Styling — Native Tailwind, No Arbitrary Values

All styling uses Tailwind CSS v4 utility classes. Custom design tokens are defined once in `globals.css` under `@theme inline` and consumed as native Tailwind classes everywhere else.

**Rules:**
- Never use arbitrary value syntax (`text-[9px]`, `w-[372px]`). If a value is needed repeatedly, add it to the theme.
- Never inline one-off magic numbers into class strings.
- `text-xxs` (10px), `font-sans`, `font-serif` — these are theme-defined tokens, not library defaults.

**Why:** Arbitrary values break out of the design system. They create one-off values that can't be globally updated, are invisible to the theme, and drift over time. A custom token defined in one place can be changed in one place.

---

## 7. Constants — Single Source of Truth for Strings

All user-visible strings live in `constants/ui.ts`. Components import from there — no inline string literals for copy.

**Why:** When copy changes (and it always does), there is one place to update. It also makes the full vocabulary of the UI scannable in a single file.

**Rule:** When a constant is no longer referenced anywhere, delete it. Dead constants are technical debt — they suggest features still exist when they do not. When a new user-facing string is introduced, add it to `constants/ui.ts` before writing it into JSX.

---

## 8. Testing — Behaviour Over Implementation

Tests are written against what the user sees and does, not against component internals.

**Stack:** Jest + `@testing-library/react`. Queries use `getByRole`, `getByText`, `getByTestId` — the same signals a user or screen reader uses. Never query by class name or component instance.

**Mocking strategy:**

| Boundary | Approach |
|---|---|
| Server Actions | `jest.mock` at the module level — returns success or error to test both paths |
| Book data | `__fixtures__/books.ts` exports typed mock `Book` objects — injected via `useCartStore.setState()` or passed as props. No Prisma mock needed. |
| `localStorage` | jsdom provides a real implementation — Zustand `persist` is tested directly without mocking |
| Toast notifications | `jest.mock('sonner')` — assert `toast.error` was called with the right message |

**Co-location:** Test files live next to the module they test (`BookCard.test.tsx` next to `BookCard.tsx`). Coverage gaps are visible at a glance — a component without a `.test.tsx` sibling is obviously untested.

**What not to test:** Pure navigation (anchor tags with `href`), static markup with no logic, and third-party library internals. Test the behaviour your code is responsible for.

---

## 9. TypeScript — Types From the Schema, Not Beside It

The `Book` type is generated by Prisma from `schema.prisma`. It is the single source of truth — no separate `types/Book.ts` file that can drift out of sync with the database schema.

**Rule:** When the schema changes, run `prisma generate`. The TypeScript types update automatically. Never manually maintain a type that mirrors a database model.

**Why:** Dual-maintenance of types and schemas is a guaranteed source of bugs. The compiler catches mismatches when types are generated, not when they're hand-written.

---

## 10. File and Import Hygiene

- **No unused imports.** An import that isn't referenced is deleted, not left as a comment or disabled.
- **No dead code.** Removed features have their constants, types, and helper functions removed alongside them. Code left behind after a feature removal implies the feature still exists.
- **Named exports only** for components and utilities. Default exports are reserved for Next.js page and layout conventions (which require them).
- **Path aliases** (`@/*`) are used throughout. Relative imports (`../../components/...`) are avoided — they break on file moves and are harder to read.

---

## 11. Git Hygiene — Conventional Commits

Every commit message follows the Conventional Commits format: `type(scope): description`.

Valid types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`.

**Why:** The type prefix makes `git log` scannable at a glance. It creates a machine-readable history (changelogs can be generated automatically). It enforces a discipline of committing one logical change at a time — if a commit is hard to categorise, it is probably doing too much.

**Enforced by:** `commitlint` via a Husky `commit-msg` hook. A malformed commit message is rejected before it enters the history.

**Pre-commit hooks** (via `lint-staged`): ESLint, TypeScript type check, and Prettier run automatically on staged files before every commit. A commit with a lint error or type error never reaches the history.

---

## 12. Database — Migrations as the Changelog

Schema changes are made in `prisma/schema.prisma` and committed as migration files in `prisma/migrations/`. Each migration file is human-readable SQL.

**Rules:**
- Never edit a migration file after it has been applied. Create a new migration instead.
- `prisma db seed` uses `upsert` — it is safe to run multiple times without creating duplicate records.
- Prisma Client is instantiated once as a singleton in `server/db.ts`. This prevents connection pool exhaustion in development (Next.js hot reload creates new module instances).

**Why:** Migrations are a version-controlled changelog of the database schema. A reviewer can read the history of the schema the same way they read the history of the code.
