import Link from 'next/link'
import { MenuIcon } from '@/components/ui/Icons'

// Navigation links theo cấu trúc kim tự tháp SEO của dự án
const navLinks = [
  { href: '/san-pham', label: 'Sản Phẩm' },
  { href: '/danh-muc/tom-su', label: 'Tôm Sú' },
  { href: '/danh-muc/cua-bien', label: 'Cua Biển' },
  { href: '/thuong-lai', label: 'Thương Lái' },
  { href: '/blog', label: 'Blog' },
]

/**
 * Header — Navigation bar theo Arc Design System
 * Desktop: sticky top bar với Deepwater Teal background
 * Mobile: hamburger sẽ được xử lý ở MobileMenu (client component)
 * Server Component — không cần 'use client'
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-canvas bg-deepwater-teal">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          className="text-pure-white font-semibold tracking-[0.15em] text-sm uppercase"
          aria-label="Hải Sản Cà Mau — Trang chủ"
        >
          Hải Sản Cà Mau
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Navigation chính"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-pure-white/80 hover:text-pure-white text-body font-medium tracking-[0.25px] transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button — client component wrapper sẽ xử lý toggle */}
        <button
          type="button"
          className="flex items-center justify-center text-pure-white md:hidden"
          aria-label="Mở menu điều hướng"
          aria-expanded="false"
        >
          <MenuIcon size={24} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
