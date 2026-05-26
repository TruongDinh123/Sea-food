import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { TagIcon } from '@/components/ui/Icons'
import { ProductService } from '@/lib/services/product.service'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sản Phẩm Hải Sản Cà Mau — Tôm Sú, Cua Biển Tươi Sống',
    description:
      'Danh sách đầy đủ hải sản tươi sống và đặc sản khô từ Cà Mau: Tôm Sú, Cua Biển, Ghẹ, Mực. Giá cập nhật hàng ngày từ các thương lái uy tín.',
    alternates: { canonical: '/san-pham' },
  }
}

export default async function SanPhamPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params['page'] ?? '1', 10))
  const category = params['danh-muc']

  const { data: products, pagination } = await ProductService.getPublicProducts({
    page,
    limit: 12,
    category,
  })

  // Canonical tự trỏ về chính trang hiện tại (không về trang 1)
  const selfCanonical = page === 1
    ? '/san-pham'
    : `/san-pham?page=${page}`

  // JSON-LD — ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sản Phẩm Hải Sản Cà Mau',
    url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}${selfCanonical}`,
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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 py-45">
          <Breadcrumb items={[{ label: 'Sản Phẩm', href: '/san-pham' }]} />
          <h1 className="mt-4 text-heading font-medium tracking-heading">
            Hải Sản Tươi Sống Cà Mau
          </h1>
          <p className="mt-3 text-subheading leading-subheading tracking-subheading text-pure-white/70 max-w-xl">
            Tôm sú, cua biển, ghẹ và đặc sản khô — cập nhật hàng ngày từ vùng biển Mũi Cà Mau.
          </p>

          {/* Category filter */}
          <div className="mt-20 flex flex-wrap gap-2">
            {[
              { label: 'Tất Cả', value: undefined, href: '/san-pham' },
              { label: 'Tôm Sú', value: 'tom-su', href: '/san-pham?danh-muc=tom-su' },
              { label: 'Cua Biển', value: 'cua-bien', href: '/san-pham?danh-muc=cua-bien' },
              { label: 'Hải Sản Khô', value: 'hai-san-kho', href: '/san-pham?danh-muc=hai-san-kho' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`px-14 py-6 text-caption font-semibold tracking-caption uppercase rounded-buttons transition-colors duration-150 ${category === cat.value
                    ? 'bg-pure-white text-ink-black'
                    : 'border border-pure-white/30 text-pure-white hover:border-pure-white hover:bg-pure-white/10'
                  }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-45">
          {products.length === 0 ? (
            <p className="text-center text-soft-gray py-72">
              Chưa có sản phẩm nào. Vui lòng quay lại sau.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/san-pham/${product.slug}`}
                  className="group block bg-pure-white rounded-cards overflow-hidden hover:shadow-md transition-all duration-150"
                >
                  {/* Product image */}
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
                        <span className="text-heading-lg">🦀</span>
                      </div>
                    )}
                    {/* Discount badge */}
                    {product.original_price && product.original_price > product.price && (
                      <div className="absolute top-9 right-9 flex items-center gap-1 bg-deepwater-teal text-pure-white px-9 py-5 rounded-buttons">
                        <TagIcon size={10} aria-hidden={true} />
                        <span className="text-caption font-semibold tracking-[1px]">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-20">
                    {product.category && (
                      <p className="text-caption font-semibold tracking-caption uppercase text-soft-gray mb-1">
                        {product.category}
                      </p>
                    )}
                    <h2 className="text-body font-medium tracking-body text-ink-black group-hover:text-deepwater-teal transition-colors duration-150 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-caption text-soft-gray">
                      {product.merchant_name}
                    </p>

                    <div className="mt-10 flex items-baseline gap-2">
                      <span className="text-heading-sm font-medium tracking-heading-sm text-ink-black">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-body text-soft-gray line-through">
                          {product.original_price.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination — self-referencing canonical */}
          {pagination.totalPages > 1 && (
            <nav
              className="mt-45 flex items-center justify-center gap-2"
              aria-label="Phân trang sản phẩm"
            >
              {page > 1 && (
                <Link
                  href={page - 1 === 1 ? '/san-pham' : `/san-pham?page=${page - 1}`}
                  className="px-14 py-9 text-body font-medium border border-canvas rounded-buttons text-ink-black bg-pure-white hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
                >
                  Trang trước
                </Link>
              )}
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? '/san-pham' : `/san-pham?page=${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`px-14 py-9 text-body font-medium rounded-buttons transition-colors duration-150 ${p === page
                      ? 'bg-deepwater-teal text-pure-white border border-deepwater-teal'
                      : 'border border-canvas bg-pure-white text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal'
                    }`}
                >
                  {p}
                </Link>
              ))}
              {page < pagination.totalPages && (
                <Link
                  href={`/san-pham?page=${page + 1}`}
                  className="px-14 py-9 text-body font-medium border border-canvas rounded-buttons bg-pure-white text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
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
