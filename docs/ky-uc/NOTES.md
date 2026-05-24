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

**Đang làm:** Sprint 3 + 4 ✅ HOÀN THÀNH
**Tiến độ:** 13/13 tasks — Tất cả 4 sprint đã xong
**Bước tiếp theo:** Bắt đầu xây dựng sản phẩm thực tế — `/ba-sprint` để lập kế hoạch Sprint sản phẩm 1

---

## 🏗️ Kiến Trúc Đã Quyết Định

| Quyết Định | Lý Do | Ngày |
|---|---|---|
| Service-Repository Pattern | Tách biệt business logic khỏi data access | 2026-05-24 |
| TailwindCSS v4 css-first | Không dùng tailwind.config.js | 2026-05-24 |
| Soft-delete (deleted_at) | Không xóa vật lý dữ liệu user | 2026-05-24 |
| Orchestrator-Worker agents | Tech Lead điều phối các Worker agents | 2026-05-24 |
| Plan-and-Execute workflow | Phù hợp long-horizon coding tasks | 2026-05-24 |

---

## 📁 Files Đã Tạo / Sửa (Session này)

| File | Hành Động | Mô Tả Ngắn |
|---|---|---|
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

1. **AGENTS.md chỉ 45 dòng** — Cần mở rộng lên 200-300 dòng với "Why" explanations.
2. **`session-manager/SKILL.md` rỗng** — Chưa có nội dung.
3. **`seafood-content` thiếu `resources/`** — Keywords và templates đang nhồi vào SKILL.md.
4. **Hooks chưa cấu hình** — `hooks.json` rỗng, chưa có auto-lint.
5. **Supabase MCP chưa thêm** — Chỉ có `next-devtools` trong `mcp_config.json`.

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
