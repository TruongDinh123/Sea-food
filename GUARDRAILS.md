# GUARDRAILS.md — Learned Constraints & Failure Patterns
# Dự Án: Hải Sản Cà Mau (e:/Web-Seo)
#
# Đây là file SỐNG — agent tự cập nhật khi phát hiện failure pattern mới.
# Không xóa các mục cũ, chỉ thêm mới và đánh dấu ngày phát hiện.
# Format: [YYYY-MM-DD] SEVERITY: Mô tả pattern → Giải pháp

---

## 🔴 CRITICAL — Tuyệt Đối Không Làm

### [2026-05-24] CRITICAL: Database Destructive Operations
**Pattern vi phạm:** Agent chạy `DROP TABLE`, `TRUNCATE`, `DELETE` không có `WHERE` mà không có approval.
**Tác động:** Mất toàn bộ dữ liệu production.
**Guardrail:** Trước bất kỳ lệnh SQL destructive nào, PHẢI:
1. In ra SQL sẽ thực thi.
2. Giải thích tác động.
3. Dừng và chờ user gõ "XÁC NHẬN" hoặc "CONFIRM".
**Không có exception.**

### [2026-05-24] CRITICAL: Commit Trực Tiếp Lên main
**Pattern vi phạm:** Push code thẳng lên branch `main` mà không qua PR.
**Tác động:** Bypass code review, có thể break production.
**Guardrail:** Luôn tạo branch feature, commit lên đó, rồi thông báo cho user tạo PR. Không bao giờ `git push origin main`.

### [2026-05-24] CRITICAL: In Secrets Ra Terminal/Log
**Pattern vi phạm:** `console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)` hoặc in `.env.local` ra terminal.
**Tác động:** Secrets bị lộ trong log, screenshot, conversation history.
**Guardrail:** Không bao giờ in giá trị của bất kỳ biến môi trường nào có chứa: `KEY`, `SECRET`, `PASSWORD`, `TOKEN`, `PRIVATE`.

---

## 🟠 HIGH — Failure Patterns Đã Gặp

### [2026-05-24] HIGH: Context Pollution Sau Session Dài
**Pattern vi phạm:** Sau ~1 giờ làm việc liên tục, agent bắt đầu:
- Import từ file không tồn tại
- Đặt tên biến không nhất quán với code đã viết trước
- Quên constraints đã được nói ở đầu conversation
**Tác động:** Bug âm thầm, không compile được.
**Guardrail:**
1. Sau mỗi 3-4 task lớn, chủ động viết tóm tắt trạng thái vào `docs/ky-uc/NOTES.md`.
2. Trước khi tạo file mới, luôn kiểm tra `src/` để tránh trùng lặp.
3. Khi không chắc tên hàm/type → đọc lại file type definition trước khi code.

### [2026-05-24] HIGH: Direct DB Query Trong Component
**Pattern vi phạm:** Gọi Supabase client trực tiếp trong Server Component hoặc API Route mà không qua Repository/Service layer.
**Tác động:** Vi phạm Service-Repository Pattern, khó test, khó maintain.
**Guardrail:** Mọi truy vấn DB phải đi qua `*.repository.ts` → `*.service.ts`. Nếu chưa có repository → tạo repository trước, không dùng shortcut.

### [2026-05-24] HIGH: Thiếu Error Handling Trong API Route
**Pattern vi phạm:** API route không có try/catch, trả về 500 với stack trace cho client.
**Tác động:** Lộ thông tin nội bộ, UX xấu.
**Guardrail:** Mọi API Route Handler phải có try/catch. Error response chỉ trả về `{ error: 'message' }`, không trả về stack trace hay internal error details.

---

## 🟡 MEDIUM — Code Quality Patterns

### [2026-05-24] MEDIUM: Thêm 'use client' Không Cần Thiết
**Pattern vi phạm:** Đặt `'use client'` ở đầu page hoặc component không cần browser API/state/effects.
**Tác động:** Toàn bộ component tree bị hydrate phía client, tăng bundle size, giảm SEO.
**Guardrail:** Trước khi thêm `'use client'`, kiểm tra: Component này có dùng `useState`, `useEffect`, `onClick`, `onChange`, hay Browser API không? Nếu không → xóa `'use client'`.

### [2026-05-24] MEDIUM: SELECT * Trong Query
**Pattern vi phạm:** `SELECT * FROM products` thay vì chỉ rõ cột cần lấy.
**Tác động:** Tốn băng thông, tăng memory footprint, lộ dữ liệu không cần thiết.
**Guardrail:** Luôn liệt kê cột: `SELECT id, name, price_per_kg FROM products`.

### [2026-05-24] MEDIUM: Hard-Delete Thay Vì Soft-Delete
**Pattern vi phạm:** Dùng `DELETE FROM table WHERE id = $1` cho user-facing data.
**Tác động:** Không thể khôi phục dữ liệu, mất audit trail.
**Guardrail:** Dùng `UPDATE table SET deleted_at = NOW() WHERE id = $1`. Bảng cần có column `deleted_at TIMESTAMPTZ`. Query bình thường phải thêm `WHERE deleted_at IS NULL`.

---

## 🔵 LOW — Style & Convention Patterns

### [2026-05-24] LOW: Magic Numbers Không Có Constant
**Pattern vi phạm:** `if (items.length > 3)` thay vì `if (items.length > MAX_COMPARE_ITEMS)`.
**Guardrail:** Mọi số không tự giải thích được → đóng gói thành SCREAMING_SNAKE_CASE constant.

### [2026-05-24] LOW: Anchor Text Chung Chung
**Pattern vi phạm:** `<Link href="/san-pham">Xem thêm</Link>`.
**Tác động:** Googlebot không hiểu đích đến, SEO kém.
**Guardrail:** Anchor text phải mô tả đích: `<Link href="/san-pham/tom-su">Tôm sú Cà Mau tươi sống</Link>`.

---

## 📋 Cách Cập Nhật File Này

Khi phát hiện failure pattern mới:
```
### [YYYY-MM-DD] SEVERITY: Tên Pattern Ngắn Gọn
**Pattern vi phạm:** Mô tả hành vi sai.
**Tác động:** Hậu quả cụ thể.
**Guardrail:** Cách phòng tránh và xử lý.
```

Severity levels: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`
