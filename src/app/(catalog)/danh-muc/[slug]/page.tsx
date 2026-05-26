import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TagIcon } from '@/components/ui/Icons'
import { ProductService } from '@/lib/services/product.service'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

const CATEGORY_MAP: Record<string, { label: string; desc: string }> = {
  'tom-su': {
    label: 'Tôm Sú Cà Mau',
    desc: 'Tôm sú sinh thái nuôi tự nhiên, thịt chắc ngọt, đậm đà vị biển Cà Mau.',
  },
  'cua-bien': {
    label: 'Cua Biển Cà Mau',
    desc: 'Thương hiệu cua biển nổi tiếng với thịt ngọt, gạch béo ngậy vạn người mê.',
  },
  'hai-san-kho': {
    label: 'Đặc Sản Khô Cà Mau',
    desc: 'Tôm khô đất, mực khô câu, cá khô chế biến thủ công giữ trọn vị quê nhà.',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const catInfo = CATEGORY_MAP[slug]

  if (!catInfo) {
    return { title: 'Không Tìm Thấy Danh Mục | Hải Sản Cà Mau' }
  }

  return {
    title: `${catInfo.label} — Tươi Sống Tiêu Chuẩn Xuất Khẩu`,
    description: `${catInfo.desc} Giá gốc thu mua tại vựa thương lái uy tín nhất vùng Mũi Cà Mau.`,
    alternates: { canonical: `/danh-muc/${slug}` },
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const catInfo = CATEGORY_MAP[slug]

  if (!catInfo) {
    notFound()
  }

  const sParams = await searchParams
  const page = Math.max(1, parseInt(sParams['page'] ?? '1', 10))

  const { data: products, pagination } = await ProductService.getPublicProducts({
    page,
    limit: 12,
    category: slug,
  })

  // Self-referencing canonical URL
  const selfCanonical = page === 1
    ? `/danh-muc/${slug}`
    : `/danh-muc/${slug}?page=${page}`

  // JSON-LD Schema — CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}${selfCanonical}`,
    name: catInfo.label,
    description: catInfo.desc,
    url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}${selfCanonical}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination.total,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * 12 + index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/san-pham/${product.slug}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[36px]">
          <Breadcrumb
            light={true}
            items={[
              { label: 'Sản Phẩm', href: '/san-pham' },
              { label: catInfo.label, href: `/danh-muc/${slug}` },
            ]}
          />
          <h1 className="mt-4 text-heading font-medium tracking-[-0.51px]">
            {catInfo.label}
          </h1>
          <p className="mt-3 text-[18px] leading-[1.33] tracking-[-0.32px] text-pure-white/70 max-w-xl">
            {catInfo.desc}
          </p>
        </div>
      </section>

      {/* Product list */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-[45px]">
          {products.length === 0 ? (
            <p className="text-center text-soft-gray py-[72px]">
              Chưa có sản phẩm nào thuộc danh mục này. Vui lòng quay lại sau.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/san-pham/${product.slug}`}
                  className="group block bg-pure-white rounded-[32px] overflow-hidden hover:shadow-md transition-all duration-150"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-canvas overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={`${product.name} — Hải sản tươi Cà Mau`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-deepwater-teal/10">
                        <span className="text-[48px]">🦀</span>
                      </div>
                    )}
                    {/* Badge */}
                    {product.original_price && product.original_price > product.price && (
                      <div className="absolute top-[9px] right-[9px] flex items-center gap-1 bg-deepwater-teal text-pure-white px-[9px] py-[5px] rounded-[5px]">
                        <TagIcon size={10} aria-hidden={true} />
                        <span className="text-[11px] font-semibold tracking-[1px]">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-[20px]">
                    <h2 className="text-[16px] font-medium tracking-[-0.2px] text-ink-black group-hover:text-deepwater-teal transition-colors duration-150 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-[11px] text-soft-gray">
                      {product.merchant_name}
                    </p>

                    <div className="mt-[10px] flex items-baseline gap-2">
                      <span className="text-[22px] font-medium tracking-[-0.35px] text-ink-black">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-[14px] text-soft-gray line-through">
                          {product.original_price.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav
              className="mt-[45px] flex items-center justify-center gap-2"
              aria-label={`Phân trang danh mục ${catInfo.label}`}
            >
              {page > 1 && (
                <Link
                  href={page - 1 === 1 ? `/danh-muc/${slug}` : `/danh-muc/${slug}?page=${page - 1}`}
                  className="px-[14px] py-[9px] text-[14px] font-medium border border-canvas rounded-[5px] text-ink-black bg-pure-white hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
                >
                  Trang trước
                </Link>
              )}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? `/danh-muc/${slug}` : `/danh-muc/${slug}?page=${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`px-[14px] py-[9px] text-[14px] font-medium rounded-[5px] transition-colors duration-150 ${p === page
                      ? 'bg-deepwater-teal text-pure-white border border-deepwater-teal'
                      : 'border border-canvas bg-pure-white text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal'
                    }`}
                >
                  {p}
                </Link>
              ))}
              {page < pagination.totalPages && (
                <Link
                  href={`/danh-muc/${slug}?page=${page + 1}`}
                  className="px-[14px] py-[9px] text-[14px] font-medium border border-canvas rounded-[5px] bg-pure-white text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
                >
                  Trang sau
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
