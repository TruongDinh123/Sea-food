# 📝 NOTES.md — Working Memory Agent
# Dự Án: Hải Sản Cà Mau
#
# ⚠️ File này được agent TỰ CẬP NHẬT liên tục trong suốt quá trình làm việc.
# Mục đích: Chống context rot — agent ghi lại tiến trình để có thể tiếp tục
# sau khi context window bị reset hoặc giữa các phiên làm việc.
#
# Cấu trúc: Đọc từ trên xuống. Section mới nhất ở ĐẦU FILE.
# Sau mỗi task lớn hoàn thành → agent cập nhật file này NGAY.

---

## 📍 Trạng Thái Hiện Tại
> *Agent cập nhật section này sau mỗi bước lớn*

**Đang làm:** Phát triển Tầng Dữ Liệu & API (Sprint 1 Backend) ✅ HOÀN THÀNH
**Tiến độ:** Đã hoàn tất 4 task Backend cốt lõi: định nghĩa Types Layer (`src/types/`), xây dựng Repository & Service layer cho cả Merchant & Product, và thiết lập API route `/api/merchants` có phân trang. Đã sửa toàn bộ lỗi typescript `any` để đảm bảo hệ thống build và lint vượt qua 100% không có lỗi.
**Bước tiếp theo:** Bàn giao phiên làm việc cho Frontend Dev (`/dev-fe-dinh`) để thực hiện các task UI của Sprint 1 (globals.css, layout chung, trang thương lái/sản phẩm và sitemap/robots.txt).

---

## 🏗️ Kiến Trúc Đã Quyết Định

| Quyết Định | Lý Do | Ngày |
|---|---|---|
| Service-Repository Pattern | Tách biệt business logic khỏi data access | 2026-05-24 |
| TailwindCSS v4 css-first | Không dùng tailwind.config.js | 2026-05-24 |
| Soft-delete (deleted_at) | Không xóa vật lý dữ liệu user | 2026-05-24 |
| Orchestrator-Worker agents | Tech Lead điều phối các Worker agents | 2026-05-24 |
| Plan-and-Execute workflow | Phù hợp long-horizon coding tasks | 2026-05-24 |
| ProductGroup Schema | Hỗ trợ tôm sú có nhiều phân loại kích cỡ (variants) | 2026-05-25 |
| maxIterations: 10 | Tránh vòng lặp vô hạn (infinite loop) tốn token | 2026-05-25 |

---

## 📁 Files Đã Tạo / Sửa (Session này)

**Backend Development — 2026-05-25 (Session 006)**

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| `src/types/merchant.types.ts` | TẠO MỚI | Định nghĩa Types cho thực thể vựa hải sản |
| `src/types/product.types.ts` | TẠO MỚI | Định nghĩa Types cho sản phẩm và biến thể |
| `src/types/referral.types.ts` | TẠO MỚI | Định nghĩa Types cho log đối soát |
| `src/lib/repositories/merchant.repository.ts` | TẠO MỚI | Repository CRUD cho vựa hải sản (Soft Delete, no SELECT *) |
| `src/lib/repositories/product.repository.ts` | TẠO MỚI | Repository cho sản phẩm (hỗ trợ slug prefix, JOIN merchant) |
| `src/lib/services/merchant.service.ts` | TẠO MỚI | Service xử lý logic, validation và phân trang vựa hải sản |
| `src/lib/services/product.service.ts` | TẠO MỚI | Service xử lý sản phẩm và nhóm biến thể (ProductGroup) |
| `src/app/api/merchants/route.ts` | TẠO MỚI | API Route GET `/api/merchants` có phân trang, gọi qua Service |
| `docs/ke-hoach/implementation_plan.md` | SỬA | Cập nhật kế hoạch triển khai Backend Sprint 1 |
| `docs/ke-hoach/task.md` | SỬA | Cập nhật tiến độ hoàn thành của các task Backend |

**Sprint 1 Planning — 2026-05-25 (Session 005)**

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| `docs/adr/ADR-001-nextjs-seo-folder-structure.md` | TẠO MỚI | Tài liệu quyết định kiến trúc cấu trúc thư mục SEO cho Next.js 16.2.6 |
| `AGENTS.md` | SỬA | Cập nhật sơ đồ cấu trúc thư mục src/ chi tiết tối ưu SEO |
| `docs/ke-hoach/sprint-01.md` | TẠO MỚI | Kế hoạch Sprint 1 phân rã task cho BE, FE và QA |
| `docs/ke-hoach/task.md` | TẠO MỚI | Checklist theo dõi tiến độ của Sprint 1 |
| `docs/ky-uc/ky-uc-hien-tai/2026-05-25-session-005/walkthrough.md` | TẠO MỚI | Báo cáo hoàn thành thiết lập cấu trúc SEO & Kế hoạch Sprint 1 |

**Sprint 6 + Metrics — 2026-05-25**

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| `.agents/skills/writing-seafood-content/*` | TẠO MỚI | Di chuyển và chuẩn hóa kỹ năng viết nội dung theo dạng gerund |
| `.agents/skills/writing-seafood-content/assets/schema-templates.md` | SỬA | Bổ sung template ProductGroup schema cho tôm sú phân loại |
| `AGENTS.md` | SỬA | Thêm quy tắc SEO về pagination canonical và Pyramid internal link |
| `.agents/workflows/*.md` (10 files) | SỬA | Thêm maxIterations: 10 vào frontmatter và Phạm vi để tránh Rogue loops |
| `.agents/scripts/load-working-memory.js` | SỬA | Thêm tip hướng dẫn --add-tokens |
| `.agents/scripts/track-session-metrics.js` | TẠO MỚI | Script tracking input/output token, turns, cảnh báo, chi phí |
| `.agents/data/session-metrics.json` | TẠO MỚI | File lưu trữ dữ liệu metrics (gitignored) |
| `.agents/data/README-metrics.md` | TẠO MỚI | Hướng dẫn sử dụng hệ thống metrics |
| `.agents/hooks.json` | SỬA | Thêm PreInvocation --show và PostInvocation --turn hooks |
| `.gitignore` | SỬA | Ignore session-metrics.json |
| `docs/ke-hoach/implementation_plan.md` | TẠO MỚI | Kế hoạch triển khai khắc phục lỗ hổng kiến trúc |
| `docs/ke-hoach/task.md` | TẠO MỚI | Checklist theo dõi tiến độ của Sprint 6 |

**Sprint 5 — 2026-05-25 (Hotfixes Hạ Tầng)**

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| `.agents/scripts/load-working-memory.js` | TẠO MỚI | Script Node.js cross-platform đọc working memory từ NOTES.md |
| `.agents/hooks.json` | SỬA | Chuyển PreInvocation hook CMD thô sang gọi script Node.js |
| `.agents/skills/session-manager/SKILL.md` | SỬA | Bổ sung quy trình nén ngữ cảnh tự động (Context Compaction) |
| `GUARDRAILS.md` | SỬA | Bổ sung Bảng chống biện minh (Anti-Rationalization Table) |
| `docs/plan/comprehensive_project_audit_evaluation.md` | TẠO MỚI | Báo cáo đánh giá và phản biện toàn diện của đợt Project Audit |

| `GEMINI.md` | TẠO MỚI | Antigravity config, agent roles, artifact rules |
| `GUARDRAILS.md` | TẠO MỚI | Failure patterns và safety constraints |
| `docs/ky-uc/NOTES.md` | TẠO MỚI | File này — working memory |
| `.agents/workflows/tech-lead-an.md` | TẠO MỚI | Tech Lead agent workflow |
| `.agents/workflows/dev-be-dat.md` | TẠO MỚI | Backend Dev agent workflow |
| `.agents/workflows/dev-fe-dinh.md` | TẠO MỚI | Frontend Dev agent workflow |
| `.agents/workflows/dev-ops-duc.md` | TẠO MỚI | DevOps agent workflow |
| `.agents/workflows/qa-vi.md` | TẠO MỚI | QA Engineer workflow |
| `.agents/workflows/pm-quan.md` | TẠO MỚI | Product Manager workflow |
| `.agents/workflows/ba-sprint.md` | TẠO MỚI | BA Sprint Planner workflow |
| `.agents/workflows/resume.md` | TẠO MỚI | Session resume workflow |

**Sprint 2 — 2026-05-25**

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
| `.agents/skills/seafood-content/SKILL.md` | SỬA (refactor) | Rút gọn — chỉ instructions, tham chiếu references/ và assets/ |
| `.agents/skills/seafood-content/references/keywords.md` | TẠO MỚI | Từ khóa SEO + search intent mapping |
| `.agents/skills/seafood-content/references/tone-of-voice.md` | TẠO MỚI | Brand voice, giọng điệu, từ ngữ nên/không nên dùng |
| `.agents/skills/seafood-content/assets/blog-template.md` | TẠO MỚI | Template bài viết blog chuẩn SEO |
| `.agents/skills/seafood-content/assets/product-description-template.md` | TẠO MỚI | Template mô tả sản phẩm |
| `.agents/skills/seafood-content/assets/schema-templates.md` | TẠO MỚI | JSON-LD schema cho Article và Product |
| `.agents/skills/session-manager/SKILL.md` | TẠO MỚI | 3 quy trình: Start, Handoff, Mid-session update |
| `.agents/mcp_config.json` | SỬA | Thêm Supabase MCP server + --read-only flag |
| `.env.example` | SỬA | Thêm SUPABASE_ACCESS_TOKEN |

---

## ⚠️ Gotchas & Constraints Quan Trọng

### Hiện Tại (2026-05-25)

1. **`src/components/` CHƯA TẠO** — Cần `/dev-fe-dinh` để tạo `ui/`, `features/`, `layout/` trong Sprint 1.
2. **`src/lib/repositories/` và `src/lib/services/` CHƯA TẠO** — Cần `/dev-be-dat` để tạo trong Sprint 1.
3. **`src/types/` CHƯA TẠO** — Cần tạo TypeScript type definitions trước khi viết service/repository.
4. **Terminal Sandbox chưa enable** — Cần bật `enableTerminalSandbox` trong Antigravity IDE Settings (Windows: AppContainer).
5. **Không có CI/CD pipeline** — Chưa có `.github/workflows/`. Cần tạo trong Sprint 2.

### Đã Giải Quyết (RESOLVED)
- ~~AGENTS.md chỉ 45 dòng~~ → **232 dòng** ✅
- ~~Hooks chưa cấu hình~~ → **PostToolUse + PreInvocation + PostInvocation** ✅
- ~~session-manager/SKILL.md rỗng~~ → **176 dòng, đầy đủ 4 quy trình** ✅
- ~~Supabase MCP chưa thêm~~ → **Đã có + --read-only** ✅
- ~~maxIterations chưa có~~ → **Tất cả 10 workflows đều có maxIterations: 10** ✅

---

## 🔍 Context Kỹ Thuật Cần Nhớ

### Database
- Supabase PostgreSQL — connection qua `src/lib/db/`
- Migrations trong `db/migrations/` — đặt tên `{NNN}_{action}_{object}.sql`
- Soft delete: cột `deleted_at TIMESTAMPTZ`

### Frontend
- Font: `Be Vietnam Pro` (Google Fonts)
- Màu: `#0D6EFD` (primary), `#198754` (secondary)
- TailwindCSS v4: `@theme` trong `globals.css`

### Git
- Branch đang dùng: *(agent điền vào khi cần)*
- Không push thẳng lên `main`

---

## 📋 Hướng Dẫn Agent: Cách Dùng File Này

1. **Đầu mỗi phiên:** Đọc file này TRƯỚC khi làm bất cứ việc gì.
2. **Sau mỗi task lớn:** Cập nhật section "Trạng Thái Hiện Tại" và "Files Đã Tạo/Sửa".
3. **Khi phát hiện gotcha mới:** Thêm vào section "Gotchas & Constraints".
4. **Khi quyết định kiến trúc:** Thêm vào bảng "Kiến Trúc Đã Quyết Định".
5. **Không xóa lịch sử** — chỉ thêm mới, thông tin cũ vẫn valuable.
