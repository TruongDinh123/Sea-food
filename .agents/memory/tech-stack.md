---
type: tech-stack
created: 2026-05-29
updated: 2026-05-29
---

# 📦 Tech Stack Snapshot

> File này giúp tác tự mới nắm bắt tech stack mà không cần đọc toàn bộ package.json.

## Core Framework

| Layer | Technology | Version | Ghi Chú |
|:---|:---|:---:|:---|
| Frontend | Next.js (App Router) | latest | **Không dùng Pages Router** |
| UI Library | React | 19+ | Server Components là mặc định |
| Language | TypeScript | 5+ | Strict mode bật |
| Styling | TailwindCSS v4 | v4 (css-first) | **Không dùng tailwind.config.js** |
| Font | Be Vietnam Pro | Google Fonts | **Bắt buộc cho giao diện tiếng Việt** |

## Backend & Database

| Layer | Technology | Ghi Chú |
|:---|:---|:---|
| Database | PostgreSQL via Supabase | RLS bật, soft delete bắt buộc |
| ORM | Supabase JS Client | Không dùng Prisma |
| Auth | Supabase Auth | (nếu cần) |
| Pattern | Service-Repository | Bắt buộc: API → Service → Repository → DB |

## Dev Tools

| Tool | Mục Đích | Config File |
|:---|:---|:---|
| ESLint | Linting | `eslint.config.mjs` |
| commitlint | Commit format | `commitlint.config.js` |
| Husky | Git hooks | `.husky/` |
| Playwright | E2E Testing | `playwright.config.ts` |
| Vitest | Unit Testing | (chưa config, cần setup) |

## Design System

- **Palette chủ đạo:** Muted luxury deepwater
  - `#031e25` — Deepwater Teal (nền chính/Hero)
  - `#e5e7eb` — Canvas (nền phụ, viền)
  - `#0a0a0a` — Ink Black (chữ tiêu đề)
  - `#ffffff` — Pure White (chữ trên nền tối)
- **Nguồn Design System:** `Design_system/` → đồng bộ vào `src/app/globals.css`
- **Cấm:** Arbitrary values (`rounded-[32px]`), pixel thô, font Inter/Soehne

## Architecture Boundaries

```
Nguồn sự thật: AGENTS.md → Mục "Domain Isolation"

Frontend Agent:  src/app/, src/components/, public/
Backend Agent:   src/lib/, src/app/api/, db/, src/types/
DevOps Agent:    next.config.ts, package.json, .env.example, .husky/
QA Agent:        src/**/*.test.ts, e2e/
```
