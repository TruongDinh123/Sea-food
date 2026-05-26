import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/ui/Icons'
import Link from 'next/link'
import { ProductService } from '@/lib/services/product.service'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Static expiry date — 7 ngày từ build time (không dùng Date.now() trong render)
const PRICE_VALID_UNTIL = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await ProductService.getProductBySlug(slug)
  if (!product) return { title: 'Không Tìm Thấy | Hải Sản Cà Mau' }

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return {
    title: `${product.name} — Hải Sản Tươi Cà Mau`,
    description:
      `${product.name} tươi sống từ Cà Mau. Giá: ${product.price.toLocaleString('vi-VN')}₫/kg${discountPercent ? ` (giảm ${discountPercent}%)` : ''}. ${product.description ?? 'Hải sản tươi chất lượng cao từ vùng biển Mũi Cà Mau.'}`.slice(0, 160),
    alternates: { canonical: `/san-pham/${slug}` },
    openGraph: {
      images: product.image_url ? [{ url: product.image_url, alt: product.name }] : [],
    },
  }
}

export default async function SanPhamDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await ProductService.getProductBySlug(slug)
  if (!product) notFound()

  // Lấy các biến thể size cùng nhóm
  const baseSlug = slug.replace(/-\d+$/, '') // "tom-su-size-20" → "tom-su-size"
  const variants = await ProductService.getProductVariants(baseSlug)
  const hasVariants = variants.length > 1

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'

  // JSON-LD Product Schema
  const jsonLd = hasVariants
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProductGroup',
        name: product.name,
        url: `${BASE_URL}/san-pham/${slug}`,
        description: product.description ?? `${product.name} tươi sống chất lượng cao từ Cà Mau`,
        image: product.image_url ? [product.image_url] : [],
        brand: { '@type': 'Brand', name: 'Hải Sản Cà Mau' },
        hasVariant: variants.map((v) => ({
          '@type': 'Product',
          name: v.name,
          sku: v.slug,
          url: `${BASE_URL}/san-pham/${v.slug}`,
          offers: {
            '@type': 'Offer',
            price: v.price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
            priceValidUntil: PRICE_VALID_UNTIL,
          },
        })),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        sku: product.slug,
        url: `${BASE_URL}/san-pham/${slug}`,
        description: product.description ?? `${product.name} tươi sống chất lượng cao từ Cà Mau`,
        image: product.image_url ? [product.image_url] : [],
        brand: { '@type': 'Brand', name: 'Hải Sản Cà Mau' },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
          priceValidUntil: PRICE_VALID_UNTIL,
          seller: {
            '@type': 'Organization',
            name: 'Hải Sản Cà Mau',
          },
        },
      }

  const breadcrumbItems = [
    { label: 'Sản Phẩm', href: '/san-pham' },
    ...(product.category
      ? [{ label: product.category, href: `/san-pham?danh-muc=${product.category}` }]
      : []),
    { label: product.name, href: `/san-pham/${slug}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-canvas min-h-screen">
        <div className="mx-auto max-w-7xl px-5 pt-[30px] pb-[72px]">
          <Breadcrumb items={breadcrumbItems.slice(0, -1)} />

          <div className="mt-[20px] grid grid-cols-1 gap-[20px] lg:grid-cols-2">
            {/* Product image */}
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-pure-white">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={`${product.name} — hải sản tươi Cà Mau`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-deepwater-teal/5">
                  <span className="text-[80px]" role="img" aria-label={product.name}>🦐</span>
                </div>
              )}
              {discountPercent && (
                <div className="absolute top-[18px] left-[18px] bg-deepwater-teal text-pure-white px-[14px] py-[6px] rounded-[5px]">
                  <span className="text-[11px] font-semibold tracking-[2.22px] uppercase">
                    Giảm {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="flex flex-col">
              <div className="bg-pure-white rounded-[32px] p-[20px] flex-1">
                {product.category && (
                  <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-3">
                    {product.category}
                  </p>
                )}
                <h1 className="text-heading font-medium tracking-[-0.51px] text-ink-black">
                  {product.name}
                </h1>

                {/* Pricing */}
                <div className="mt-[20px] flex items-baseline gap-3">
                  <span className="text-[32px] font-medium tracking-[-0.51px] text-ink-black">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-[22px] text-soft-gray line-through">
                      {product.original_price.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* Variants */}
                {hasVariants && (
                  <div className="mt-[18px]">
                    <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-3">
                      Kích Cỡ / Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <Link
                          key={variant.slug}
                          href={`/san-pham/${variant.slug}`}
                          className={`px-[14px] py-[9px] text-[14px] font-medium rounded-[5px] border transition-colors duration-150 ${
                            variant.slug === slug
                              ? 'bg-deepwater-teal text-pure-white border-deepwater-teal'
                              : 'bg-pure-white text-ink-black border-canvas hover:border-deepwater-teal'
                          }`}
                        >
                          {variant.name.replace(product.name, '').trim() || variant.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mt-[18px] pt-[18px] border-t border-canvas">
                    <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-2">
                      Mô Tả
                    </p>
                    <p className="text-[16px] leading-[1.44] text-soft-gray">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-[20px] space-y-3">
                  <Link
                    href="/thuong-lai"
                    className="flex w-full items-center justify-center px-[20px] py-[10px] bg-deepwater-teal text-pure-white text-[14px] font-medium rounded-[5px] hover:opacity-90 transition-opacity duration-150"
                  >
                    Liên Hệ Thương Lái
                  </Link>
                  <Link
                    href="/san-pham"
                    className="flex w-full items-center justify-center gap-2 px-[20px] py-[10px] border border-canvas text-ink-black text-[14px] font-medium rounded-[6.75px] hover:border-deepwater-teal hover:text-deepwater-teal transition-colors duration-150"
                  >
                    <ArrowLeftIcon size={14} aria-hidden="true" />
                    Xem Thêm Sản Phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
