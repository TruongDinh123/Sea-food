import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PhoneIcon, MapPinIcon, CalendarIcon } from '@/components/ui/Icons'
import { MerchantService } from '@/lib/services/merchant.service'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Merchant ID được encode trong slug: "ten-thuong-lai-123"
function extractIdFromSlug(slug: string): number {
  const parts = slug.split('-')
  const id = parseInt(parts[parts.length - 1], 10)
  return isNaN(id) ? 0 : id
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const id = extractIdFromSlug(slug)
  if (!id) return { title: 'Không Tìm Thấy | Hải Sản Cà Mau' }

  const merchant = await MerchantService.getMerchantDetails(id)
  if (!merchant) return { title: 'Không Tìm Thấy | Hải Sản Cà Mau' }

  return {
    title: `${merchant.name} — Thương Lái Hải Sản Cà Mau`,
    description: `Thông tin liên hệ và thu mua hải sản của ${merchant.name} tại Cà Mau. Điện thoại: ${merchant.phone}. ${merchant.address ?? 'Khu vực Cà Mau, Việt Nam'}.`,
    alternates: { canonical: `/thuong-lai/${slug}` },
  }
}

export default async function ThuongLaiDetailPage({ params }: PageProps) {
  const { slug } = await params
  const id = extractIdFromSlug(slug)
  if (!id) notFound()

  const merchant = await MerchantService.getMerchantDetails(id)
  if (!merchant) notFound()

  const createdDate = new Date(merchant.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // JSON-LD — LocalBusiness Profile Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/thuong-lai/${slug}`,
    name: merchant.name,
    telephone: merchant.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: merchant.address ?? 'Cà Mau',
      addressRegion: 'Cà Mau',
      addressCountry: 'VN',
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/thuong-lai/${slug}`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    priceRange: '₫₫',
    description: `Thương lái thu mua hải sản ${merchant.name} tại Cà Mau`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[45px]">
          <Breadcrumb
            items={[
              { label: 'Thương Lái', href: '/thuong-lai' },
              { label: merchant.name, href: `/thuong-lai/${slug}` },
            ]}
          />
          <div className="mt-5 flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-pure-white/50 mb-3">
                Thương Lái Hải Sản
              </p>
              <h1 className="text-heading-lg font-semibold tracking-[-0.77px]">
                {merchant.name}
              </h1>
            </div>
            <span
              className={`shrink-0 mt-2 inline-flex items-center px-[9px] py-[5px] text-[11px] font-semibold tracking-[2.22px] uppercase rounded-[5px] ${
                merchant.is_active
                  ? 'bg-pure-white/20 text-pure-white'
                  : 'bg-pure-white/10 text-pure-white/50'
              }`}
            >
              {merchant.is_active ? 'Đang Hoạt Động' : 'Tạm Nghỉ'}
            </span>
          </div>
        </div>
      </section>

      {/* Detail content */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-[45px]">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Contact card */}
            <div className="lg:col-span-1">
              <div className="bg-pure-white rounded-[32px] p-[20px]">
                <h2 className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-[18px]">
                  Thông Tin Liên Hệ
                </h2>
                <div className="space-y-[14px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-deepwater-teal/10">
                      <PhoneIcon size={16} className="text-deepwater-teal" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[2.22px] uppercase text-soft-gray">Điện Thoại</p>
                      <a
                        href={`tel:${merchant.phone}`}
                        className="text-[16px] font-medium text-ink-black hover:text-deepwater-teal transition-colors"
                      >
                        {merchant.phone}
                      </a>
                    </div>
                  </div>

                  {merchant.address && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-deepwater-teal/10">
                        <MapPinIcon size={16} className="text-deepwater-teal" aria-hidden={true} />
                      </div>
                      <div>
                        <p className="text-[11px] tracking-[2.22px] uppercase text-soft-gray">Địa Chỉ</p>
                        <p className="text-[16px] font-medium text-ink-black">{merchant.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-deepwater-teal/10">
                      <CalendarIcon size={16} className="text-deepwater-teal" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[2.22px] uppercase text-soft-gray">Thành Viên Từ</p>
                      <p className="text-[16px] font-medium text-ink-black">{createdDate}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={`tel:${merchant.phone}`}
                  className="mt-[20px] flex w-full items-center justify-center px-[20px] py-[10px] bg-deepwater-teal text-pure-white text-[14px] font-medium rounded-[5px] hover:opacity-90 transition-opacity duration-150"
                >
                  Liên Hệ Ngay
                </a>
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-2">
              <div className="bg-pure-white rounded-[32px] p-[20px] h-full">
                <h2 className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-[18px]">
                  Thông Tin Thu Mua
                </h2>
                <div className="space-y-[14px]">
                  <div className="flex items-center justify-between py-[14px] border-b border-canvas">
                    <span className="text-[14px] text-soft-gray">Loại hoa hồng</span>
                    <span className="text-[14px] font-medium text-ink-black capitalize">
                      {merchant.commission_type === 'percentage' && 'Theo phần trăm'}
                      {merchant.commission_type === 'fixed' && 'Cố định'}
                      {merchant.commission_type === 'monthly_flat' && 'Cố định hàng tháng'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-[14px] border-b border-canvas">
                    <span className="text-[14px] text-soft-gray">Giá trị hoa hồng</span>
                    <span className="text-[14px] font-medium text-ink-black">
                      {merchant.commission_type === 'percentage'
                        ? `${merchant.commission_value}%`
                        : `${merchant.commission_value.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                  {merchant.commission_type === 'monthly_flat' && (
                    <div className="flex items-center justify-between py-[14px] border-b border-canvas">
                      <span className="text-[14px] text-soft-gray">Phí hàng tháng</span>
                      <span className="text-[14px] font-medium text-ink-black">
                        {merchant.monthly_flat_rate.toLocaleString('vi-VN')}₫/tháng
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-[14px]">
                    <span className="text-[14px] text-soft-gray">Khu vực</span>
                    <span className="text-[14px] font-medium text-ink-black">
                      {merchant.address ? merchant.address.split(',').pop()?.trim() : 'Cà Mau'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
