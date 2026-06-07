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

### [2026-05-26] HIGH: Archive Memory Overload & Context Rot
**Pattern vi phạm:** Giữ quá nhiều session logs cũ (> 30 ngày) hoặc các logs không liên quan trong context làm việc làm chậm và loãng bộ nhớ của agent.
**Tác động:** Tăng chi phí token và gây ra hiện tượng context rot (AI bị lẫn lộn giữa các session cũ và mới).
**Guardrail:** Bắt buộc dọn dẹp các files log session cũ (>30 ngày) bằng cách nén (hoặc di chuyển) vào thư mục lưu trữ (`docs/ky-uc/luu-tru-nhat-ky/`) và cập nhật file chỉ mục tổng hợp. NOTES.md chỉ giữ lại các task hoạt động của session hiện tại và 5 sessions gần nhất.

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

## 🚫 BẢNG CHỐNG BIỆN MINH (ANTI-RATIONALIZATION TABLE)

Để ngăn ngừa tình trạng tác tử AI tự đưa ra các lý do ngụy biện lười biếng nhằm né tránh quy chuẩn lập trình, kiểm thử hoặc tối ưu hóa, bảng dưới đây định nghĩa các quy tắc chế tài bắt buộc:

| Lời Biện Minh Phổ Biến Của AI (Excuse) | Quy Tắc Bắt Bẻ Bắt Buộc (Strict Counter-Argument) | Yêu Cầu Sản Phẩm Bàn Giao (Required Deliverable) |
|---|---|---|
| *"Thay đổi logic này rất nhỏ, không cần viết unit test đâu."* | Không có thay đổi nào là quá nhỏ. Mọi logic thay đổi trong Service/Repository đều có thể sinh lỗi hồi quy (*regression*). | Bắt buộc phải viết tối thiểu 2 unit tests hoặc chạy thử code và in ra runtime logs kết quả đúng. |
| *"Chưa có database thật hoặc mock DB rất phức tạp nên tôi bỏ qua kiểm thử."* | Việc mock database/repository layer là kỹ năng cơ bản. Không được lấy database thật làm rào cản kiểm thử. | Sử dụng mock repository trong unit test hoặc tạo mock dữ liệu tĩnh để chạy thử logic dịch vụ. |
| *"Giao diện trông ổn rồi, không cần kiểm tra responsive hay accessibility (AOM) đâu."* | Giao diện hải sản phải hướng tới người dùng thực tế (chủ vựa dùng điện thoại là chính). CSS/XPath dễ bị gãy. | Bắt buộc phải tự chạy kiểm tra UI trên mobile viewport và kiểm tra tính hợp lệ của AOM (Accessibility Object Model). |
| *"Tôi sẽ tối ưu hóa SEO và cấu hình schemas JSON-LD sau khi dựng xong toàn bộ web."* | SEO không phải là việc làm sau cùng. SEO kém từ đầu sẽ khiến Googlebot index sai hoặc bỏ qua trang. | Chạy ngay `check-keyword-density.js` và `validate-schema.js` để kiểm duyệt Pass cho bài viết/sản phẩm mới. |
| *"Sửa đổi này chỉ để chạy thử nghiệm (draft), tôi sẽ viết code sạch hơn ở phiên sau."* | "Draft code" thường trở thành code vĩnh viễn trên production. Nợ kỹ thuật (*tech debt*) tích lũy sẽ tàn phá hệ thống. | Áp dụng đúng Service-Repository, đặt tên camelCase/PascalCase chuẩn và lint sạch lỗi trước khi nói "done". |

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
