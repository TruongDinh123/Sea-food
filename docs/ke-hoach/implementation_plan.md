# Kế Hoạch Triển Khai: Phát Triển Tầng Dữ Liệu & API (Sprint 1 Backend)

Tài liệu này đề xuất chi tiết kỹ thuật triển khai mã nguồn Backend cho Sprint 1 (các nhiệm vụ **T1, T4, T5, T7**), tập trung vào thiết lập Types, tầng Repository truy xuất dữ liệu, tầng Service xử lý business logic, và API Route Handler cho Thương lái.

---

## User Review Required

> [!IMPORTANT]
> - **Cấu trúc Dữ liệu & Kiểu (Types)**: Định nghĩa các Interface TypeScript tại `src/types/` ánh xạ chính xác với database schema hiện có (đặc biệt là xử lý kiểu dữ liệu `NUMERIC` từ PostgreSQL sang `number` trong ứng dụng).
> - **Nguyên tắc Bảo mật & Dữ liệu**:
>   - Triển khai **Soft Delete** triệt để (`deleted_at IS NOT NULL` là bản ghi bị xóa tạm). Tuyệt đối không dùng lệnh `DELETE` vật lý.
>   - Không sử dụng `SELECT *` trong SQL query. Chỉ chọn đúng các cột cần thiết để tối ưu băng thông và tránh lộ dữ liệu nhạy cảm.
> - **Hỗ trợ ProductGroup (Variants)**: Sử dụng phương pháp truy vấn theo tiền tố slug (slug prefix) để nhóm các biến thể sản phẩm (ví dụ: các size tôm sú khác nhau) giúp Frontend dễ dàng sinh JSON-LD `ProductGroup` schema chuẩn SEO.

---

## Open Questions

> [!NOTE]
> *Không có câu hỏi mở cần làm rõ. Cấu trúc cơ sở dữ liệu hiện tại trong `db/migrations/` đã rất rõ ràng và đầy đủ.*

---

## Proposed Changes

Chúng ta sẽ tạo mới các file sau thuộc tầng Backend:

### 1. TypeScript Types Layer (T1)

Định nghĩa các kiểu dữ liệu khớp với database schema của dự án.

#### [NEW] [merchant.types.ts](file:///e:/Web-Seo/src/types/merchant.types.ts)
*   Định nghĩa `Merchant` interface.
*   Định nghĩa `CreateMerchantInput` và `UpdateMerchantInput`.

#### [NEW] [product.types.ts](file:///e:/Web-Seo/src/types/product.types.ts)
*   Định nghĩa `Product` và `ProductWithMerchant` (kết hợp tên vựa phục vụ UI).
*   Định nghĩa `CreateProductInput` và `UpdateProductInput`.

#### [NEW] [referral.types.ts](file:///e:/Web-Seo/src/types/referral.types.ts)
*   Định nghĩa `ReferralLog` interface cho bảng `referral_logs`.

---

### 2. Merchant Component (T4, T5)

#### [NEW] [merchant.repository.ts](file:///e:/Web-Seo/src/lib/repositories/merchant.repository.ts)
*   Thực hiện các truy vấn cơ bản lên bảng `merchants`.
*   Phương thức: `findAll`, `findById`, `count`, `create`, `update`, `softDelete`.
*   *Lưu ý*: Lọc bỏ các bản ghi có `deleted_at IS NOT NULL`. Ép kiểu dữ liệu `numeric` về `number`.

#### [NEW] [merchant.service.ts](file:///e:/Web-Seo/src/lib/services/merchant.service.ts)
*   Xử lý logic nghiệp vụ cho Thương lái: kiểm tra đầu vào (validation), chuẩn hóa số điện thoại, phân trang.
*   Phương thức: `getPublicMerchants` (chỉ lấy vựa đang hoạt động `is_active = true`), `getMerchantDetails`, `createMerchant`, `updateMerchant`, `deleteMerchant`.

#### [NEW] [route.ts](file:///e:/Web-Seo/src/app/api/merchants/route.ts)
*   API Route Handler `GET /api/merchants` hỗ trợ phân trang qua query params `page` và `limit`.
*   Chỉ gọi qua Service layer, tuyệt đối không gọi trực tiếp Repository hay DB client.

---

### 3. Product Component (T7)

#### [NEW] [product.repository.ts](file:///e:/Web-Seo/src/lib/repositories/product.repository.ts)
*   Thực hiện truy vấn lên bảng `products`.
*   Phương thức: `findAll`, `findById`, `findBySlug`, `findBySlugPrefix` (để hỗ trợ gom nhóm ProductGroup), `count`, `findAllWithMerchant`, `create`, `update`, `softDelete`.

#### [NEW] [product.service.ts](file:///e:/Web-Seo/src/lib/services/product.service.ts)
*   Xử lý logic nghiệp vụ cho Sản phẩm: validate slug, phân nhóm biến thể kích cỡ (ProductGroup), phân trang.
*   Phương thức: `getPublicProducts`, `getProductBySlug`, `getProductVariants` (lấy các sản phẩm cùng nhóm tôm sú size 10, 20 bằng tiền tố slug), `createProduct`, `updateProduct`, `deleteProduct`.

---

## Verification Plan

### Automated Tests
*   Chạy thử script kiểm tra kết nối database bằng lệnh:
    ```bash
    npx tsx --env-file=.env.local src/lib/db/test-connection.ts
    ```
*   Chạy build và lint dự án để đảm bảo kiểu dữ liệu TypeScript đồng bộ, không gây lỗi:
    ```bash
    npm run lint
    ```
    ```bash
    npm run build
    ```

### Manual Verification
*   Kiểm tra trực tiếp endpoint `GET http://localhost:3000/api/merchants?page=1&limit=10` để xác minh:
    *   Cấu trúc dữ liệu trả về chuẩn JSON có metadata phân trang.
    *   Tránh rò rỉ các trường nhạy cảm hoặc trường đã bị soft delete.
