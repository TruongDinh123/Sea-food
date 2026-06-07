# Prompt Cho Google AI Studio: Nâng Cấp Giao Diện Dashboards & Auth (Deepwater Elite)

Sử dụng prompt dưới đây trong **Google AI Studio** (`aistudio.google.com`) để sinh code cập nhật cho các màn hình còn thiếu (Dashboard và Authentication) tương thích hoàn toàn với giao diện Hải Sản Cao Cấp Cà Mau mới.

---

### PROMPT COPY-PASTE CHO GOOGLE AI STUDIO

```text
Hãy hoạt động như một Senior Frontend Architect chuyên về Next.js, TailwindCSS v4 và TypeScript. Tôi muốn bạn nâng cấp toàn diện giao diện của các thành phần quản trị (Admin Dashboard, Merchant Dashboard) và các trang xác thực (Login, Register) hiện tại để khớp 100% với phong cách thiết kế cao cấp mới của hệ thống "Deepwater Elite - Hải Sản Cao Cấp".

Dưới đây là các đặc tả thiết kế bắt buộc phải tuân thủ:

1. Bảng màu Luxury Deepwater & Amber (Sử dụng các biến CSS v4 sau):
   - Nền tối / Khối chính: Deepwater Teal (--color-deepwater: #031e25)
   - Nền phụ / Viền chia: Canvas (--color-canvas: #e5e7eb)
   - Chữ chính: Ink Black (--color-ink: #0a0a0a)
   - Chữ sáng / Nền nút CTAs chính: Pure White (--color-white: #ffffff)
   - Điểm nhấn / CTAs phụ / Trạng thái nổi bật: Amber/Gold (--color-amber: #d97706)
   - Thành công / OCOP / Tươi sống: Forest Green (--color-forest-500: #198754)

2. Font chữ & Cấu trúc Typo:
   - Font chữ chính: "Be Vietnam Pro" (sans-serif)
   - Font số liệu, mã đơn hàng, giá tiền: "JetBrains Mono" (monospace)

3. Quy chuẩn hình học:
   - Sử dụng góc bo bo tròn mềm mại nhưng sắc nét: 12px (rounded-cards) cho thẻ card lớn, 8px cho inputs/buttons.
   - Viền chia (borders) mỏng 1px sạch sẽ và tinh tế.

4. Tính tương tác & Hoạt cảnh (Animations):
   - Mọi nút bấm, dòng bảng phải có hiệu ứng hover mượt mà (chuyển đổi màu nền, nâng nhẹ bóng đổ, hoặc co giãn tỉ lệ scale-98/scale-102).
   - Sử dụng các icon từ thư viện 'lucide-react' để tăng tính trực quan.

5. Nhiệm vụ cụ thể:
   Hãy thiết kế lại cấu trúc bảng biểu, biểu đồ thống kê doanh thu, lưới danh sách đơn hàng, quản lý sản phẩm, trạng thái thanh toán và thông tin người dùng trong các file Dashboard và Authentication. Bảo đảm giao diện hiển thị cực kỳ sang trọng, chuyên nghiệp, hiển thị tối ưu trên cả Mobile và Desktop (Responsive 100%), đồng thời không làm thay đổi các handler gọi API hiện có của Next.js.
```
