---
type: project
created: 2026-05-25
updated: 2026-05-29
---

# Project Conventions

## Git Workflow
- Always create a new dedicated branch for major code changes.
- Branch name format should follow: `feature/[task-slug]` or `fix/[bug-slug]`.
- Never push directly to `main` — all changes go through branch → PR.
- Commit format: `<type>(<scope>): <subject>` (Conventional Commits v1.0).

## Commit Types & Scopes

| Types | Scopes |
|:---|:---|
| `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore` | `product`, `merchant`, `seo`, `api`, `db`, `ui`, `auth` |

## Verification Before "Done"

```bash
npm run type-check    # TypeScript check (không dùng npm run build)
npm run lint          # ESLint check
```

Nếu có thay đổi logic: chạy thêm `npm run test` (hoặc viết test).

## Key Paths

| Nội Dung | Đường Dẫn |
|:---|:---|
| Granular Rules | `.agents/rules/` |
| Memory Files | `.agents/memory/` |
| Skills | `.agents/skills/` |
| Workflows | `.agents/workflows/` |
| Design System | `Design_system/` → `src/app/globals.css` |
| Session Notes | `docs/ky-uc/NOTES.md` |
| Implementation Plans | `docs/ke-hoach/` |
