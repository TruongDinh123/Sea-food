# Schema JSON-LD Templates — Hải Sản Cà Mau
> Sao chép schema phù hợp, điền các giá trị thực tế vào phần [BRACKET] và đặt trong thẻ <script> ở page.tsx.

---

## Schema 1: Article (Bài Viết Blog)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Tiêu đề bài viết — khớp chính xác với thẻ H1]",
  "description": "[Meta description — độ dài lý tưởng từ 120-160 ký tự]",
  "image": "[URL ảnh đại diện bài viết — kích thước tối thiểu 1200x630px]",
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

## Schema 2: Product (Trang Sản Phẩm Đơn Lẻ)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Tên sản phẩm đầy đủ — khớp chính xác với thẻ H1]",
  "description": "[Mô tả sản phẩm khoảng 150-200 từ]",
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
    "price": "[giá trị số nguyên — ví dụ: 280000]",
    "priceValidUntil": "[YYYY-MM-DD]",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "[số lượng đánh giá thực tế từ khách hàng]"
  }
}
```

---

## Schema 3: ProductGroup (Nhóm Sản Phẩm Có Biến Thể / Phân Loại)
> Áp dụng cho các sản phẩm có nhiều biến thể như kích cỡ (size 15 con/kg, 30 con/kg) hoặc phân loại trọng lượng, chất lượng.

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "[Tên nhóm sản phẩm — ví dụ: Tôm Sú Cà Mau Đầm Sinh Thái]",
  "description": "[Mô tả chi tiết về nhóm sản phẩm, nêu rõ có các phân loại theo kích cỡ/size]",
  "url": "https://[domain.com]/san-pham/[slug-nhom]",
  "productGroupID": "[Mã ID duy nhất cho nhóm — ví dụ: tom-su-ca-mau-sinh-thai]",
  "brand": {
    "@type": "Brand",
    "name": "Hải Sản Cà Mau"
  },
  "hasVariant": [
    {
      "@type": "Product",
      "sku": "[SKU biến thể 1 — ví dụ: TS-30-CON]",
      "name": "[Tên biến thể 1 — ví dụ: Tôm Sú Cà Mau Size 30 con/kg]",
      "image": "https://[domain.com]/images/tom-su-size-30.jpg",
      "description": "Tôm sú sinh thái đánh bắt tự nhiên, cỡ vừa, thích hợp nấu lẩu, nướng muối ớt.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "VND",
        "price": "[giá số nguyên — ví dụ: 320000]",
        "priceValidUntil": "[YYYY-MM-DD]",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@type": "Product",
      "sku": "[SKU biến thể 2 — ví dụ: TS-15-CON]",
      "name": "[Tên biến thể 2 — ví dụ: Tôm Sú Cà Mau Size 15 con/kg (Loại To)]",
      "image": "https://[domain.com]/images/tom-su-size-15.jpg",
      "description": "Tôm sú sinh thái loại lớn đặc biệt, thịt chắc giòn ngọt đậm đà, lý tưởng cho món hấp nước dừa, ăn sống sashimi.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "VND",
        "price": "[giá số nguyên — ví dụ: 480000]",
        "priceValidUntil": "[YYYY-MM-DD]",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    }
  ]
}
```

---

## Cách Nhúng Vào Next.js (App Router)

```typescript
// src/app/san-pham/[slug]/page.tsx

export default function ProductPage({ params }: { params: { slug: string } }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProductGroup", // Hoặc Product, Article tùy trang
    // ... điền cấu trúc dữ liệu theo template trên
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Nội dung UI hiển thị trên trang */}
    </>
  )
}
```

---

## Checklist Xác Thực (Validation Checklist)

- [ ] Sử dụng công cụ chính thức [Google Rich Results Test](https://search.google.com/test/rich-results) để xác thực.
- [ ] Giá trị trường `price` bắt buộc là số nguyên thuần túy (ví dụ: `280000`), không chứa dấu chấm, dấu phẩy, ký hiệu tiền tệ hoặc chữ.
- [ ] Trường `priceCurrency` phải luôn là `"VND"`.
- [ ] Các URL hình ảnh trong `image` phải là URL tuyệt đối đầy đủ bắt đầu bằng `https://`.
- [ ] Định dạng ngày tháng (`datePublished`, `priceValidUntil`) phải tuân thủ chuẩn ISO 8601: `YYYY-MM-DD`.
