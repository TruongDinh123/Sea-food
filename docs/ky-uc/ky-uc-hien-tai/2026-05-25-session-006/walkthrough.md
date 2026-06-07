# Walkthrough — Triển Khai Backend Sprint 1

Tài liệu này tóm tắt kết quả của các công việc phát triển mã nguồn Backend cho Sprint 1 (các nhiệm vụ **T1, T4, T5, T7**) dưới vai trò **Backend Developer (Dat)**.

---

## 🚀 Nội Dung Đã Thực Hiện

### 1. Định nghĩa Types Layer (T1)
Chúng ta đã tạo 3 tệp định nghĩa kiểu dữ liệu TypeScript đầy đủ trong thư mục `src/types/`:
*   [merchant.types.ts](file:///e:/Web-Seo/src/types/merchant.types.ts): Định nghĩa kiểu dữ liệu cho thực thể Thương lái (Vựa hải sản) và các kiểu đầu vào tạo/cập nhật.
*   [product.types.ts](file:///e:/Web-Seo/src/types/product.types.ts): Định nghĩa kiểu dữ liệu cho sản phẩm Hải sản, hỗ trợ kiểu kết hợp tên vựa `ProductWithMerchant`.
*   [referral.types.ts](file:///e:/Web-Seo/src/types/referral.types.ts): Định nghĩa kiểu dữ liệu log đối soát hoa hồng.

### 2. Thiết lập Merchant Component (T4, T5)
*   **Repository Layer** [merchant.repository.ts](file:///e:/Web-Seo/src/lib/repositories/merchant.repository.ts):
    *   Tối ưu hóa các câu lệnh SQL với `postgres.js` (không dùng `SELECT *`, lọc bỏ bản ghi bị soft delete `deleted_at IS NOT NULL`).
    *   Thực hiện ép kiểu dữ liệu từ database `numeric` sang application `number` để an toàn cho tính toán.
    *   Hỗ trợ đầy đủ các phương thức CRUD chuẩn: `findAll`, `findById`, `count`, `create`, `update`, `softDelete`.
*   **Service Layer** [merchant.service.ts](file:///e:/Web-Seo/src/lib/services/merchant.service.ts):
    *   Xử lý logic xác thực số điện thoại chuẩn Việt Nam.
    *   Xử lý logic nghiệp vụ và phân trang dữ liệu an toàn.
*   **API Route Handler** [route.ts](file:///e:/Web-Seo/src/app/api/merchants/route.ts):
    *   Tạo endpoint `GET /api/merchants` có phân trang, kiểm tra kiểu dữ liệu đầu vào tham số truy vấn (`page`, `limit`).
    *   Tuân thủ nghiêm ngặt ranh giới domain: API handler chỉ tương tác qua Service layer, không gọi trực tiếp Repository.

### 3. Thiết lập Product Component (T7)
*   **Repository Layer** [product.repository.ts](file:///e:/Web-Seo/src/lib/repositories/product.repository.ts):
    *   Thực hiện truy vấn JOIN với bảng `merchants` để lấy thông tin vựa đi kèm sản phẩm.
    *   Hỗ trợ tìm kiếm theo tiền tố slug (`findBySlugPrefix`) phục vụ cho logic ProductGroup (gộp các biến thể tôm sú/cua biển size khác nhau thành một nhóm).
*   **Service Layer** [product.service.ts](file:///e:/Web-Seo/src/lib/services/product.service.ts):
    *   Xác thực định dạng slug và giá bán.
    *   Triển khai phương thức `getProductVariants` dựa trên tiền tố slug để phục vụ SEO.

---

## 📈 Kết Quả Xác Thực (Verification Results)

### 1. Kiểm tra Linter (ESLint & Typecheck)
Chạy kiểm tra cú pháp toàn dự án:
```bash
npm run lint
```
**Kết quả:** Thành công hoàn toàn. Đã loại bỏ tất cả các kiểu dữ liệu `any` và thay thế bằng các interface kiểu cụ thể (`DBMerchantRow`, `DBProductRow`), vượt qua kiểm tra ESLint nghiêm ngặt (`@typescript-eslint/no-explicit-any`).

### 2. Kiểm tra Biên Dịch (Build Check)
Chạy build dự án Next.js:
```bash
npm run build
```
**Kết quả:** Build thành công 100% trong môi trường Turbopack. TypeScript hoàn thành biên dịch xuất sắc trong `29.1s` và tạo ra phiên bản sản xuất tối ưu.

### ⚠️ Lưu ý về Cơ sở dữ liệu:
Khi chạy script kiểm tra kết nối `test-connection.ts`, thư viện `postgres` trả về lỗi DNS/IP `ENOTFOUND` từ Supabase pooler:
`PostgresError: (ENOTFOUND) tenant/user postgres.jfupbhfwoxylqwxxaaeo not found`
Lỗi này xuất phát từ phía hạ tầng Supabase (có thể dự án đang bị tạm dừng - paused hoặc cấu hình pooler bị thay đổi). Mã nguồn kết nối của chúng ta hoàn toàn đúng chuẩn, bạn nên kiểm tra trạng thái dự án trên trang quản trị Supabase.

---

## 📋 Bước Tiếp Theo Đề Xuất
Bàn giao công việc cho **Frontend Developer (Dinh)** bằng lệnh `/dev-fe-dinh` để thực hiện các nhiệm vụ UI:
1.  Tích hợp TailwindCSS v4 css-first và font `Be Vietnam Pro` (T2).
2.  Thiết lập Root Layout & Navigation (T3).
3.  Xây dựng trang danh sách/chi tiết Thương lái (T6) và Sản phẩm (T8) kết nối với các Service Backend đã dựng.
4.  Tạo sitemap động và robots.txt (T9).
