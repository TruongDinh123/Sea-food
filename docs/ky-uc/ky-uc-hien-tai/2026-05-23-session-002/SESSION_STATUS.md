# 📋 Session 002 — 2026-05-23

> **Trạng thái:** ✅ Hoàn thành — Bổ sung các flow còn thiếu và chuẩn hóa toàn bộ dự án theo cấu trúc Google Antigravity.

---

## ✅ Việc Đã Hoàn Thành

1. **Đọc tài liệu chính thức từ NotebookLM** về hệ sinh thái **Google Antigravity** để nắm vững các quy tắc phân cấp cấu hình (`AGENTS.md`, `GEMINI.md`, `.agents/rules/`), cơ chế workflows, hooks và skills.
2. **Tạo các file cấu hình cốt lõi ở Root:**
   - [AGENTS.md](file:///e:/Web-Seo/AGENTS.md) — Quy tắc chung cấp dự án (tech stack, safety, git, db, coding standards).
   - [GEMINI.md](file:///e:/Web-Seo/GEMINI.md) — Quy tắc riêng cho Gemini và quản lý context (5-turn reset warning).
   - [CLAUDE.md](file:///e:/Web-Seo/CLAUDE.md) — Cập nhật tối giản để tương thích ngược.
3. **Thiết lập Workspace Rules tự động (`.agents/rules/`):**
   - `code.md` (Glob: `src/**/*`) — Quy tắc coding.
   - `seo.md` (Glob: `src/app/**/*, src/pages/**/*, src/components/**/*`) — Quy tắc SEO On-page và HTML.
   - `database.md` (Glob: `db/**/*, src/lib/db/**/*, src/app/api/**/*`) — Quy tắc PostgreSQL, naming và soft delete.
   - `env.md` (Glob: `.env*`) — Bảo mật secrets và .env.
   - `commit.md` (Always On) — Chuẩn Conventional Commits.
4. **Cấu hình tự động hóa & mở rộng:**
   - [.agents/mcp_config.json](file:///e:/Web-Seo/.agents/mcp_config.json) — Tách biệt cấu hình MCP Servers.
   - [.agents/hooks.json](file:///e:/Web-Seo/.agents/hooks.json) — Cấu hình lifecycle hooks cho dự án.
   - [.agents/workflows/init-nextjs.md](file:///e:/Web-Seo/.agents/workflows/init-nextjs.md) — Thiết lập workflow `/init-nextjs`.
   - [.agents/skills/seafood-content/SKILL.md](file:///e:/Web-Seo/.agents/skills/seafood-content/SKILL.md) — Kỹ năng sinh nội dung SEO hải sản.
5. **Dọn dẹp:**
   - Xóa file `.mcp.json` dư thừa ở root.
   - Xóa thư mục quy tắc tĩnh `docs/quy-tac/` (đã chuyển hóa hoàn toàn sang `.agents/rules/`).

---

## 📁 Files Đã Tạo/Sửa

| File | Trạng thái |
|---|---|
| `e:/Web-Seo/AGENTS.md` | ✅ Đã tạo |
| `e:/Web-Seo/GEMINI.md` | ✅ Đã tạo |
| `e:/Web-Seo/CLAUDE.md` | ✅ Đã cập nhật |
| `e:/Web-Seo/.agents/rules/code.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/rules/seo.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/rules/database.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/rules/env.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/rules/commit.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/mcp_config.json` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/hooks.json` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/workflows/init-nextjs.md` | ✅ Đã tạo |
| `e:/Web-Seo/.agents/skills/seafood-content/SKILL.md` | ✅ Đã tạo |
| `e:/Web-Seo/.mcp.json` | 🗑️ Đã xóa |
| `e:/Web-Seo/docs/quy-tac/` | 🗑️ Đã xóa |

---

## 🔜 Bước Tiếp Theo (Conversation mới)

1. **Chạy workflow khởi tạo:** Gọi lệnh `/init-nextjs` để tự động hóa toàn bộ quá trình khởi tạo ứng dụng Next.js, cài đặt husky, commitlint và setup cấu trúc thư mục phát triển `src/`.
2. **Setup DB & Variables:** Tạo project Supabase và điền thông tin vào `.env.local` mới tạo.
3. **Triển khai các bảng đầu tiên:** Viết migration đầu tiên cho `merchants`, `products`, `referral_logs`.

---

## 💡 Quyết Định Thiết Kế Đã Đưa Ra

*   Chuyển toàn bộ quy tắc code tĩnh sang cơ chế tự động load theo glob pattern của Antigravity để tiết kiệm token và ngữ cảnh.
*   Cấu hình MCP riêng biệt trong thư mục `.agents/` theo đúng schema.
*   Sử dụng workflow để tự động hóa các thao tác lặp lại nhiều bước (như khởi tạo dự án).

---

*Session 002 thực hiện bởi Antigravity — 2026-05-23T15:46:00+07:00*
