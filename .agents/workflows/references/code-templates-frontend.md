# 📚 Frontend Code Templates — Tài Liệu Tham Chiếu

> Đây là thư viện template chuẩn. **KHÔNG** copy-paste nguyên xi — điều chỉnh tên, slug, và nội dung.  
> Workflow chính: `../dev-fe-dinh.md`

---

## Template 1: Page với generateMetadata

**File:** `src/app/<route>/page.tsx`

```typescript
import type { Metadata } from 'next'
import { <TenService> } from '@/lib/services/<ten>.service'

// SEO bắt buộc — title và description riêng biệt cho mỗi trang
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '<Từ khóa chính> | Hải Sản Cà Mau',
    description: '<Mô tả 120-160 ký tự, chứa từ khóa, thể hiện giá trị>',
    alternates: { canonical: '/<slug-trang>' },
    openGraph: {
      title: '<Từ khóa chính> | Hải Sản Cà Mau',
      description: '<Mô tả ngắn cho OG>',
    },
  }
}

export default async function <TenTrang>Page() {
  const data = await <TenService>.getAll()

  return (
    <main>
      {/* Chỉ 1 thẻ h1 duy nhất trên toàn trang */}
      <h1><Tiêu đề chứa từ khóa chính></h1>
      {/* Nội dung trang */}
    </main>
  )
}
```

---

## Template 2: Dynamic Page với JSON-LD Product Schema

**File:** `src/app/san-pham/[slug]/page.tsx`

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductService } from '@/lib/services/product.service'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await ProductService.getBySlug(slug)
  if (!product) return { title: 'Không tìm thấy | Hải Sản Cà Mau' }

  return {
    title: `${product.name} | Hải Sản Tươi Cà Mau`,
    description: `${product.name} tươi sống từ Cà Mau. Giá ${product.price_min}–${product.price_max}đ/kg. Giao hàng toàn quốc.`,
    alternates: { canonical: `/san-pham/${slug}` },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await ProductService.getBySlug(slug)
  if (!product) notFound()

  // JSON-LD Schema — bắt buộc cho trang sản phẩm
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product.price_min,
      highPrice: product.price_max,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <h1>{product.name}</h1>
        {/* Nội dung chi tiết sản phẩm */}
      </main>
    </>
  )
}
```

---

## Template 3: Server Component với Image Optimization

```typescript
import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
  id: string
  name: string
  slug: string
  imageUrl: string
  priceMin: number
}

// Server Component — không cần 'use client'
export default function ProductCard({ id, name, slug, imageUrl, priceMin }: ProductCardProps) {
  return (
    // Dùng design token class — KHÔNG dùng arbitrary pixel
    <article className="bg-canvas rounded-cards overflow-hidden">
      <Link href={`/san-pham/${slug}`}>
        {/* Ảnh: luôn có width, height, và alt để tránh CLS */}
        <Image
          src={imageUrl}
          alt={`${name} tươi ngon từ Cà Mau`}
          width={400}
          height={300}
          // priority chỉ dùng cho hero image (LCP element)
        />
        <div className="p-card-padding">
          {/* Anchor text mô tả cụ thể, không dùng "xem thêm" */}
          <h2 className="text-ink-black font-semibold">{name}</h2>
          <p className="text-soft-gray">Từ {priceMin.toLocaleString('vi-VN')}đ/kg</p>
        </div>
      </Link>
    </article>
  )
}
```

---

## Template 4: Client Component (chỉ khi thực sự cần)

```typescript
'use client' // ← Chỉ thêm khi CẦN: useState, useEffect, onClick, Browser API

import { useState } from 'react'

type SearchBarProps = {
  onSearch: (query: string) => void
}

// Client Component vì cần event handler và state
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm tôm sú, cua biển..."
        className="rounded-buttons border border-canvas"
        aria-label="Tìm kiếm sản phẩm hải sản"
      />
      <button type="submit" className="rounded-buttons bg-deepwater-teal text-pure-white">
        Tìm kiếm
      </button>
    </form>
  )
}
```

---

## Template 5: Loading & Error States

**Loading:** `src/app/<route>/loading.tsx`
```typescript
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-card-padding">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-canvas rounded-cards h-48" />
      ))}
    </div>
  )
}
```

**Not Found:** `src/app/<route>/not-found.tsx`
```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="text-center p-card-padding">
      <h1 className="text-ink-black">Không tìm thấy trang</h1>
      <p className="text-soft-gray">Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
      {/* Anchor text rõ ràng */}
      <Link href="/" className="text-deepwater-teal">
        Về trang danh sách hải sản Cà Mau
      </Link>
    </main>
  )
}
```
