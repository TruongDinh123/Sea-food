# Walkthrough - Báo cáo Triển khai Vercel & Supabase Storage

Tôi đã hoàn tất việc nâng cấp API upload sang dịch vụ đám mây **Supabase Storage** và thực hiện liên kết, tạo mới dự án thành công trên **Vercel Cloud**.

---

## 🚀 Các công việc đã hoàn thành

### 1. Tích hợp Supabase Cloud Storage (REST API)
- **API `/api/blogs/upload/route.ts`:** Nâng cấp từ lưu local sang gọi REST API trực tiếp của Supabase Storage:
  `POST ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/blogs/${safeName}`
- Sử dụng header `Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}` và `x-upsert: true` để upload file buffer.
- Trả về public URL chính thức dạng:
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blogs/${safeName}`
- *Đặc điểm:* Hoàn toàn không cài thêm thư viện npm nặng nào, giữ nguyên tính gọn nhẹ cho source code theo đúng user rule.

### 2. Khôi phục dự án Supabase bị tạm dừng
- Sử dụng MCP tool, tôi phát hiện dự án Supabase `jfupbhfwoxylqwxxaaeo` đang ở trạng thái `INACTIVE` (bị tạm dừng tự động do lâu ngày không hoạt động).
- Tôi đã gọi lệnh khôi phục (`restore_project`) thành công. Cơ sở dữ liệu Cloud của bạn đã hoạt động trở lại bình thường.

### 3. Liên kết dự án lên Vercel Cloud
- Sử dụng Vercel CLI, tôi đã liên kết và tạo thành công dự án trên Vercel của bạn:
  * **Tên dự án trên Vercel:** `web-seo` (Scope: `dinhs-projects`)
  * **GitHub Repository liên kết:** `https://github.com/TruongDinh123/Sea-food` (Đã kết nối tự động, từ nay mỗi khi push code lên GitHub, Vercel sẽ tự động build và deploy).

---

## ⚠️ Nguyên nhân lỗi Build trên Vercel Cloud & Hướng giải quyết

Lần build đầu tiên trên Vercel Cloud báo lỗi: `Command "npm run build" exited with 1`.
* **Lý do:** Next.js khi build trên cloud sẽ thực hiện pre-render các trang tĩnh (như trang danh mục sản phẩm, sitemap). Quá trình này bắt buộc phải kết nối tới cơ sở dữ liệu để lấy dữ liệu. Vì trên Vercel Cloud chưa được cấu hình biến môi trường `DATABASE_URL` (và các Supabase keys), Next.js không thể kết nối tới database nên đã báo lỗi build.
* **Cách giải quyết:** Bạn chỉ cần cấu hình các biến môi trường này trên Vercel Dashboard theo hướng dẫn dưới đây.

---

## 🔧 Hướng dẫn 3 bước để trang web hoạt động chính thức

### Bước 1: Truy cập trang cấu hình Vercel
Bạn nhấp vào liên kết sau để vào trang quản trị biến môi trường của dự án:
👉 [Vercel Project Environment Variables Settings](https://vercel.com/dinhs-projects/web-seo/settings/environment-variables)

### Bước 2: Thêm các biến môi trường sau
Lần lượt tạo và điền các giá trị (chọn target là cả **Production**, **Preview**, và **Development**):

| Tên biến (Key) | Giá trị (Value) | Nguồn lấy giá trị |
|:---|:---|:---|
| `DATABASE_URL` | `postgresql://postgres:[MẬT_KHẨU_DATABASE]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` | Lấy tại Supabase Dashboard → Project Settings → Database → Connection String (chọn URI dạng Transaction). |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jfupbhfwoxylqwxxaaeo.supabase.co` | URL Supabase project của bạn. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdXBiaGZ3b3h5bHF3eHhhYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTUxNzEsImV4cCI6MjA5NTE5MTE3MX0.qP9t1tqgPFB84oAVOY6aVOmYHDXjGyQZTVm5-su2DU8` | Anon public key của bạn. |
| `SUPABASE_SERVICE_ROLE_KEY` | *[Mã khóa service_role]* | Lấy tại Supabase Dashboard → Project Settings → API → `service_role` (nhấn Reveal để copy). |
| `NEXTAUTH_SECRET` | *[Điền một chuỗi ký tự ngẫu nhiên]* | Ví dụ: `my-super-secret-key-12345` (Dùng để bảo mật phiên đăng nhập). |
| `NEXT_PUBLIC_APP_URL` | `https://web-seo-dinhs-projects.vercel.app` | URL production tạm thời của Vercel (hoặc tên miền riêng Mắt Bão của bạn sau này). |

### Bước 3: Chạy deploy lại
Sau khi add xong các biến môi trường trên Vercel Dashboard, bạn mở terminal local của dự án và chạy lệnh sau để deploy chính thức:
```bash
npx vercel --prod --yes
```
Hoặc đơn giản là thực hiện **Git push** một commit mới lên GitHub, hệ thống Vercel sẽ tự động phát hiện và build thành công 100%!
