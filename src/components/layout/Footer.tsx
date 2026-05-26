import Link from 'next/link'

const footerLinks = {
  'Sản Phẩm': [
    { href: '/danh-muc/tom-su', label: 'Tôm Sú' },
    { href: '/danh-muc/cua-bien', label: 'Cua Biển' },
    { href: '/danh-muc/hai-san-kho', label: 'Hải Sản Khô' },
    { href: '/san-pham', label: 'Tất Cả Sản Phẩm' },
  ],
  'Thương Lái': [
    { href: '/thuong-lai', label: 'Danh Sách Thương Lái' },
    { href: '/ve-chung-toi', label: 'Về Chúng Tôi' },
  ],
  'Thông Tin': [
    { href: '/blog', label: 'Blog Hải Sản' },
    { href: '/chinh-sach-bao-mat', label: 'Chính Sách Bảo Mật' },
  ],
}

/**
 * Footer — Arc Design System
 * Deepwater Teal background, Pure White text
 * Server Component — không cần 'use client'
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deepwater-teal text-pure-white mt-auto">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-5 py-[72px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-pure-white font-semibold tracking-[0.15em] text-sm uppercase"
              aria-label="Hải Sản Cà Mau — Trang chủ"
            >
              Hải Sản Cà Mau
            </Link>
            <p className="mt-4 text-[14px] leading-[1.44] text-pure-white/60">
              Nguồn hải sản tươi sống và đặc sản khô từ vùng biển Cà Mau — Mũi Cà Mau, Việt Nam.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold tracking-[2.22px] uppercase text-pure-white/50 mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-pure-white/70 hover:text-pure-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pure-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <p className="text-[11px] tracking-[2.22px] text-pure-white/40 uppercase">
            © {currentYear} Hải Sản Cà Mau. All rights reserved.
          </p>
          <p className="text-[11px] text-pure-white/30 hidden md:block">
            Cà Mau, Việt Nam
          </p>
        </div>
      </div>
    </footer>
  )
}
