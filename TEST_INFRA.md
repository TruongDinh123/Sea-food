# Seafood Dried Marketplace (Cà Mau) — E2E Testing Infrastructure

This document outlines the testing infrastructure, setup, and 4-tier E2E verification plan using Playwright.

---

## 🔧 Playwright Configuration & Environments

The test suite is built on **Playwright** (`@playwright/test`), configured to run against standard web viewports as well as mobile viewports:

- **Config File**: `playwright.config.ts`
- **Default Base URL**: `http://localhost:3000` (or customized via `PLAYWRIGHT_BASE_URL` env variable)
- **Browsers/Projects**:
  - `chromium`: Desktop Google Chrome viewport simulation.
  - `mobile-chrome`: Pixel 5 viewport simulation to verify responsive layout (375px) without horizontal overflow.
- **Failures & Traces**:
  - Video capturing: `retain-on-failure`
  - Screenshot capturing: `only-on-failure`
  - Trace viewer logs: `on-first-retry`

---

## 📂 Test Code Organization

All E2E tests are located inside the `/e2e` directory and are organized as follows:

```
e2e/
├── helpers/
│   ├── page-objects.ts     # Page Object Model (POM) page abstractions
│   └── test-utils.ts       # Seeding and setup helpers
├── tier1-feature-coverage.spec.ts   # Happy path testing for all user routes
├── tier2-boundary-cases.spec.ts     # Boundary validations, invalid slugs, empty states
├── tier3-cross-feature.spec.ts       # Combined flows and state updates
└── tier4-real-world-scenarios.spec.ts# Complete end-to-end user journeys
```

### Page Object Model (POM)
We enforce separating test script logic from CSS/HTML selector structures. The selectors and user action flows are abstracted in `e2e/helpers/page-objects.ts` within specific classes:
- `LandingPage`
- `CatalogPage`
- `MerchantPage`
- `BlogPage`
- `AuthPage`
- `MerchantDashboardPage`
- `AdminDashboardPage`

---

## 🧪 4-Tier Test Coverage Breakdown

Our E2E test suite adheres to the 4-tier testing methodology:

### Tier 1: Feature Coverage (Happy Paths)
* **Landing Page**: Check that header, footer, featured products, merchants, and blogs are visible, with compliant SEO H1 structure.
* **Product Catalog**: Verify page listing, categories, detail view, product JSON-LD schemas, and basic COD order submission.
* **Merchant Profile**: Verify vựa listing page, profile page, and JSON-LD LocalBusiness schemas.
* **SEO Blog**: Verify article listings, detail reading view, and JSON-LD Article Schema.
* **SEO Technical Files**: Assert correct HTTP 200 responses and MIME-types for `/sitemap.xml` and `/robots.txt`.
* **Auth**: Merchant registration flow and credentials verification.
* **Merchant Dashboard**: Product creation, deletion, order status updating, and profile modification.
* **Admin Dashboard**: Approving registered merchants, configuring merchant commission rates, and blog creation.

### Tier 2: Boundary & Corner Cases
* **Empty Lists**: Check UI state when price filters filter out all products (ensure "Không tìm thấy sản phẩm" message is visible).
* **Invalid Slugs**: Ensure non-existent products and articles trigger a clean 404.
* **Auth Input Validation**: Check warning states for invalid email structures and password lengths.
* **Zero & Negative Prices**: Verify validation warnings when trying to list products with $\le 0$ prices.
* **Form Field Length constraints**: Verify validation warnings when description content is under the minimum length.

### Tier 3: Cross-Feature Combinations
* **Order status change updates logs**: Transitioning order state to `completed` triggers calculation of referral log commissions and populates `referral_logs`.
* **Merchant Profile change updates detail page**: Editing merchant phone/address in dashboard updates public merchant page.
* **Blog Creation updates sitemap**: Admin publishing a new article dynamic updates sitemap XML URLs.

### Tier 4: Real-World Scenarios
* **Full E2E Buyer Checkout to Admin Audit Flow**:
  1. Buyer browses catalog and checks out via COD.
  2. Merchant views the order, transitions it from `pending` $\rightarrow$ `processing` $\rightarrow$ `shipping` $\rightarrow$ `completed`.
  3. Admin logs in, verifies the commission logs, calculates and checks accuracy of the $5\%$ rate on the order total.

---

## 🔄 Database State & Seeding

For testing over network/HTTP as an opaque-box tester, we call a test database seeding API helper:

- **Helper Function**: `resetDatabase(requestContext, action)` inside `e2e/helpers/test-utils.ts`.
- **API Endpoint**: `/api/test/db` (accepts POST request with `{ action: 'seed' | 'seed-edge-cases' | 'reset' }`).
- **Implementation Note**: During development, this endpoint seeds test users (`merchant@example.com`, `admin@example.com`), mock products, and clears out logs to guarantee test determinism.

---

## 🚀 Execution Guide

Make sure your development server or production build is running:

### Setup
Ensure dependencies and browsers are installed:
```bash
npm install
npx playwright install chromium
```

### Run All Tests
```bash
npx playwright test
```

### Debug & Traces
To debug tests visually or inspect traces:
```bash
npx playwright test --ui
npx playwright show-report
```
