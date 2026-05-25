# Kế Hoạch Sprint 1: Thiết Lập Nền Móng & Tối Ưu SEO

- **Thời gian:** 1 tuần (từ 2026-05-25 đến 2026-06-01)
- **Mục tiêu chính (Sprint Goal):** Thiết lập hạ tầng cốt lõi (Database client, TypeScript Types, TailwindCSS v4 css-first) và hoàn thiện các trang Danh sách & Chi tiết cho Thương lái & Sản phẩm ở mức cơ bản, sẵn sàng SEO (Metadata, Breadcrumbs, JSON-LD Schema).
- **Trạng thái:** Sẵn sàng thực hiện (Ready for Dev)

---

## 👥 Phân Bổ Nhân Sự (Team)
- **Tech Lead (An):** Kiến trúc, review PR và đảm bảo chất lượng.
- **Backend Developer (Dat):** Xây dựng Client, Types, Services, Repositories và API Route Handlers.
- **Frontend Developer (Dinh):** Thiết lập styling, layouts, UI components, pages, và các tệp tối ưu SEO (`sitemap.ts`, `robots.ts`).
- **QA Engineer (Vi):** Viết unit tests cho Service layer, Playwright E2E tests kiểm thử SEO và luồng người dùng.

---

## 📋 Sprint Backlog & Phân Rã Nhiệm Vụ

| ID | Task | Assignee | Ước Tính | Ưu Tiên | Trạng Thái |
|---|---|---|---|---|---|
| **T1** | Thiết lập Database Client và Types (`src/lib/db/`, `src/types/`) | Dat (BE) | 2 giờ | 🔴 Cao | ⬜ Todo |
| **T2** | Thiết lập CSS Global & Fonts với TailwindCSS v4 css-first | Dinh (FE) | 2 giờ | 🔴 Cao | ⬜ Todo |
| **T3** | Thiết lập Root Layout & Navigation tĩnh (SEO-ready) | Dinh (FE) | 3 giờ | 🔴 Cao | ⬜ Todo |
| **T4** | Viết Merchant Repository & Service (Service-Repository Pattern) | Dat (BE) | 3 giờ | 🔴 Cao | ⬜ Todo |
| **T5** | Tạo API Route Handler `/api/merchants` (Phân trang, No-direct-DB) | Dat (BE) | 2 giờ | 🟡 Vừa | ⬜ Todo |
| **T6** | Xây dựng trang Thương Lái (`/thuong-lai` & `/thuong-lai/[slug]`) có SEO Profile Schema | Dinh (FE) | 4 giờ | 🔴 Cao | ⬜ Todo |
| **T7** | Viết Product Repository & Service (Hỗ trợ ProductGroup) | Dat (BE) | 3 giờ | 🔴 Cao | ⬜ Todo |
| **T8** | Xây dựng trang Sản Phẩm (`/san-pham` & `/san-pham/[slug]`) có Product Schema | Dinh (FE) | 4 giờ | 🔴 Cao | ⬜ Todo |
| **T9** | Triển khai Dynamic Sitemap (`sitemap.ts`) & Robots.txt (`robots.ts`) | Dinh (FE) | 2 giờ | 🟡 Vừa | ⬜ Todo |
| **T10**| Viết Unit Tests (Mock) & Playwright Smoke Tests (Kiểm thử SEO & UI) | Vi (QA) | 4 giờ | 🟡 Vừa | ⬜ Todo |

**Tổng thời gian ước tính:** 29 giờ (~3.6 Man-Days).

---

## 📌 Chi Tiết Từng Task

### T1: Thiết lập Database Client và Types
- **Mô tả:** Tạo file `src/lib/db/supabase.ts` để khởi tạo client Supabase-js. Định nghĩa interface TypeScript cho bảng `merchants` và `products` trong `src/types/merchant.types.ts` và `src/types/product.types.ts`.
- **Input:** Migration files hiện tại (`db/migrations/`).
- **Output:** File `supabase.ts` kết nối tốt và export types đầy đủ.
- **AC (Acceptance Criteria):**
  - Khớp cấu trúc SQL database.
  - Sử dụng biến môi trường từ `.env.local` (không hardcode).
  - Không lạm dụng kiểu `any`. Có hỗ trợ soft-delete properties (`deleted_at`).

### T2: Thiết lập CSS Global & Fonts (TailwindCSS v4 css-first)
- **Mô tả:** Cập nhật `src/app/globals.css`. Cài đặt và tích hợp font `Be Vietnam Pro` qua Google Fonts. Tùy biến biến hệ thống cho màu sắc chủ đạo (`#0D6EFD` - primary, `#198754` - secondary).
- **Input:** File globals.css gốc.
- **Output:** globals.css hợp lệ sử dụng TailwindCSS v4 `@theme`.
- **AC:**
  - Không có file `tailwind.config.js` trong thư mục gốc.
  - Font chữ mặc định được áp dụng là `Be Vietnam Pro` (fallback: sans-serif).

### T3: Thiết lập Root Layout & Navigation tĩnh
- **Mô tả:** Thiết lập layout chung gồm Header, Footer, Navigation. Tích hợp metadata cơ bản (Title template, description mặc định).
- **Input:** File layout.tsx mặc định.
- **Output:** Giao diện layout chuẩn có khung điều hướng.
- **AC:**
  - Sử dụng link tĩnh `<Link href="...">` của Next.js (không dùng onClick).
  - Có breadcrumbs cơ bản tại các layout con.
  - Alternates canonical gốc được thiết lập chuẩn xác.

### T4: Viết Merchant Repository & Service
- **Mô tả:** Viết repository thực thi truy vấn Supabase/SQL và service xử lý logic lọc (soft delete) cho thực thể Merchant.
- **Input:** Database client (T1).
- **Output:** `merchant.repository.ts`, `merchant.service.ts`.
- **AC:**
  - Repository KHÔNG chứa logic kinh doanh hay lọc phức tạp. Không dùng `SELECT *`.
  - Service lọc bỏ các thương lái bị soft delete (`deleted_at IS NOT NULL`).

### T5: Tạo API Route Handler `/api/merchants`
- **Mô tả:** Viết route GET tại `src/app/api/merchants/route.ts` để trả về danh sách thương lái.
- **Input:** Merchant Service (T4).
- **Output:** Route GET hoạt động.
- **AC:**
  - Chỉ gọi qua Service layer, không tương tác trực tiếp với Repository hay DB.
  - Có hỗ trợ phân trang (query params `page`, `limit`).

### T6: Xây dựng trang Thương Lái (`/thuong-lai` & `/thuong-lai/[slug]`)
- **Mô tả:** Trang danh sách và chi tiết thương lái.
- **Input:** Merchant Service/API.
- **Output:** UI hiển thị thương lái chuẩn responsive và SEO.
- **AC:**
  - Trang danh sách hỗ trợ pagination.
  - Trang chi tiết có dynamic metadata (`generateMetadata`) lấy từ Merchant Service và sinh self-referencing canonical.
  - Tích hợp JSON-LD Profile Schema cho thương lái.
  - Đúng 1 thẻ `<h1>` duy nhất trên trang.

### T7: Viết Product Repository & Service
- **Mô tả:** Viết repository và service cho thực thể Product. Hỗ trợ logic lấy sản phẩm theo nhóm (`ProductGroup`) hoặc biến thể kích cỡ sản phẩm (ví dụ: Tôm sú size 10, size 20).
- **Input:** Database client (T1).
- **Output:** `product.repository.ts`, `product.service.ts`.
- **AC:**
  - Query chính xác, không dùng `SELECT *`.
  - Lọc bỏ các sản phẩm bị soft delete.

### T8: Xây dựng trang Sản Phẩm (`/san-pham` & `/san-pham/[slug]`)
- **Mô tả:** Thiết lập trang danh sách sản phẩm hải sản và trang chi tiết sản phẩm.
- **Input:** Product Service/API.
- **Output:** UI trang sản phẩm responsive, hiển thị được variants size và giá.
- **AC:**
  - Thẻ canonical trang phân trang tự trỏ về chính nó (`/san-pham?page=2` canonical về `/san-pham?page=2`).
  - Dynamic metadata cho trang chi tiết sản phẩm.
  - Tích hợp JSON-LD Product/ProductGroup Schema cho tôm sú, cua biển.
  - Alt text đầy đủ và có nghĩa cho tất cả các hình ảnh sản phẩm.

### T9: Triển khai Dynamic Sitemap & Robots.txt
- **Mô tả:** Xây dựng file `sitemap.ts` và `robots.ts` trong thư mục `src/app/` tự động tổng hợp URL từ Merchant Service và Product Service.
- **Input:** Product & Merchant Services.
- **Output:** File xml sitemap động và txt robots hợp chuẩn.
- **AC:**
  - XML sitemap chứa đầy đủ URL tuyệt đối của trang chủ, các trang tĩnh, danh sách sản phẩm/thương lái và chi tiết từng thực thể.
  - Robots.txt khai báo chính xác sitemap URL và cấu hình user-agent.

### T10: Viết Unit Tests & Playwright Smoke Tests
- **Mô tả:** Viết unit tests kiểm thử service layer và Playwright E2E kiểm thử các phần tử SEO trên UI.
- **Input:** Mã nguồn hoàn thiện của BE & FE.
- **Output:** Bộ test files chạy thành công.
- **AC:**
  - Mock repository trong service test.
  - Playwright test chạy trên local, check SEO audit: H1 duy nhất, sự hiện diện của canonical URL và schema JSON-LD.

---

## 📌 Definition of Done (DoD)
Một task trong Sprint được coi là "Done" và sẵn sàng merge khi:
1. Code được review và phê duyệt bởi Tech Lead (An).
2. Chạy `npm run lint` không có lỗi và cảnh báo (ESLint, TS).
3. Chạy `npm run build` thành công, không có TypeScript compiler error.
4. Chạy toàn bộ unit tests và Playwright E2E pass.
5. Commit message tuân thủ đúng định dạng Conventional Commits.
6. Trạng thái task trong `task.md` được chuyển thành `[x]`.

---

## ⚠️ Rủi Ro & Phụ Thuộc (Risks & Dependencies)
1. **Phụ thuộc dữ liệu mẫu (Mock data):** Để frontend và API hoạt động tốt, database cần có sẵn dữ liệu mẫu về merchants và products. Cần chuẩn bị script chèn dữ liệu mẫu trong ngày đầu tiên của Sprint.
2. **Next.js Version Constraints:** Sử dụng Next.js 16.2.6 có thể có một số API mới hoặc thay đổi nhỏ so với Next.js 14/15. Frontend Dev cần đọc kỹ docs tại `node_modules/next/dist/docs/` trước khi implement.
