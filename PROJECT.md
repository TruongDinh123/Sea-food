# Project: Seafood Dried Marketplace (Cà Mau)

## Architecture
- **Tech Stack**: Next.js (App Router), TailwindCSS v4, Supabase Postgres, `postgres` npm library, Vitest, Playwright.
- **Service-Repository Pattern**:
  - API Routes / Server Components call Services.
  - Services handle business logic (commissions, notifications, validations) and call Repositories.
  - Repositories handle raw SQL queries using connection pool.
- **Internal Directories**:
  - `src/lib/db/`: DB connection & migration script.
  - `src/lib/repositories/`: Raw SQL queries.
  - `src/lib/services/`: Core logic and validations.
  - `src/app/api/`: REST handlers.
  - `src/app/`: App router pages.
  - `src/components/`: UI components (ui, features, layout).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Infrastructure | Setup Playwright tests (Tiers 1-4) & TEST_INFRA.md | None | DONE |
| 2 | DB Migrations & Connection | Implement Postgres schema, RLS, migration runner | None | DONE |
| 3 | Repositories & Services | Service-Repository logic + Unit tests | M2 | DONE |
| 4 | Catalog, Blog & SEO Pages | Frontend public pages, sitemap, robots, JSON-LD | M3 | PLANNED |
| 5 | Auth & Dashboards | Merchant/Admin dashboards + auth flow | M3 | PLANNED |
| 6 | E2E Test Pass & Hardening | Run all E2E tests, fix issues, adversarial checks | M1, M4, M5 | PLANNED |

## Interface Contracts
### Order Management
- Order statuses: `pending`, `processing`, `shipping`, `completed`, `cancelled`.
- When Order status transitions to `completed`, order service calculates and records commission to `referral_logs`.
- When Order is created, order service prints email to stdout or sends via configured SMTP.

### SEO Schemas
- Product Detail: JSON-LD Product Schema.
- Blog Detail: JSON-LD Article Schema.
- Merchant Detail: JSON-LD LocalBusiness / Profile Schema.

## Code Layout
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - robots.txt
- `src/app/globals.css` - Global CSS styling (Be Vietnam Pro font, color variables)
- `db/migrations/` - SQL migration files
- `src/lib/db/migrate.ts` - Automatically runs migrations
