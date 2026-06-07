# Kế hoạch nâng cấp tính năng tải ảnh bìa lên Supabase Storage (Cloud)

Kế hoạch này chi tiết hóa việc nâng cấp API tải lên hình ảnh `/api/blogs/upload` để chuyển từ cơ chế lưu local disk sang lưu trữ đám mây (Cloud Storage) sử dụng **Supabase Storage**. Sự thay đổi này giúp dự án tương thích hoàn hảo với môi trường Serverless của Vercel mà không làm phát sinh thêm chi phí thuê máy chủ lưu trữ.

---

## User Review Required

> [!IMPORTANT]
> **Yêu cầu cấu hình trên Supabase Dashboard:**
> 1. Bạn cần truy cập vào **Supabase Dashboard** của bạn → chọn mục **Storage** ở thanh bên trái.
> 2. Tạo một **Bucket** mới tên là `blogs` (chế độ **Public** để bất kỳ ai cũng có thể xem ảnh qua URL tĩnh).
> 3. Hãy đảm bảo các biến môi trường sau đã được khai báo đầy đủ trong file `.env.local` của bạn:
>    * `NEXT_PUBLIC_SUPABASE_URL`
>    * `SUPABASE_SERVICE_ROLE_KEY` (Khóa bảo mật có quyền Admin bypass RLS policy để tải ảnh lên).

---

## Open Questions

> [!NOTE]
> * Tên bucket mặc định tôi cấu hình trong code là `blogs`. Bạn có muốn đổi tên bucket thành một tên khác không? (Nếu có, vui lòng phản hồi).

---

## Proposed Changes

### 1. API Route Handlers

#### [MODIFY] [route.ts](file:///e:/Web-Seo/src/app/api/blogs/upload/route.ts)
Thay đổi cơ chế lưu trữ file trong API tải lên:
- Thay vì sử dụng thư viện `fs` để ghi tệp vào thư mục `public/uploads/blogs/` trên ổ đĩa.
- API sẽ sử dụng hàm `fetch` có sẵn của Node.js để gửi yêu cầu REST API trực tiếp lên **Supabase Storage REST API**:
  `POST ${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/blogs/${safeName}`
- Sử dụng header `Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}` để xác thực và `x-upsert: true` để hỗ trợ ghi đè nếu trùng tên.
- Trả về public URL chính thức dạng:
  `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blogs/${safeName}`

*Giải pháp này không cần cài đặt thêm bất kỳ thư viện npm nặng nào (như `@supabase/supabase-js`), đảm bảo tuân thủ quy tắc giữ gọn nhẹ cho dự án.*

---

## Verification Plan

### Automated Tests
- Chạy `npm run type-check` để đảm bảo code TypeScript không bị lỗi kiểu dữ liệu mới.
- Chạy `npm run lint` kiểm tra format.

### Manual Verification
- Chúng tôi sẽ hướng dẫn bạn chạy thử nghiệm Upload ảnh từ Dashboard Admin để xác minh file ảnh được đẩy lên Supabase Storage thành công và hiển thị preview chính xác.
