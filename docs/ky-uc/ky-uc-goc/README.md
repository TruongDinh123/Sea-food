# 🔒 KÝ ỨC GỐC — READONLY

> **⚠️ CẢNH BÁO: Thư mục này CHỈ ĐỌC. Không được chỉnh sửa, xóa hoặc ghi đè bất kỳ file nào.**
> Đây là ký ức từ ngày đầu tiên Định và Antigravity thảo luận và xây dựng nền tảng cho dự án.

---

## 📅 Ngày tạo: 2026-05-23

## 👤 Thông tin Nhà phát triển
- **Tên:** Định (Trương Quang Định)
- **Sinh năm:** 2001
- **Địa điểm:** Thành phố Cà Mau, Việt Nam
- **Vai trò:** Lập trình viên Fullstack

---

## 💡 Ý Tưởng Gốc Của Dự Án

Xây dựng **sàn thương mại điện tử hải sản** tại Cà Mau dựa trên **mô hình 3 Trụ cột tinh gọn (Lean Startup)**:

### Trụ cột 1 — SEO Content Engine (Kéo Traffic)
- Viết bài blog/articles cẩm nang về đặc sản hải sản Cà Mau để kéo traffic tự nhiên từ Google.
- Ví dụ từ khóa: *"cách chọn tôm khô Cà Mau"*, *"vựa khô ngon nhất Cà Mau"*, *"giá tôm khô loại 1 sỉ"*.
- Bài viết có kèm liên kết (`<a href>` tĩnh) đến các trang sản phẩm để truyền link equity.

### Trụ cột 2 — Automation & Dynamic Commission (Điều hướng trung gian lấy hoa hồng)
- **Không cần chủ vựa phải đăng ký ngay từ đầu.** Định tự đăng danh sách ~30 sản phẩm hot nhất của các vựa uy tín kèm giá tham khảo.
- Khi khách hàng click "Mua ngay", hệ thống log lại và redirect sang Zalo/SĐT của vựa đó.
- **Hoa hồng linh hoạt (Dynamic Commission):** Có thể thu theo `%` tổng đơn tháng, hoặc số tiền cố định theo từng sản phẩm — cấu hình động trong database.

### Trụ cột 3 — Marketplace Platform (Sàn tự đăng sỉ lẻ)
- Khi traffic ổn định, mở cổng cho chủ vựa/đại lý tự đăng ký và quản lý sản phẩm sỉ/lẻ của họ.
- Tính năng **so sánh giá** giữa các vựa là USP (Unique Selling Point) chính.

---

## 🛠️ Kiến Trúc Kỹ Thuật Đã Thống Nhất

| Tầng | Công nghệ | Lý do |
|---|---|---|
| **Frontend** | Next.js 14+ (SSR/SSG) | Google index nội dung ngay từ đầu — chuẩn SEO hoàn toàn |
| **Backend** | Node.js (Express hoặc NestJS) | Fullstack quen thuộc |
| **Database** | PostgreSQL (Supabase/Neon) | Quan hệ chặt chẽ, free tier đủ dùng cho MVP |
| **Cache** | Redis | Cache bảng giá sản phẩm |
| **Ảnh** | Cloudinary | Upload ảnh sản phẩm CDN |
| **Hosting** | Vercel (FE) + Railway/Render (BE) | Triển khai nhanh, chi phí thấp |

---

## 📐 Cấu Trúc URL Chuẩn SEO (Đã Thiết Kế)

```
/                                 → Trang chủ
/blog/                            → Hub page blog (danh mục bài viết)
/blog/cach-chon-tom-kho-ngon/     → Bài viết mẫu
/hai-san-kho/                     → Danh mục hải sản khô
/hai-san-kho/tom-kho/             → Tôm khô (danh mục con)
/san-pham/tom-kho-ca-mau-loai-1/ → Trang sản phẩm
/vua/                             → Danh sách vựa
/vua/vua-nam-hung/                → Trang vựa cụ thể
/so-sanh/tom-kho/                 → So sánh giá tôm khô
```

---

## 🔄 Workflow Đã Thống Nhất

1. **Lập kế hoạch (Planning):** AI tạo `implementation_plan.md` → Định duyệt.
2. **Triển khai (Execution):** AI tạo `task.md` theo dõi tiến độ `[ ]` `[/]` `[x]`.
3. **Nghiệm thu (Verification):** AI tạo `walkthrough.md` tổng hợp thay đổi.
4. **Giới hạn 5 lượt hội thoại:** Mỗi 5 tin nhắn từ Định, AI tóm tắt vào `docs/ky-uc/ky-uc-hien-tai/` và yêu cầu tạo Conversation mới.

---

## 📊 Database Schema Gốc (Đã Thiết Kế)

Ba bảng cốt lõi:
- `merchants` — Thông tin vựa, kiểu hoa hồng (`percentage` / `fixed` / `monthly_flat`)
- `products` — Sản phẩm, có cờ `is_auto_listed` (Định tự đăng hộ hay vựa tự đăng)
- `referral_logs` — Ghi nhận mỗi lần click chuyển tiếp để tính hoa hồng

---

*File này được tạo ngày 2026-05-23 và KHÔNG được chỉnh sửa sau khi tạo.*
