# Semantic Knowledge Base — Standard SEO Patterns

Tài liệu này định hình các mô thức SEO (Search Engine Optimization) bắt buộc áp dụng cho toàn bộ các trang giao diện của dự án Hải Sản Cà Mau. Mọi lập trình viên hoặc AI Agent sửa đổi frontend phải tuân thủ nghiêm ngặt để đảm bảo khả năng xếp hạng cao nhất trên Google.

---

## 1. Metadata & Alternates Canonical

Mỗi trang (`page.tsx`) bắt buộc phải khai báo metadata cụ thể, bao gồm cả tag `alternates.canonical` để tránh trùng lặp nội dung.

### 1.1 Khai báo Metadata tĩnh
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tôm Sú Cà Mau Tươi Sống Loại 1 — Giá Tốt Hôm Nay',
  description: 'Chuyên cung cấp tôm sú Cà Mau tươi sống đánh bắt tự nhiên, đầy thịt, giao nhanh 2h tại TP.HCM. Xem bảng giá chi tiết tại đây.',
  alternates: {
    canonical: '/san-pham/tom-su-ca-mau',
  },
}
```

### 1.2 Khai báo Metadata động (Dynamic Pages)
Dành cho trang chi tiết sản phẩm `/san-pham/[slug]` hoặc thương lái `/thuong-lai/[slug]`.
```typescript
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  return {
    title: `${product.name} Tươi Sống Cà Mau — Giá Tốt Nhất`,
    description: product.description?.slice(0, 155) || `Mua ${product.name} tại vựa hải sản Cà Mau uy tín.`,
    alternates: {
      canonical: `/san-pham/${slug}`,
    },
  };
}
```

---

## 2. Quy Tắc Canonical Cho Phân Trang (Pagination Canonical)

> [!IMPORTANT]
> **Quy tắc vàng:** TUYỆT ĐỐI KHÔNG canonical các trang phân trang (ví dụ: page=2, page=3) quay về trang 1.
> Mỗi trang trong chuỗi phân trang phải trỏ canonical về chính nó (self-referencing canonical URL).
> Điều này giúp Googlebot có thể cào (crawl) và chỉ mục (index) toàn bộ sản phẩm ở các trang sau mà không coi chúng là trùng lặp nội dung của trang 1.

*Ví dụ:*
- Đường dẫn: `/san-pham?page=2` -> Canonical URL: `/san-pham?page=2`
- Đường dẫn: `/san-pham?page=3` -> Canonical URL: `/san-pham?page=3`

---

## 3. Cấu Trúc JSON-LD Schema (Rich Results)

Tích hợp JSON-LD trực tiếp vào HTML bằng thẻ `<script type="application/ld+json">`.

### 3.1 Product & ProductGroup Schema
Áp dụng cho trang chi tiết sản phẩm. Sử dụng `ProductGroup` nếu sản phẩm có nhiều phân loại kích cỡ (ví dụ: tôm sú loại 10 con/kg, loại 20 con/kg).
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  'name': product.name,
  'image': product.imageUrl || 'https://haisancamau.vn/default-seafood.jpg',
  'description': product.description || 'Hải sản Cà Mau tươi ngon',
  'offers': {
    '@type': 'Offer',
    'price': product.price,
    'priceCurrency': 'VND',
    'itemCondition': 'https://schema.org/NewCondition',
    'availability': product.is_auto_listed ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    'seller': {
      '@type': 'Organization',
      'name': 'Hải Sản Cà Mau'
    }
  }
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* UI Component */}
  </>
);
```

### 3.2 Article Schema (Cho Blog)
Áp dụng cho trang chi tiết bài viết `/blog/[slug]`.
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  'headline': post.title,
  'image': [post.coverImage],
  'datePublished': post.createdAt,
  'dateModified': post.updatedAt,
  'author': [{
    '@type': 'Person',
    'name': post.authorName,
    'url': 'https://haisancamau.vn'
  }]
};
```

---

## 4. Cấu Trúc Liên Kết Kim Tự Tháp (Pyramid Link Architecture)

Liên kết nội bộ (Internal Links) phải đi theo mô hình Kim Tự Tháp chặt chẽ để tối ưu hóa PageRank:

```
          [Trang Chủ]
          /    |    \
   [Tôm Sú] [Cua Biển] [Khô Cà Mau]  <-- Các Danh Mục Chính
    /    \   /    \     /      \
  [S.Phẩm cụ thể 1, 2, 3, 4, 5...]   <-- Trang Chi Tiết Sản Phẩm
```

*   **Quy tắc điều hướng:**
    *   Trang chủ phải liên kết trực tiếp tới các trang Danh mục chính.
    *   Trang Danh mục chính phải có danh sách các sản phẩm và liên kết trực tiếp đến trang Chi tiết sản phẩm.
    *   Trang Chi tiết sản phẩm phải có liên kết Breadcrumb quay lại Danh mục cha và Trang chủ để bot dễ dàng di chuyển ngược lên trên.
    *   Sử dụng thẻ `<Link href="...">` của Next.js để giữ liên kết tĩnh. **CẤM** dùng sự kiện `onClick` của JavaScript để chuyển hướng (vì Googlebot không thực thi onClick để crawl).
