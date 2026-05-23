# 📋 Session 001 — 2026-05-23

> **Trạng thái:** ✅ Hoàn thành — Đây là phiên khai vị của dự án.

---

## ✅ Việc Đã Hoàn Thành

1. **Truy cập NotebookLM** — Lấy toàn bộ chuẩn SEO từ "Google Search Central SEO Best Practices Guide".
2. **Phân tích ý tưởng** — Đánh giá khả thi cao cho sàn hải sản Cà Mau, làm rõ mô hình 3 Trụ cột.
3. **Thống nhất chiến lược** — Lean Startup: kéo traffic trước, tự động hóa hoa hồng, mở sàn sau.
4. **Lưu tài liệu** — `docs/plan/bao_cao_toan_dien.md` và `CLAUDE.md` ở thư mục gốc.
5. **Xây dựng cấu trúc thư mục** — `docs/ky-uc/`, `docs/quy-tac/`, `docs/plan/`, `docs/TC/`.
6. **Tạo quy tắc HTML** — Lấy dữ liệu từ NotebookLM, lưu vào `docs/quy-tac/quy-tac-the-html/`.
7. **Tạo quy tắc Code** — Lưu chuẩn code Next.js + Clean Code vào `docs/quy-tac/quy-tac-code/`.

---

## 📁 Files Đã Tạo/Sửa

| File | Trạng thái |
|---|---|
| `e:/Web-Seo/CLAUDE.md` | ✅ Đã tạo |
| `e:/Web-Seo/docs/plan/bao_cao_toan_dien.md` | ✅ Đã tạo |
| `e:/Web-Seo/docs/ky-uc/ky-uc-goc/README.md` | ✅ Đã tạo (READONLY) |
| `e:/Web-Seo/docs/ky-uc/ky-uc-hien-tai/README.md` | ✅ Đã tạo |
| `e:/Web-Seo/docs/quy-tac/quy-tac-the-html/README.md` | ✅ Đã tạo (READONLY) |
| `e:/Web-Seo/docs/quy-tac/quy-tac-code/README.md` | ✅ Đã tạo (READONLY) |

---

## 🔜 Bước Tiếp Theo (Conversation mới)

1. **Cài đặt next-devtools-mcp** — Chạy lệnh cài đặt từ https://www.npmjs.com/package/next-devtools-mcp
2. **Khởi tạo dự án Next.js** — `npx create-next-app@latest ./` với cấu hình chuẩn SEO
3. **Setup database schema** — Tạo migration file cho 3 bảng cốt lõi: `merchants`, `products`, `referral_logs`

---

## 💡 Quyết Định Kỹ Thuật Đã Đưa Ra

- Next.js SSR/SSG là bắt buộc (không dùng CSR thuần)
- Database: PostgreSQL (Supabase free tier)
- Tất cả link điều hướng phải dùng `<a href>` tĩnh, không dùng `onclick` JS
- URL dùng dấu `-`, toàn chữ thường, không dùng `#` cho nội dung
- Commission type: dynamic (per product, per percentage, monthly flat)
