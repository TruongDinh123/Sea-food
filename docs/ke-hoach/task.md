# Checklist Thực Hiện Backend Sprint 1

- [x] T1: Thiết lập Types Layer (`src/types/`)
    - [x] `merchant.types.ts`
    - [x] `product.types.ts`
    - [x] `referral.types.ts`
- [x] T4: Viết Merchant Repository & Service
    - [x] `merchant.repository.ts`
    - [x] `merchant.service.ts`
- [x] T5: Tạo API Route Handler `/api/merchants`
    - [x] `src/app/api/merchants/route.ts`
- [x] T7: Viết Product Repository & Service (Hỗ trợ ProductGroup)
    - [x] `product.repository.ts`
    - [x] `product.service.ts`
- [x] Kiểm tra xác thực (Verification)
    - [x] Chạy `npm run lint`
    - [x] Chạy `npm run build`

# Checklist Thực Hiện Frontend Sprint 1

- [x] T2: Thiết lập CSS Global & Fonts với TailwindCSS v4 css-first
    - [x] globals.css với custom variables cho Arc Design System
    - [x] Font chữ `Be Vietnam Pro`
- [x] T3: Thiết lập Root Layout & Navigation tĩnh
    - [x] `layout.tsx`, `Header.tsx`, `Footer.tsx`
    - [x] Breadcrumbs linh hoạt có chế độ sáng/tối tự động
- [x] T6: Xây dựng trang Thương Lái (`/thuong-lai` & `/thuong-lai/[slug]`)
    - [x] UI Responsive & Minimalist
    - [x] Tích hợp LocalBusiness JSON-LD Schema
    - [x] Dynamic metadata và canonical url tự trỏ
- [x] T8: Xây dựng trang Sản Phẩm (`/san-pham`, `/san-pham/[slug]` và `/danh-muc/[slug]`)
    - [x] UI Responsive hiển thị tôm sú, cua biển
    - [x] Tích hợp ItemList & CollectionPage JSON-LD Schema
    - [x] Self-referencing canonical url cho phân trang
- [x] T9: Triển khai Dynamic Sitemap & Robots.txt
    - [x] Dynamic Sitemap generator gồm sản phẩm, thương lái và blog
    - [x] Cấu hình robots.txt an toàn
- [x] Kiểm tra xác thực (Verification)
    - [x] Thay thế `lucide-react` bằng bộ icon inline SVG `Icons.tsx` tối ưu
    - [x] Khắc phục lỗi compiler và loại bỏ `strokeWidth` không tương thích
    - [x] Chạy build Next.js với heap size mở rộng ( NODE_OPTIONS = 4GB )
