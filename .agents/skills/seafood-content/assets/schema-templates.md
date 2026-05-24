# Schema JSON-LD Templates — Hải Sản Cà Mau
> Copy schema phù hợp, điền vào [BRACKET], đặt trong thẻ <script> trong page.tsx

---

## Schema 1: Article (Bài Viết Blog)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Tiêu đề bài viết — khớp với H1]",
  "description": "[Meta description — 120-160 ký tự]",
  "image": "[URL ảnh đại diện — tối thiểu 1200x630px]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Organization",
    "name": "Hải Sản Cà Mau",
    "url": "https://[domain.com]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Hải Sản Cà Mau",
    "logo": {
      "@type": "ImageObject",
      "url": "https://[domain.com]/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://[domain.com]/[slug-bai-viet]"
  }
}
```

---

## Schema 2: Product (Trang Sản Phẩm)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Tên sản phẩm đầy đủ — khớp với H1]",
  "description": "[Mô tả sản phẩm 150-200 từ]",
  "image": [
    "https://[domain.com]/images/[san-pham]-1.jpg",
    "https://[domain.com]/images/[san-pham]-2.jpg"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Hải Sản Cà Mau"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://[domain.com]/san-pham/[slug]",
    "priceCurrency": "VND",
    "price": "[giá số — ví dụ: 280000]",
    "priceValidUntil": "[YYYY-MM-DD]",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "[số lượng đánh giá thực tế]"
  }
}
```

---

## Cách Nhúng Vào Next.js (App Router)

```typescript
// src/app/san-pham/[slug]/page.tsx

export default function ProductPage({ params }: { params: { slug: string } }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    // ... điền schema từ template trên
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Nội dung trang */}
    </>
  )
}
```

---

## Checklist Validate Schema

- [ ] Dùng [Google Rich Results Test](https://search.google.com/test/rich-results) để kiểm tra
- [ ] Giá (`price`) là số nguyên, không có đơn vị
- [ ] `priceCurrency` là "VND"
- [ ] `image` là URL tuyệt đối (bắt đầu bằng https://)
- [ ] `datePublished` định dạng ISO 8601: YYYY-MM-DD
