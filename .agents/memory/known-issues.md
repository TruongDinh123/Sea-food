---
type: known-issues
created: 2026-05-29
updated: 2026-05-29
---

# 🐛 Các Lỗi Đã Biết & Workarounds

> Ghi lại các lỗi có pattern lặp lại để tác tự mới không mắc lại.  
> Xem thêm failure patterns chi tiết trong `GUARDRAILS.md` (root).

---

## KI-001: npm run build đóng băng máy local

**Phát hiện:** 2026-05-29  
**Triệu chứng:** Chạy `npm run build` (next build) làm máy local bị đơ do tốn RAM.  
**Workaround:** Dùng `npm run type-check` thay thế để kiểm tra TypeScript.  
**Quy tắc:** Tác tự **không được tự động** chạy `npm run build`. Chỉ chạy khi user yêu cầu trực tiếp.

---

## KI-002: Arbitrary Tailwind values gây inconsistency

**Phát hiện:** 2026-05-25  
**Triệu chứng:** Tác tự sử dụng giá trị như `rounded-[32px]`, `p-[20px]` thay vì các class từ Design System.  
**Workaround:** Luôn check `Design_system/` và `src/app/globals.css` trước khi dùng bất kỳ class spacing/border.  
**Quy tắc:** Cấm tuyệt đối arbitrary values. Dùng class được đăng ký trong `@theme`.

---

## KI-003: Canonical URL sai trên trang phân trang

**Phát hiện:** 2026-05-25  
**Triệu chứng:** Trang page=2, page=3 bị canonical về trang 1 → Googlebot coi là duplicate content.  
**Workaround:** Mỗi trang phân trang phải có self-referencing canonical.  
**Quy tắc:** `alternates.canonical` phải trỏ về URL của chính trang đó, không phải trang 1.

---

> *Thêm issue mới khi phát hiện lỗi có pattern. Format: `KI-NNN: Tiêu đề ngắn gọn`*

---

## KI-004: notes field bị drop tại Repository layer ✅ RESOLVED

**Phát hiện:** 2026-06-01 — Từ `victory_auditor_phase1_mvp/audit_report.md`
**Resolved:** 2026-06-01 — teamwork gen2 đã fix toàn bộ flow
**Trạng thái:** ✅ Code đã fix. ⚠️ Migration `009_add_notes_to_orders.sql` cần chạy thủ công trên Supabase dashboard.

**Xác minh đã fix:**
- `order.repository.ts:88` — `notes?: string | null` trong `create()` signature ✅
- `order.repository.ts:104` — `if (notes !== undefined) data.notes = notes;` ✅
- `order.service.ts:91` — `input.notes` passed to `orderRepo.create()` ✅
- `db/migrations/009_add_notes_to_orders.sql` — Migration tồn tại ✅

**Việc còn lại:** Chạy migration `009_add_notes_to_orders.sql` trên Supabase SQL Editor.

---

## KI-005: Field naming discrepancy — price vs price_per_kg

**Phát hiện:** 2026-06-01 — Từ `worker_blog_order_m1/handoff.md`
**Triệu chứng:** Spec tài liệu gốc đề cập `price_per_kg` nhưng kiểu dữ liệu thực tế trong `product.types.ts` dùng `price`. Các agent mới có thể sử dụng sai tên field.
**Workaround:** Luôn kiểm tra `src/types/product.types.ts` trước khi reference Product fields. Field chính xác là `price` (không phải `price_per_kg`).
**Quy tắc:** Không dùng `price_per_kg` trong code — dùng `price`.

---

## KI-006: Lỗi react-hooks/refs (Cannot access ref value during render)

**Phát hiện:** 2026-06-07  
**Triệu chứng:** Khai báo một mảng các buttons/items động trong render phase (hoặc useMemo) mà các items đó chứa các closures gọi giá trị của ref (`textareaRef.current`) sẽ vi phạm quy tắc render của React và gây lỗi eslint: `Cannot access ref value during render`.  
**Workaround:** Định nghĩa các JSX button tĩnh tường minh trong code giao diện và gọi event handler trực tiếp thay vì lặp qua một mảng dynamic.  
**Quy tắc:** Tránh tạo closures gọi ref bên trong các mảng động định nghĩa trong render phase. Viết code JSX tĩnh nếu các hành động gọi trực tiếp tới ref.

---

## KI-007: Vercel build lỗi ENETUNREACH khi kết nối Supabase Direct

**Phát hiện:** 2026-06-08  
**Triệu chứng:** Build Vercel báo lỗi `connect ENETUNREACH` khi Next.js prerender các trang tĩnh. Host direct Supabase (`db.xxxx.supabase.co`) chỉ có IPv6, Vercel không hỗ trợ IPv6.  
**Workaround:** Dùng Connection Pooler: `aws-1-ap-southeast-1.pooler.supabase.com:6543`. Thêm `?pgbouncer=true` vào URL. Bật `prepare: false` khi URL chứa `pooler.supabase.com`.  
**Quan trọng:** Host pooler dự án này là `aws-1` (KHÔNG phải `aws-0`).

---

## KI-008: migrate.ts gây lỗi permission denied khi chạy trên Supabase Cloud

**Phát hiện:** 2026-06-08  
**Triệu chứng:** `npm run db:migrate` báo `permission denied for schema auth`. File migrate.ts có câu `CREATE SCHEMA IF NOT EXISTS auth` cứng — trên Supabase Cloud bị bảo vệ.  
**Workaround:** Bọc lệnh tạo schema/table auth vào khối `DO  BEGIN IF NOT EXISTS (...) THEN ... END IF; END ;`.

---

## KI-009: Không thể INSERT vào auth.users qua seed script trên Supabase Cloud

**Phát hiện:** 2026-06-08  
**Triệu chứng:** `INSERT INTO auth.users ... ON CONFLICT (email)` báo lỗi constraint không tồn tại.  
**Workaround:** Tạo user qua MCP `execute_sql` với đủ cột: `id, aud, role, email, encrypted_password, email_confirmed_at, is_sso_user, is_anonymous`.  
**Cảnh báo:** Hệ thống login dùng plaintext password — cần nâng cấp bcrypt trước production thực tế.

---

## KI-010: Production domain + DNS configuration

**Phát hiện:** 2026-06-09  
**Thông tin:** Domain `haisancamau.vn` và `www.haisancamau.vn` trỏ vào Vercel qua A record `76.76.21.21`. DNS quản lý tại Matbao.net. Vercel project: `dinhs-projects/web-seo`.
