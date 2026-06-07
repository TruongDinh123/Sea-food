# Original User Request

## Initial Request — 2026-05-30T13:00:25+07:00

Xây dựng hệ thống Seafood Dried Marketplace (Cà Mau) kết nối thương lái (vựa) và người mua hải sản khô Cà Mau, tích hợp SEO Blog để tăng traffic tự nhiên và hệ thống tính hoa hồng tự động.

Working directory: E:/Web-Seo
Integrity mode: development

## Requirements

### R1. Cơ sở dữ liệu (Database Migrations)
Tạo các bảng cơ sở dữ liệu Postgres trong thư mục `db/migrations/` sử dụng Soft Delete (`deleted_at`) và chuẩn đặt tên snake_case:
- Bảng đơn hàng (`orders`): thông tin giao dịch, trạng thái đơn hàng (`pending`, `processing`, `shipping`, `completed`, `cancelled`).
- Bảng chi tiết đơn hàng (`order_items`): lưu sản phẩm trong đơn, số lượng, giá tại thời điểm mua.
- Bảng bài viết (`blogs`): tiêu đề, slug, mô tả meta, nội dung, ảnh bìa, trạng thái xuất bản phục vụ SEO.
- Cập nhật bảng `merchants` thêm cột `user_id UUID UNIQUE` liên kết với Supabase Auth.
- Cập nhật bảng `referral_logs` thêm cột `order_id INT` liên kết với đơn hàng.
- Kích hoạt Row Level Security (RLS) cho `orders` và `blogs` với các chính sách bảo mật phù hợp.

### R2. Kiến trúc Backend (Service-Repository Pattern)
Xây dựng logic nghiệp vụ được tách biệt rõ ràng giữa tầng dữ liệu (Repository) và tầng xử lý nghiệp vụ (Service):
- Kết nối DB: cấu hình kết nối thông qua biến `DATABASE_URL` và tích hợp tự động chạy migration khi khởi động app.
- Repositories (`src/lib/repositories/`): chỉ chứa truy vấn SQL thô truy cập vào DB (merchant, product, order, commission, blog).
- Services (`src/lib/services/`): chứa logic nghiệp vụ, tính toán hoa hồng khi đơn hàng sang trạng thái `completed`, gửi mail thông báo đơn hàng (mock stdout ở local / SMTP cấu hình động).
- API Routes (`src/app/api/`): tiếp nhận request và gọi Service, không chứa SQL trực tiếp.

### R3. Giao diện Người dùng & Định tuyến (Next.js App Router)
Xây dựng giao diện Next.js App Router, sử dụng TailwindCSS v4 css-first theo Design System (font Be Vietnam Pro, màu Ocean Blue và Forest Green):
- Trang chủ (`src/app/page.tsx`): hiển thị sản phẩm nổi bật, danh sách vựa và bài viết mới nhất.
- Catalog sản phẩm: danh sách tất cả sản phẩm (`san-pham`), chi tiết sản phẩm (`san-pham/[slug]`), danh mục (`danh-muc/[slug]`).
- Trang thông tin vựa (`thuong-lai` và `thuong-lai/[slug]`).
- SEO Blog (`blog` và `blog/[slug]`): chi tiết bài viết tích hợp JSON-LD `Article` Schema.
- Trang sitemap.xml động (`src/app/sitemap.ts`) và robots.txt (`src/app/robots.txt`).
- Khu vực quản lý (Dashboard): đăng nhập/đăng ký thương lái (`auth/`), dashboard cho thương lái (`dashboard/merchant`), dashboard quản lý cho Admin (`dashboard/admin`).

### R4. SEO & Hiệu năng
- Mỗi trang cần có title và description riêng, thẻ `<h1>` duy nhất, alt text đầy đủ cho hình ảnh.
- Tất cả đường dẫn điều hướng nội bộ phải sử dụng Next.js `<Link>`, không dùng điều hướng bằng sự kiện click (`onClick`).
- Tích hợp JSON-LD Schema: `Product` cho trang chi tiết sản phẩm, `Article` cho blog, `LocalBusiness` / `Profile` cho trang chi tiết vựa.
- Canonical tag tự tham chiếu cho mỗi trang (kể cả các trang phân trang).

## Acceptance Criteria

### Kiểm thử Kỹ thuật (Technical Verification)
- [ ] Chạy `npm run type-check` (tsc --noEmit) không có lỗi biên dịch.
- [ ] Chạy `npm run lint` không có lỗi hoặc cảnh báo ESLint.
- [ ] Viết các bài kiểm thử đơn vị (Unit tests) cho Service layer trong `src/lib/services/__tests__/` và chạy qua `npx vitest run` thành công 100%.

### Chức năng Database & Nghiệp vụ (Database & Business Logic)
- [ ] Các migration SQL chạy thành công từ trạng thái DB trống mà không gặp lỗi ràng buộc.
- [ ] Logic tính hoa hồng được kích hoạt chính xác khi cập nhật trạng thái đơn hàng thành `completed` và ghi nhận đúng vào `referral_logs`.
- [ ] Email thông báo được in ra stdout hoặc gửi thành công qua cấu hình SMTP khi có đơn hàng mới.

### Chuẩn SEO & Giao diện (SEO & UI Compliance)
- [ ] Trang chi tiết sản phẩm, chi tiết vựa và chi tiết blog chứa đúng JSON-LD schema tương ứng (Product, LocalBusiness, Article).
- [ ] Trang sitemap.xml động tự động sinh đủ các URL từ database (sản phẩm, blog, thương lái).
- [ ] Thẻ Canonical tự tham chiếu đúng URL hiện tại của trang đó.
- [ ] Giao diện responsive tốt trên kích thước Mobile (375px), không có thanh cuộn ngang (horizontal overflow).
- [ ] Sử dụng font `Be Vietnam Pro` làm mặc định và không sử dụng các class Tailwind có chứa pixel thô (arbitrary values như `p-[20px]`).

## Follow-up — 2026-05-30T21:53:46+07:00

Implement Phase B improvements for the **Hải Sản Cao Cấp Marketplace** — a Next.js 16 (App Router) + TailwindCSS v4 (css-first) + PostgreSQL/Supabase seafood e-commerce platform built using the Service-Repository pattern. Phase B completes SEO/UX polish and code quality improvements following Phase A (which fixed JSON-LD schemas, breadcrumbs, and admin dashboard architecture).

Working directory: `e:\Web-Seo`
Integrity mode: development

---

## Context (Read First)

- **Architecture:** Service → Repository → DB. Pages/API routes only call Services. Services call Repositories. No raw SQL in pages.
- **Design System:** TailwindCSS v4 css-first. Colors: deepwater `#031e25`, amber `#d97706`, ink `#0a0a0a`. Font: Be Vietnam Pro. No arbitrary values.
- **SEO Rules:** `generateMetadata` on every page, self-referencing canonical, JSON-LD schemas already implemented on detail pages.
- **Key files:**
  - `src/app/globals.css` — TailwindCSS v4 `@theme` tokens
  - `src/lib/services/` — business logic layer
  - `src/lib/repositories/` — data access layer
  - `src/components/layout/Breadcrumbs.tsx` — already created in Phase A
  - `src/app/(catalog)/danh-muc/[slug]/page.tsx` — only 2KB, stub
  - `src/app/dashboard/merchant/MerchantDashboardClient.tsx` — 49KB, needs splitting
- **Constraints:** Do NOT run `npm run build` (freezes machine). Use `cmd /c "npx tsc --noEmit"` for type checking. Do NOT use arbitrary Tailwind values. Respond to user in Vietnamese.

---

## Priority 1 — UX/SEO Polish (Implement First)

### R1. Complete the `/danh-muc/[slug]` Category Page
Full product listing for category slug, generateMetadata, h1, products filtered by category, BreadcrumbList JSON-LD, visual breadcrumb, link back to /san-pham.

### R2. Replace `<img>` with `next/image` in ESLint-warned Files
Four files: ProductDetailClient.tsx (4 occurrences), blog/[slug]/page.tsx (1), page.tsx (3), thuong-lai/page.tsx + MerchantProfileClient.tsx (2). ESLint must report 0 no-img-element warnings.

### R3. Add Breadcrumbs to List Pages
/san-pham, /thuong-lai, /blog, /ve-chung-toi — add existing Breadcrumbs component.

---

## Priority 2 — Code Quality (Implement After Priority 1)

### R4. Unit Tests for Service Layer (≥80% Coverage)
Vitest tests for order.service, product.service, merchant.service, referral.service. Mock all repos.

### R5. Split MerchantDashboardClient.tsx into Sub-components
ProductManagerTab, OrderManagerTab, ReferralLogsTab, DashboardLayout. Main file ≤200 lines.

### R6. Add PWA Web App Manifest (manifest.ts)
src/app/manifest.ts with name, short_name, theme_color, background_color, display, icons.

---

## Acceptance Criteria (Phase B)
- R1: GET /danh-muc/cua-bien returns 200, unique h1, BreadcrumbList JSON-LD, filtered products
- R2: 0 no-img-element ESLint warnings
- R3: nav[aria-label="Điều hướng phân cấp"] on all 4 list pages
- R4: npx vitest run --coverage exits 0, ≥80% statement coverage
- R5: MerchantDashboardClient.tsx ≤200 lines, 4 sub-components exist, tsc clean
- R6: src/app/manifest.ts exists, GET /manifest.webmanifest returns 200

## Follow-up — 2026-06-01T10:05:26+07:00

Xây dựng Phase 1 MVP cho website hải sản khô Cà Mau (`e:\Web-Seo`): tập trung vào **SEO Blog chất lượng cao** để kéo traffic tự nhiên từ Google, dẫn dắt người đọc đến trang sản phẩm, cho phép khách đặt hàng COD — chủ shop nhận notification rồi tự đi lấy hàng từ thương lái và ship. Đây là mô hình dropship thủ công giai đoạn đầu, chưa cần merchant portal.

Working directory: `e:\Web-Seo`
Integrity mode: development

Tech stack hiện tại: Next.js 16 (App Router), TailwindCSS v4 (css-first), Supabase PostgreSQL, Be Vietnam Pro font. Service-Repository pattern đã implemented. Bảng DB `blogs`, `products`, `orders`, `merchants` đã tồn tại.

---

## Requirements

### R1. Blog Reader Experience (Ưu tiên cao nhất)
Xây dựng hệ thống blog với trải nghiệm đọc xuất sắc:
- Trang `/blog`: danh sách bài viết với thumbnail, tiêu đề, mô tả ngắn, estimated reading time, ngày đăng
- Trang `/blog/[slug]`: layout đọc chuẩn, breadcrumb, estimated reading time, section "Sản phẩm liên quan" cuối bài để dẫn traffic sang trang sản phẩm
- Dữ liệu blog lấy từ bảng `blogs` trong Supabase (viết bài qua Supabase dashboard)

### R2. SEO Blog Structure (Chuẩn Google)
Mỗi trang blog phải đạt chuẩn Google:
- Đúng 1 `<h1>` chứa từ khóa chính, hierarchy H2/H3 hợp lệ
- JSON-LD Article Schema đầy đủ (headline, datePublished, author, image, description)
- `generateMetadata` với title/description riêng, self-referencing canonical, Open Graph tags
- Sitemap.xml động bao gồm toàn bộ blog slugs đã published

### R3. Product Listing & Simple Order Form
Trang catalog sản phẩm để chốt đơn:
- `/san-pham` và `/san-pham/[slug]`: hình ảnh sản phẩm, mô tả, giá bán, nút "Đặt mua ngay"
- Form đặt hàng đơn giản: tên khách, số điện thoại, địa chỉ giao hàng, ghi chú, số lượng
- Phương thức thanh toán: COD (thanh toán khi nhận hàng) — không cần payment gateway
- JSON-LD Product Schema trên trang chi tiết

### R4. Order Notification System
Khi khách đặt hàng thành công:
- Đơn hàng được lưu vào bảng `orders` trong DB
- Gửi email thông báo ngay cho chủ shop (stdout mock ở local, SMTP config qua env cho production)
- Email chứa: tên khách, SĐT, địa chỉ, sản phẩm đặt, số lượng, ghi chú

---

## Context Kỹ Thuật Quan Trọng

- **Không chạy `npm run build`** — máy bị đơ. Dùng `npx tsc --noEmit` để type check.
- **Font**: Be Vietnam Pro — đã import trong globals.css
- **Màu sắc**: Deepwater Teal `#031e25`, Amber `#d97706`, Ink `#0a0a0a` — theo Design System
- **Không dùng arbitrary Tailwind values** (`p-[20px]`) — chỉ dùng class từ `@theme` trong globals.css
- **Service-Repository pattern**: Pages/API chỉ gọi Services, Services gọi Repositories, không SQL trực tiếp trong pages
- **SEO**: Mọi page.tsx phải có `generateMetadata`, self-referencing canonical
- **Commit**: Conventional Commits format, không push thẳng lên main

---

## Acceptance Criteria

### Blog SEO & UX
- [ ] GET `/blog` trả về 200, hiển thị danh sách bài viết với thumbnail và reading time
- [ ] GET `/blog/[slug]` trả về 200, có đúng 1 `<h1>`, Article JSON-LD hợp lệ
- [ ] Sitemap.xml bao gồm đầy đủ slug bài viết đã published
- [ ] Section "Sản phẩm liên quan" hiển thị ở cuối mỗi bài blog
- [ ] `npm run type-check` không có lỗi
- [ ] `npm run lint` không có warning/error

### Order Flow
- [ ] Form đặt hàng hoạt động, submit thành công → đơn được lưu DB
- [ ] Email notification log ra stdout khi có đơn mới với đầy đủ thông tin khách
- [ ] Trang xác nhận đơn hàng hiển thị sau khi đặt thành công

### Performance & Mobile
- [ ] Trang blog responsive tốt ở 375px, không có horizontal overflow
- [ ] Hình ảnh dùng `next/image` với `alt` mô tả thực tế (không rỗng)
