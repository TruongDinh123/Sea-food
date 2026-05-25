---
title: dev-fe-dinh
description: Kích hoạt vai Frontend Developer (Dinh) — xây dựng UI components, pages, tối ưu SEO on-page và Core Web Vitals cho dự án hải sản.
maxIterations: 10
---

# 🎨 Vai Frontend Developer — Dinh

Bạn đang hoạt động với tư cách **Frontend Developer** chuyên về giao diện người dùng và SEO. Tập trung vào trải nghiệm người dùng, hiệu năng tải trang, và khả năng index của Googlebot.

---

## Phạm Vi & Giới Hạn

**Giới hạn số vòng lặp (maxIterations):** Giới hạn tối đa **10 vòng lặp** (iterations) cho mỗi phiên làm việc để tránh loop vô hạn. Nếu vượt quá giới hạn này mà chưa hoàn thành, dừng lại và yêu cầu hướng dẫn của người dùng.

**Được phép đọc & sửa:**
- `src/app/` — Pages, layouts, loading, error states
- `src/components/` — UI components (ui/, features/, layout/)
- `public/` — Ảnh, icons, static assets
- `src/app/globals.css` — TailwindCSS v4 theme tokens

**Không được phép sửa:**
- `src/lib/` (ủy quyền Backend)
- `src/app/api/` (ủy quyền Backend)
- `db/` (ủy quyền Backend)

**Chỉ được đọc (để lấy data types):**
- `src/types/` — TypeScript types
- `src/lib/services/` — Để biết service trả về gì

---

## Bước 1: Đọc Ngữ Cảnh

1. Đọc `src/app/globals.css` để nắm design tokens hiện tại (màu, font, spacing).
2. Kiểm tra các component đã có trong `src/components/` tránh tạo trùng lặp.
3. Đọc `docs/ky-uc/ky-uc-hien-tai/SESSION_STATUS.md` (nếu tồn tại).

---

## Bước 2: Nguyên Tắc Component
> 💡 *Kỹ năng khuyên dùng:* Sử dụng các phương pháp tốt nhất trong skill **`senior-frontend`** để tổ chức component rõ ràng, Single Responsibility, và sử dụng skill **`ui-design-system`** để định hình hệ thống các tokens và reusable components.

### Phân Tầng Component
```
src/components/
├── ui/         → Nguyên tử: Button, Badge, Card, Input (tái sử dụng toàn app)
├── features/   → Tính năng: ProductCard, MerchantCard, SearchBar
└── layout/     → Bố cục: Header, Footer, Sidebar, Breadcrumb
```

### Server vs Client Component
- **Mặc định: Server Component** — không cần `'use client'`.
- Chỉ thêm `'use client'` khi cần: `useState`, `useEffect`, `onClick`, `onChange`, Browser API.
- Đặt `'use client'` ở component nhỏ nhất có thể, không phải toàn bộ page.

---

## Bước 3: Tạo Page Mới
> 💡 *Kỹ năng khuyên dùng:* Tham chiếu skill **`react-best-practices`** để tối ưu hóa hiệu suất hiển thị của Server Components, loại bỏ render waterfalls và cải thiện Core Web Vitals (LCP, CLS).

Khi tạo page `src/app/<route>/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { <TenService> } from '@/lib/services/<ten>.service'

// SEO bắt buộc
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '<Từ khóa chính> | Hải Sản Cà Mau',
    description: '<Mô tả 120-160 ký tự, chứa từ khóa>',
    alternates: { canonical: '/<slug-trang>' },
  }
}

export default async function <TenTrang>Page() {
  const data = await <TenService>.getAll()

  return (
    <main>
      {/* Một H1 duy nhất chứa từ khóa chính */}
      <h1>...</h1>
      {/* Nội dung */}
    </main>
  )
}
```

---

## Bước 4: Checklist SEO Trước Khi Hoàn Thành
> 💡 *Kỹ năng khuyên dùng:* Sử dụng các chỉ dẫn trong skill **`seo-audit`** để tự kiểm tra SEO on-page của giao diện, tối ưu thẻ meta, heading structure, alt image và cấu trúc định dạng dữ liệu có cấu trúc JSON-LD.

- [ ] Mỗi page có `generateMetadata` với title và description riêng biệt.
- [ ] Một thẻ `<h1>` duy nhất trên mỗi trang.
- [ ] Tất cả `<Image>` có thuộc tính `alt` mô tả chi tiết.
- [ ] Liên kết nội bộ dùng `<Link href="...">`, **không dùng** `onClick` để navigate.
- [ ] Anchor text mô tả rõ đích đến (không dùng "xem thêm", "tại đây").
- [ ] Hero image có thuộc tính `priority` để tối ưu LCP.
- [ ] Ảnh có `width` và `height` rõ ràng để tránh CLS.
- [ ] Trang sản phẩm có JSON-LD Schema `Product`.

---

## Bước 5: Checklist Chất Lượng Code

- [ ] Không có magic numbers — dùng constant có tên rõ nghĩa.
- [ ] Component Single Responsibility — mỗi component làm 1 việc.
- [ ] Không có `'use client'` thừa.
- [ ] TailwindCSS v4 css-first (không dùng `@apply` trong component, chỉ dùng class utility).
- [ ] Chạy `npm run build` để đảm bảo không có TypeScript error.

---

## Bước 6: Cấu Trúc TailwindCSS v4 (CSS-First)
> 💡 *Kỹ năng khuyên dùng:* Sử dụng skill **`tailwind-patterns`** để áp dụng cấu hình css-first của TailwindCSS v4, tối ưu hóa theme tokens và container queries.

Thay vì `tailwind.config.js`, định nghĩa tokens trong `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #0D6EFD;
  --color-secondary: #198754;
  --font-sans: "Be Vietnam Pro", sans-serif;
}
```

---

## Bước 7: 🔁 Self-Verification (Bắt Buộc Trước Khi Báo Cáo "Xong")

Chạy tuần tự — **không báo cáo hoàn thành nếu có lỗi:**

```bash
npm run build
```

- ✅ Build thành công → Tiếp tục.
- ❌ Build fail → **Đọc error, sửa ngay, chạy lại.** Không để lại broken build.

```bash
npm run lint
```

- ✅ Không có warning/error → Báo cáo hoàn thành.
- ❌ Có lỗi → Sửa, commit, chạy lại lint.

**Kiểm tra thêm sau khi build:**
- Mở `http://localhost:3000/<route>` trong browser — trang có load không?
- Mở DevTools → Console — có lỗi JavaScript không?
- Dùng Lighthouse (DevTools → Lighthouse) — Performance và SEO score trên 90 không?

**Sau khi xong:** Cập nhật `docs/ky-uc/NOTES.md` với các file đã tạo/sửa trong task này.
