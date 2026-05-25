# ADR-001: Cấu Trúc Thư Mục Next.js App Router Tối Ưu SEO

- **Ngày:** 2026-05-25
- **Tác giả:** Tech Lead (An)
- **Trạng thái:** Đã phê duyệt

---

## Ngữ Cảnh & Vấn Đề

Dự án **Hải Sản Cà Mau** là một ứng dụng thương mại điện tử và kết nối thương lái, tập trung mạnh vào tối ưu hóa công cụ tìm kiếm (SEO) để thu hút traffic tự nhiên (organic traffic).
Ứng dụng sử dụng:
- **Next.js 16.2.6 (App Router)** với TypeScript.
- **TailwindCSS v4** (phương pháp css-first, không dùng file cấu hình JS).
- **Supabase PostgreSQL** thông qua cấu trúc **Service-Repository Pattern**.

Chúng ta cần thiết lập một cấu trúc thư mục chuẩn cho `src/` nhằm:
1. Đảm bảo cấu trúc URL rõ ràng, tối ưu SEO on-page.
2. Tách biệt rõ ràng các tầng trách nhiệm giữa UI (Frontend), Logic nghiệp vụ (Service), Truy xuất dữ liệu (Repository) và Database Client.
3. Phân định ranh giới rõ ràng cho các Agent AI làm việc song song (Domain Isolation) để tránh xung đột mã nguồn (merge conflicts).
4. Tích hợp sẵn các cơ chế SEO đặc thù của Next.js (Dynamic Sitemap, Robots.txt, Open Graph Images, JSON-LD Schema).

---

## Quyết Định Chọn

Chúng ta quyết định áp dụng cấu trúc thư mục `src/` chi tiết như sau:

```
src/
├── app/                          ← Next.js App Router
│   ├── (marketing)/              ← Nhóm route giới thiệu, blog, landing page
│   │   ├── page.tsx               ← Trang chủ "/" (Pyramid Root)
│   │   ├── ve-chung-toi/
│   │   │   └── page.tsx           ← Trang giới thiệu
│   │   └── blog/
│   │       ├── page.tsx           ← Danh sách bài viết blog (SEO Hub)
│   │       └── [slug]/
│   │           └── page.tsx       ← Chi tiết bài viết (JSON-LD Article Schema)
│   ├── (catalog)/                ← Nhóm route danh mục & sản phẩm
│   │   ├── san-pham/
│   │   │   ├── page.tsx           ← Danh sách tất cả sản phẩm
│   │   │   └── [slug]/
│   │   │       └── page.tsx       ← Chi tiết sản phẩm (JSON-LD Product/ProductGroup Schema)
│   │   └── danh-muc/
│   │       └── [slug]/
│   │           └── page.tsx       ← Danh mục sản phẩm (Tôm sú, Cua biển, Khô...)
│   ├── thuong-lai/               ← Nhóm route liên quan đến Thương lái (Merchants)
│   │   ├── page.tsx               ← Danh sách thương lái
│   │   └── [slug]/
│   │       └── page.tsx           ← Chi tiết thương lái (JSON-LD Profile Schema)
│   ├── api/                      ← API Route Handlers (chỉ gọi Service Layer)
│   │   ├── products/
│   │   │   └── route.ts
│   │   └── merchants/
│   │       └── route.ts
│   ├── sitemap.ts                ← Sitemap XML động (Chứa toàn bộ sản phẩm, bài viết)
│   ├── robots.ts                 ← Robots.txt động (Khai báo sitemap, chặn trang nhạy cảm)
│   ├── manifest.ts               ← Web App Manifest (PWA và tối ưu Mobile SEO)
│   ├── layout.tsx                ← Root layout (Meta tags gốc, import Be Vietnam Pro font)
│   └── globals.css               ← CSS global (Chứa TailwindCSS v4 `@theme`)
├── components/
│   ├── ui/                       ← Các component nguyên tử (Button, Badge, Card, Input)
│   ├── features/                 ← Component theo tính năng cụ thể (ProductCard, MerchantList)
│   └── layout/                   ← Component tĩnh (Header, Footer, Navigation, Breadcrumbs)
├── lib/
│   ├── db/                       ← Database client kết nối Supabase
│   │   └── supabase.ts
│   ├── repositories/             ← Tầng truy cập dữ liệu (*.repository.ts)
│   │   ├── product.repository.ts
│   │   └── merchant.repository.ts
│   └── services/                 ← Tầng nghiệp vụ và logic validation (*.service.ts)
│       ├── product.service.ts
│       └── merchant.service.ts
└── types/                        ← Định nghĩa Type của hệ thống (*.types.ts)
    ├── product.types.ts
    └── merchant.types.ts
```

---

## Chi Tiết Kỹ Thuật & Tối Ưu SEO

### 1. Phân Nhóm Route (Route Groups `(marketing)`, `(catalog)`)
Sử dụng dấu ngoặc đơn `()` để nhóm các route mà không làm ảnh hưởng đến cấu trúc URL thực tế. Điều này giúp mã nguồn ngăn nắp và cho phép chia sẻ layout tối ưu (ví dụ: layout của catalog có breadcrumbs và bộ lọc, trong khi layout marketing thì tối giản).

### 2. Các File SEO Bắt Buộc của Next.js
- **`sitemap.ts`**: Tự động sinh `sitemap.xml` bằng cách truy vấn database để lấy danh sách bài viết blog, sản phẩm, thương lái đang hoạt động, cập nhật theo thời gian thực.
- **`robots.ts`**: Tự động sinh `robots.txt`, khai báo đường dẫn sitemap và cấu hình `Disallow` cho các trang quản trị hoặc tìm kiếm nội bộ để tối ưu ngân sách cào dữ liệu (crawl budget).
- **`manifest.ts`**: Cung cấp metadata cho Progressive Web App (PWA), giúp Google bot đánh giá cao trải nghiệm mobile.
- **Metadata Generation**: Mỗi `page.tsx` phải sử dụng `generateMetadata` để trả về metadata động:
  ```typescript
  export async function generateMetadata({ params }) {
    // Truy vấn dữ liệu từ service...
    return {
      title: '...',
      description: '...',
      alternates: {
        canonical: `https://haisancamau.vn/san-pham/${params.slug}`
      }
    }
  }
  ```

### 3. Quy tắc Canonical & Pagination
- **Self-referencing Canonical**: Tất cả các trang phải có thẻ canonical trỏ về chính nó để tránh trùng lặp nội dung do các query parameters (UTM, tracking).
- **Pagination Canonical**: Đối với các trang phân trang (ví dụ: `/san-pham?page=2`), thẻ canonical **phải** trỏ về chính nó (`/san-pham?page=2`), **tuyệt đối không** trỏ về trang 1 (`/san-pham`). Điều này giúp Googlebot index được đầy đủ sản phẩm ở các trang sau.

### 4. Cấu Trúc Liên Kết Kim Tự Tháp (Pyramid Linking)
Các liên kết nội bộ phải chảy theo sơ đồ hình kim tự tháp:
```
               Trang Chủ "/"
                    ↓
   Danh Mục Chính ("/san-pham", "/thuong-lai", "/blog")
                    ↓
  Danh Mục Con ("/danh-muc/tom-su", "/danh-muc/cua-bien")
                    ↓
Chi Tiết Sản Phẩm & Thương Lái ("/san-pham/tom-su-ca-mau-size-10")
```
- Các trang ở tầng dưới phải có Breadcrumbs để trỏ liên kết ngược lên tầng trên.
- Các sản phẩm quan trọng phải được liên kết trực tiếp từ trang chủ hoặc trang danh mục chính.

---

## Hệ Quả & Ràng Buộc

1. **Phân vai Agent**:
   - Backend Dev (Dat) làm việc trong `src/lib/`, `src/types/`, và `src/app/api/`.
   - Frontend Dev (Dinh) làm việc trong `src/app/` (ngoại trừ api), `src/components/`, và `public/`.
   - Mọi agent khác tuân thủ nghiêm ngặt ranh giới này để tránh conflict.
2. **Quy tắc Service-Repository**:
   - Component không được gọi repository hay truy vấn database trực tiếp. Phải thông qua Service layer.
   - API routes chỉ đóng vai trò nhận request, xác thực, và gọi Service.
3. **TailwindCSS v4**:
   - Không tạo file `tailwind.config.js`. Toàn bộ tùy biến theme (màu sắc, font) phải đặt trong `@theme` của `src/app/globals.css`.
