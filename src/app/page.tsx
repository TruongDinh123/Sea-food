import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hải Sản Tươi Sống Cà Mau — Tôm Sú, Cua Biển Chính Hãng',
  description:
    'Hải Sản Cà Mau cung cấp tôm sú, cua biển, ghẹ, mực tươi sống và đặc sản khô từ vùng biển Cà Mau. Kết nối trực tiếp với thương lái uy tín, giá tốt nhất.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      {/* Hero — Deepwater Teal background */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 py-100">
          <p className="text-caption font-semibold tracking-caption uppercase text-pure-white/50 mb-6">
            Hải Sản Cà Mau
          </p>
          <h1 className="text-heading-lg font-semibold tracking-heading-lg max-w-2xl">
            Tươi Từ Biển Cà Mau
          </h1>
          <p className="mt-5 text-subheading leading-subheading tracking-subheading text-pure-white/70 max-w-lg">
            Tôm Sú, Cua Biển, Ghẹ và Đặc Sản Khô — kết nối trực tiếp với thương lái uy tín từ vùng biển Mũi Cà Mau.
          </p>
          <div className="mt-36 flex flex-wrap gap-4">
            <Link
              href="/san-pham"
              className="inline-flex items-center px-20 py-10 bg-pure-white text-ink-black text-body font-medium rounded-buttons transition-opacity duration-150 hover:opacity-90"
            >
              Xem Sản Phẩm
            </Link>
            <Link
              href="/thuong-lai"
              className="inline-flex items-center px-20 py-10 border border-canvas text-pure-white text-body font-medium rounded-ghost-buttons transition-colors duration-150 hover:bg-pure-white/10"
            >
              Tìm Thương Lái
            </Link>
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-72">
          <h2 className="text-heading font-medium tracking-heading text-ink-black mb-36">
            Danh Mục Sản Phẩm
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/danh-muc/tom-su', name: 'Tôm Sú', desc: 'Tôm sú tươi sống, nhiều size từ 10–30 con/kg' },
              { href: '/danh-muc/cua-bien', name: 'Cua Biển', desc: 'Cua biển Cà Mau loại 1, thịt chắc ngọt' },
              { href: '/danh-muc/hai-san-kho', name: 'Hải Sản Khô', desc: 'Tôm khô, mực khô, cá khô đặc sản Cà Mau' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block bg-deepwater-teal text-pure-white rounded-cards p-20 hover:opacity-90 transition-opacity duration-150"
              >
                <h3 className="text-heading-sm font-medium tracking-heading-sm mb-10">
                  {item.name}
                </h3>
                <p className="text-body leading-body text-pure-white/60">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
