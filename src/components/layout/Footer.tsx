import { Award, ShieldAlert, Sparkles, Truck, PhoneCall, Mail, Navigation, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="global-footer" className="bg-[#031e25] text-[#f8fafc]/90 border-t border-slate-800 font-sans antialiased mt-auto">
      {/* Brand Attributes Row (E-E-A-T reinforcement) */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex gap-4 items-start">
            <div className="bg-[#04333f] p-3 text-[#d97706] shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thương Lái Tuyển Chọn</h4>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Chúng tôi không qua đầu nậu vô danh. Toàn bộ hải sản được thu hoạch trực tiếp tại đầm Năm Căn, Sông Đốc từ các thương lái lâu năm trong nghề.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-[#04333f] p-3 text-[#d97706] shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Vận Chuyển Oxy Tươi Sống</h4>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Áp dụng quy trình gây tê ngủ đông sinh học tiêu chuẩn và sục oxy khoang đông chuyên nghiệp, đảm bảo hải sản bò bơi tận rổ bếp.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-[#04333f] p-3 text-[#d97706] shrink-0 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bảo Hành 1 Đổi 1</h4>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Bao ăn gạch gối son đỏ au dẻo ngậy, bao sớ thịt dầy dặn đầy ắp trên 90%. Nếu cua nứt ốp bở rỗng, hệ thống cam kết hoàn tiền hoặc đền bù lập tức.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-[#04333f] p-3 text-[#d97706] shrink-0 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chất Lượng Xuất Khẩu</h4>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Sản phẩm đạt chứng nhận an toàn thực phẩm, chuẩn hữu cơ rừng đước ngập mặn VietGAP, sẵn sàng cập cảng sỉ xuất khẩu sang Đông Á, EU.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-850 border border-slate-700 flex items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 border border-[#d97706] rotate-45"></div>
              </div>
              <span className="text-sm font-black tracking-wider text-white uppercase">Deepwater Elite</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Hệ thống kết nối trực tiếp Người Tiêu Dùng và Vựa hải sản ngập mặn chính hãng Cà Mau. Trực tiếp thu mua tại cầu cảng từ các thương lái uy tín đã được định danh minh bạch thực thể và thẩm định chuyên gia (E-E-A-T).
            </p>
            <div className="pt-2 text-xs text-gray-400 font-mono space-y-1.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Liên Hệ Đường Dây Nóng Sỉ & Lẻ: 0912.345.567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Thư hỗ trợ nhà hàng: partners@haisancaocap.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Bến Cập Tàu Đất Mũi: Thị Trấn Năm Căn, Cà Mau</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#d97706] pl-2.5">Danh mục hải sản</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium list-none p-0 m-0">
              <li>
                <Link href="/san-pham?category=cua-bien" className="hover:text-[#d97706] transition decoration-transparent">
                  Cua Biển Cà Mau đầm ngập mặn
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=tom-su" className="hover:text-[#d97706] transition decoration-transparent">
                  Tôm Sú sinh thái rừng đước
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=do-kho" className="hover:text-[#d97706] transition decoration-transparent">
                  Tôm Khô Vinh Kim & Mực Câu
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-[#d97706] transition text-[#d97706] decoration-transparent">
                  Tất cả hải sản tuyển lẻ sỉ &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#d97706] pl-2.5">Thương lái uy tín</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium list-none p-0 m-0">
              <li>
                <Link href="/thuong-lai" className="hover:text-[#d97706] transition decoration-transparent">
                  Hợp Tác Xã Đất Mũi (Năm Căn)
                </Link>
              </li>
              <li>
                <Link href="/thuong-lai" className="hover:text-[#d97706] transition decoration-transparent">
                  HTX Sông Đốc Cà Mau
                </Link>
              </li>
              <li>
                <Link href="/thuong-lai" className="hover:text-[#d97706] transition decoration-transparent">
                  Vựa Tôm Cà Mau Cao Cấp
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#d97706] pl-2.5">Góc thông tin</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium list-none p-0 m-0">
              <li>
                <Link href="/blog" className="hover:text-[#d97706] transition decoration-transparent">
                  Mẹo chọn mua Cua ngon sống xịn
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#d97706] transition decoration-transparent">
                  Bảng giá thủy sản trực tuyến
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#d97706] transition decoration-transparent">
                  Kỹ nghệ vận chuyển ngủ đông
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Under copyright bar */}
      <div id="copyright-footer-bar" className="bg-[#021317] py-6 px-4 border-t border-[#04333f]/50">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 font-medium gap-3">
          <span className="font-mono">
            &copy; 2026 Hải Sản Cao Cấp Cà Mau. Bản quyền đã được thiết lập bảo vệ nội dung SEO.
          </span>
          <div className="flex items-center gap-1.5 font-sans">
            <span>Sản phẩm của niềm tự hào Thủy hải sản Nam Bộ</span>
            <Heart className="w-3 h-3 text-[#d97706] fill-[#d97706]" />
            <span>Kết nối thương lái Việt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
