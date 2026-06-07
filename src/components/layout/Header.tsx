'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Search, MapPin, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Sản Phẩm', path: '/san-pham' },
    { name: 'Thương Lái', path: '/thuong-lai' },
    { name: 'Cẩm Nang', path: '/blog' },
    { name: 'Về Chúng Tôi', path: '/ve-chung-toi' },
  ];

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Banner Bar for Trust / EEAT */}
      <div id="top-announcement" className="bg-[#031e25] text-[#d97706] text-xs py-2 px-4 flex justify-between items-center border-b border-[#04333f] font-sans antialiased">
        <div className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 animate-pulse" />
          <span>Vựa Liên Kết Trực Tiếp & Bảo Hành Chất Lượng 1 Đổi 1</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#e2e8f0]/80">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#d97706]" /> Năm Căn, Cà Mau | Phú Quốc
          </span>
          <span className="text-[#e2e8f0]/40">|</span>
          <span className="hover:text-white transition duration-200">Giao Tươi Bơm Oxy 24H</span>
        </div>
      </div>

      {/* Main Header Container */}
      <header
        id="main-nav-header"
        className={`sticky top-0 z-50 transition-all duration-300 w-full bg-white border-b border-[#e5e7eb] ${
          scrolled ? 'py-2 shadow-sm' : 'py-3'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo area */}
            <Link 
              href="/"
              className="flex items-center gap-2.5 cursor-pointer group decoration-transparent"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-[#031e25] flex items-center justify-center shrink-0">
                <div className="w-5 h-5 border border-[#d97706] rotate-45 transition-transform group-hover:rotate-90 duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-[#0a0a0a] uppercase font-sans">
                  Deepwater Elite
                </span>
                <span className="text-[9px] font-black text-[#d97706] tracking-[0.18em] leading-none font-sans uppercase">
                  HẢI SẢN CAO CẤP
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav id="desktop-nav-menu" className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 pb-1 cursor-pointer font-sans decoration-transparent ${
                    isActive(item.path)
                      ? 'text-[#d97706]'
                      : 'text-[#0a0a0a]/80 hover:text-[#d97706]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Header Controls */}
            <div id="header-action-panel" className="flex items-center gap-6">
              {/* Quick Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-gray-500 hover:text-[#031e25] hover:bg-[#f9fafb] transition cursor-pointer"
                title="Tìm kiếm hải sản"
              >
                <Search className="w-4 h-4" />
              </button>

              <div className="hidden lg:block text-right">
                <p className="text-[10px] uppercase text-[#0a0a0a]/50 tracking-widest font-black">Hỗ trợ 24/7</p>
                <p className="text-xs font-extrabold text-[#0a0a0a] tracking-tight">0912 345 567</p>
              </div>

              {/* Account Link or CTA */}
              <Link 
                href="/auth/login"
                className="hidden md:block bg-[#0a0a0a] text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1a1a1a] transition cursor-pointer decoration-transparent"
              >
                Đăng Nhập
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-nav-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 md:hidden text-gray-700 hover:text-[#031e25] transition cursor-pointer"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Quick Search Bar Overlay */}
        {searchOpen && (
          <div id="search-overlay-bar" className="border-t border-gray-100 bg-white shadow-inner py-3 px-4">
            <div className="max-w-3xl mx-auto flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Gõ cua gạch, tôm sú, tôm khô..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#031e25]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-[#031e25] text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer hover:bg-opacity-95"
              >
                Tìm
              </button>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div id="mobile-nav-drawer" className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-lg z-50">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition decoration-transparent ${
                    isActive(item.path)
                      ? 'bg-[#031e25]/5 text-[#031e25] font-extrabold border-l-4 border-[#d97706]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 px-4">
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
                  Tổng đài: 0912.345.567 (Chú Năm)
                </span>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-[#031e25] rounded-xl shadow border border-[#04333f] decoration-transparent"
                >
                  Đăng Nhập Hệ Thống
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
