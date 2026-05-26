# Checklist Thực Thi: Đồng Bộ Thiết Kế & Nâng Cấp Hệ Thống Bảo Mật

- [x] 1. Đồng Bộ Hóa Hệ Thống Thiết Kế (Design System & CSS)
    - [x] Cập nhật `Design_system/DESIGN.md` sang Fresh Seafood style (font Be Vietnam Pro, màu Ocean Blue/Forest Green)
    - [x] Cập nhật `Design_system/token.json`
    - [x] Cập nhật `@theme` trong `src/app/globals.css` để dùng màu của Fresh Seafood
- [x] 2. Thiết Lập Hooks Bảo Mật
    - [x] Tạo script `.agents/scripts/validate-destructive-commands.js` kiểm tra lệnh huỷ hoại
    - [x] Cấu hình `"PreToolUse"` hook trong `.agents/hooks.json`
- [x] 3. Xây Dựng Semantic Knowledge Base
    - [x] Tạo `docs/knowledge/database-schema.md` (database facts & RLS)
    - [x] Tạo `docs/knowledge/seo-patterns.md` (Pyramid links, canonical, JSON-LD schemas)
    - [x] Tạo `docs/knowledge/component-patterns.md` (Tailwind v4 component tokens)
- [x] 4. Chuẩn Hóa Tham Chiếu & Quản Lý Dữ Liệu
    - [x] Chuẩn hóa relative link `GUARDRAILS.md` trong `.agents/skills/session-manager/SKILL.md`
    - [x] Tạo `e:\Web-Seo\.agents\data\README.md` cho thư mục data
    - [x] Cập nhật NOTES.md & GUARDRAILS.md với chính sách archive sessions cũ
- [x] 5. Kiểm Chứng & Build Nghiệm Thu
    - [x] Chạy `npm run lint` kiểm tra lỗi cú pháp (Thành công 100%)
    - [x] Chạy `npm run build` kiểm tra compile Next.js (Thành công 100%)
