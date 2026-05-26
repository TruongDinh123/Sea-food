import type { Metadata } from 'next'
import Link from 'next/link'
import { PhoneIcon, MapPinIcon } from '@/components/ui/Icons'
import { MerchantService } from '@/lib/services/merchant.service'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Danh Sách Thương Lái Hải Sản Cà Mau Uy Tín',
    description:
      'Tìm kiếm thương lái hải sản uy tín tại Cà Mau. Danh sách các vựa thu mua tôm sú, cua biển, mực tươi với giá tốt nhất vùng Mũi Cà Mau.',
    alternates: { canonical: '/thuong-lai' },
  }
}

export default async function ThuongLaiPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const { data: merchants, pagination } = await MerchantService.getPublicMerchants(page, 12)

  // JSON-LD — LocalBusiness list
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh Sách Thương Lái Hải Sản Cà Mau',
    description: 'Danh sách các thương lái thu mua hải sản uy tín tại Cà Mau',
    numberOfItems: pagination.total,
    itemListElement: merchants.map((merchant, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * 12 + index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: merchant.name,
        telephone: merchant.phone,
        address: merchant.address ?? 'Cà Mau, Việt Nam',
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/thuong-lai/${merchant.id}`,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero header */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[36px]">
          <Breadcrumb items={[{ label: 'Thương Lái', href: '/thuong-lai' }]} />
          <h1 className="mt-4 text-heading font-medium tracking-[-0.51px]">
            Thương Lái Hải Sản Cà Mau
          </h1>
          <p className="mt-3 text-[18px] leading-[1.33] tracking-[-0.32px] text-pure-white/70 max-w-xl">
            Kết nối trực tiếp với các vựa thu mua hải sản uy tín tại Mũi Cà Mau.
          </p>
        </div>
      </section>

      {/* Merchant grid */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-[45px]">
          {merchants.length === 0 ? (
            <p className="text-center text-soft-gray py-[72px]">
              Chưa có thương lái nào. Vui lòng quay lại sau.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {merchants.map((merchant) => (
                <Link
                  key={merchant.id}
                  href={`/thuong-lai/${merchant.id}`}
                  className="group block bg-pure-white rounded-[32px] p-[20px] border border-canvas hover:shadow-md transition-all duration-150"
                  style={{ boxShadow: 'none' }}
                >
                  <div className="mb-[14px]">
                    <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-2">
                      Thương Lái
                    </p>
                    <h2 className="text-[22px] font-medium tracking-[-0.35px] text-ink-black group-hover:text-deepwater-teal transition-colors duration-150">
                      {merchant.name}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[14px] text-soft-gray">
                      <PhoneIcon size={14} aria-hidden={true} />
                      <span>{merchant.phone}</span>
                    </div>
                    {merchant.address && (
                      <div className="flex items-start gap-2 text-[14px] text-soft-gray">
                        <MapPinIcon size={14} className="mt-0.5 shrink-0" aria-hidden={true} />
                        <span className="line-clamp-2">{merchant.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-[18px] flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-[9px] py-[5px] text-[11px] font-semibold tracking-[2.22px] uppercase rounded-[5px] ${
                        merchant.is_active
                          ? 'bg-deepwater-teal/10 text-deepwater-teal'
                          : 'bg-canvas text-soft-gray'
                      }`}
                    >
                      {merchant.is_active ? 'Đang Hoạt Động' : 'Tạm Nghỉ'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination — self-referencing canonical theo từng trang */}
          {pagination.totalPages > 1 && (
            <nav
              className="mt-[45px] flex items-center justify-center gap-2"
              aria-label="Phân trang danh sách thương lái"
            >
              {page > 1 && (
                <Link
                  href={`/thuong-lai?page=${page - 1}`}
                  className="px-[14px] py-[9px] text-[14px] font-medium border border-canvas rounded-[5px] text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
                >
                  Trang trước
                </Link>
              )}

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? '/thuong-lai' : `/thuong-lai?page=${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`px-[14px] py-[9px] text-[14px] font-medium rounded-[5px] transition-colors duration-150 ${
                    p === page
                      ? 'bg-deepwater-teal text-pure-white border border-deepwater-teal'
                      : 'border border-canvas text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal'
                  }`}
                >
                  {p}
                </Link>
              ))}

              {page < pagination.totalPages && (
                <Link
                  href={`/thuong-lai?page=${page + 1}`}
                  className="px-[14px] py-[9px] text-[14px] font-medium border border-canvas rounded-[5px] text-ink-black hover:bg-deepwater-teal hover:text-pure-white hover:border-deepwater-teal transition-colors duration-150"
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
