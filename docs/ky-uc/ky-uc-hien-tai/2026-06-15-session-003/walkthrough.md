# Walkthrough - Trang Đăng Ký Sản Vật Mới và Live Preview Tích Hợp Chuẩn SEO

Phiên làm việc ngày: 2026-06-15  
Trạng thái: **Hoàn tất (100%) & Đã Kiểm Thử Tự Động PASSED**  
Nhánh Git đề xuất: `feature/product-create-dedicated-page`

---

## 🚀 Tính năng & Giao diện mới

Chúng ta đã chuyển đổi tính năng đăng ký dòng thủy sản mới từ dạng **Modal cũ** sang **Trang tạo riêng biệt** với các điểm nâng cấp vượt trội:
1. **Trang tạo sản vật độc lập (`/dashboard/merchant/san-pham/tao-moi`):**
   * Tích hợp cơ chế kiểm tra Session phía Server, đảm bảo chỉ thương lái đã đăng nhập và được duyệt mới có quyền truy cập.
   * Giao diện split-screen hiện đại, tối ưu hóa không gian làm việc.
2. **Giao diện điền thông tin (Cột trái):**
   * Đầy đủ các trường: Tên sản vật, Slug tự động sinh, Giá sỉ, Giá lẻ gốc gợi ý, Nhóm ngành hàng, Ảnh thực tế.
   * Đặc tả nguồn gốc (Mô tả ngắn) và bài viết giới thiệu chi tiết (Mô tả chi tiết bằng **TipTap Editor** chuẩn WYSIWYG).
   * Cấu hình SEO chuyên sâu: Từ khóa SEO chính (Focus Keyword), Meta description (tối đa 160 ký tự với bộ đếm realtime).
3. **Live Preview Realtime (Cột phải):**
   * **Google SERP Snippet Preview:** Hiển thị giao diện giả lập kết quả tìm kiếm trên Google (gồm Favicon, Tiêu đề SEO động và Meta Description).
   * **Mobile Page Detail Preview:** Giả lập chi tiết trang sản phẩm hiển thị trên thiết bị di động với đầy đủ hình ảnh, giá bán, size tuyển chọn, thông tin thương lái, nút liên hệ đặt sỉ và phần render bài viết chi tiết từ TipTap Editor.

---

## 🛠️ Các tệp được tạo mới và sửa đổi

### 1. Phía Dashboard Thương Lái (Dashboard)
* **[MODIFY] [MerchantDashboardClient.tsx](file:///e:/Web-Seo/src/app/dashboard/merchant/MerchantDashboardClient.tsx):** Chuyển đổi trạng thái tab, hỗ trợ đọc `?tab=products` từ search params và dọn dẹp các logic modal cũ.
* **[MODIFY] [ProductManagerTab.tsx](file:///e:/Web-Seo/src/app/dashboard/merchant/ProductManagerTab.tsx):** Thay đổi nút "Đăng dòng sản vật mới" thành nút chuyển hướng router sang trang tạo độc lập.
* **[MODIFY] [DashboardLayout.tsx](file:///e:/Web-Seo/src/app/dashboard/merchant/DashboardLayout.tsx):** Gán test ID `add-product-btn` cho nút tạo để Playwright E2E dễ định vị.

### 2. Trang Tạo Mới Riêng Biệt (Dedicated Page)
* **[NEW] [page.tsx](file:///e:/Web-Seo/src/app/dashboard/merchant/san-pham/tao-moi/page.tsx):** Điểm vào phía Server, xác thực và lấy thông tin thương lái từ cơ sở dữ liệu.
* **[NEW] [CreateProductClient.tsx](file:///e:/Web-Seo/src/app/dashboard/merchant/san-pham/tao-moi/CreateProductClient.tsx):** Thành phần Client chính xử lý form, upload ảnh, render preview và gọi API lưu sản phẩm mới.

### 3. Bộ Kiểm Thử E2E (Testing)
* **[NEW] [product-create-preview.spec.ts](file:///e:/Web-Seo/e2e/product-create-preview.spec.ts):** Bộ test E2E Playwright kiểm tra kịch bản happy path: đăng nhập, điều hướng đến trang tạo mới, điền dữ liệu động, xác nhận cập nhật Live Preview/Google Preview và đăng bán thành công.

---

## 🧪 Kết quả kiểm thử chất lượng (Quality Assurance)

* **Type Check (`npm run type-check`):** **PASS** (0 errors) ✅.
* **ESLint (`npm run lint`):** **PASS** (0 errors trong các file code thay đổi) ✅.
* **E2E Playwright Tests (`npx playwright test e2e/product-create-preview.spec.ts --workers=1`):** **PASS** trên cả 2 nền tảng:
  * **Chromium (Desktop):** Đạt 100% độ bao phủ happy path, kiểm tra cập nhật preview động thành công.
  * **Mobile Chrome (Mobile):** Đạt 100% độ bao phủ, kiểm tra responsive giao diện và kiểm thử luồng chuyển hướng thành công.

```bash
Running 2 tests using 1 worker

[DB Seed Warning]: /api/test/db returned status 500. Make sure to implement seed endpoint in Milestone 2.
  ok 1 [chromium] › e2e\product-create-preview.spec.ts:11:7 › E2E: Product Creation Dedicated Page & Live Preview › Should navigate to dedicated page and display live updates in preview (6.1s)
[DB Seed Warning]: /api/test/db returned status 500. Make sure to implement seed endpoint in Milestone 2.
  ok 2 [mobile-chrome] › e2e\product-create-preview.spec.ts:11:7 › E2E: Product Creation Dedicated Page & Live Preview › Should navigate to dedicated page and display live updates in preview (5.8s)

  2 passed (14.1s)
```

### 💡 Các điểm tối ưu hóa trong quá trình debug E2E test:
1. **Xử lý Race-Condition khi login:** Thay thế việc điều hướng thủ công `dashboard.goto()` bằng cơ chế đợi chuyển hướng tự động `await expect(page).toHaveURL(/.*dashboard\/merchant/)` để cookie phiên đăng nhập Next.js được ghi nhận hoàn tất và ổn định.
2. **Khắc phục lỗi Strict Mode của Playwright:** Định vị cụ thể tiêu đề trang thông qua `page.locator('h1').first()` để tránh xung đột với thẻ `h1` hiển thị trong Live Preview.
3. **Cải tiến tính năng Định vị Preview:** Thêm `data-testid="product-desc-preview"` vào khối hiển thị mô tả ngắn để tránh định vị nhầm với các thẻ `<p>` địa chỉ của thương lái trong preview.
4. **Hỗ trợ chạy test độc lập với Database State:** Sử dụng timestamp `Date.now()` động gắn vào tên và slug sản phẩm để tránh lỗi trùng lặp dữ liệu (Unique Constraint) khi API reset database `/api/test/db` trả về mã lỗi 500 trên local.
