import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { productService, merchantService, blogService } from "@/lib/services";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import { ShieldCheck, Truck, RotateCcw, ArrowRight, Star, CheckCircle } from "lucide-react";

// Buộc Next.js render mới từ DB mỗi request — tránh cache cũ che bài viết mới
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Hải Sản Cao Cấp Cà Mau | Mua Trực Tiếp Từ Vựa Thương Lái",
  description: "Hệ thống kết nối trực tiếp người tiêu dùng và vựa hải sản ngập mặn Cà Mau uy tín. Tôm sú quảng canh, cua gạch son Năm Căn, đồ khô hảo hạng giao nhanh tận nhà.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hải Sản Cao Cấp Cà Mau | Mua Trực Tiếp Từ Vựa Thương Lái",
    description: "Hệ thống kết nối trực tiếp người tiêu dùng và vựa hải sản ngập mặn Cà Mau uy tín. Tôm sú quảng canh, cua gạch son Năm Căn, đồ khô hảo hạng giao nhanh tận nhà.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/products/cua-ca-mau.jpg",
        width: 1200,
        height: 630,
        alt: "Cua biển Cà Mau tươi sống chắc thịt",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hải Sản Cao Cấp Cà Mau | Mua Trực Tiếp Từ Vựa Thương Lái",
    description: "Hệ thống kết nối trực tiếp người tiêu dùng và vựa hải sản ngập mặn Cà Mau uy tín. Tôm sú quảng canh, cua gạch son Năm Căn, đồ khô hảo hạng giao nhanh tận nhà.",
    images: ["/images/products/cua-ca-mau.jpg"],
  }
};

const CATEGORIES = [
  {
    id: "cat_cua",
    slug: "cua-bien",
    name: "Cua Biển Cà Mau",
    description: "Cua biển Cà Mau tự nhiên thơm ngon, chắc thịt, béo ngậy danh tiếng đệ nhất Nam Bộ.",
    image: "/images/products/cua-ca-mau.jpg",
  },
  {
    id: "cat_tom",
    slug: "tom-su",
    name: "Tôm Sú Quảng Canh",
    description: "Tôm sú biển khổng lồ và tôm sú sinh thái nuôi rừng đước ngọt đậm đà, giòn sần sật.",
    image: "https://images.unsplash.com/photo-1559742811-82410b01081a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat_kho",
    slug: "do-kho",
    name: "Đồ Khô Cao Cấp",
    description: "Tôm khô Vinh Kim, khô mực câu Phú Quốc xẻ phơi thủ công truyền thống tuyệt đối an toàn.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
  }
];

export default async function HomePage() {
  const products = await productService.getAllProducts();
  const merchants = await merchantService.getAllActiveMerchants();
  const blogs = await blogService.getAllBlogs(true);

  // Lấy tối đa 3 sản phẩm nổi bật và làm giàu dữ liệu
  const featuredProducts = products.slice(0, 3).map(enrichProduct);
  // Lấy tối đa 3 thương lái và làm giàu dữ liệu
  const enrichedMerchants = merchants.slice(0, 3).map(enrichMerchant);
  // Lấy tối đa 3 bài viết mới nhất
  const latestBlogs = blogs.slice(0, 3);

  return (
    <div id="home-view-container" className="font-sans text-[#0a0a0a] antialiased space-y-0">
      {/* 1. HERO SECTION - Big Banner in Deepwater Teal background */}
      <section 
        id="home-hero-banner" 
        className="relative bg-[#031e25] text-white py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-2xl"
      >
        {/* Subtle background overlay design */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.08),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[linear-gradient(to_bottom,rgba(4,51,63,0.3),transparent)]" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block border-l-2 border-[#d97706] pl-4 mb-4">
              <p className="text-[#d97706] text-xs font-bold uppercase tracking-[0.3em] m-0">Tinh Hoa Hải Sản Cà Mau • Phú Quốc</p>
            </div>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6">
              Hải Sản Cao Cấp <br/>
              <span className="font-extrabold text-[#f9fafb] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#d97706]">Trực Tiếp Thương Lái</span>
            </h1>
            <p className="text-gray-300 text-sm opacity-85 leading-relaxed mb-8 max-w-[500px]">
              Hệ thống cung cấp hải sản tươi sống chất lượng xuất khẩu vớt trực tiếp từ thương lái Năm Căn, Sông Đốc và Phú Quốc. Cam kết độ lấp gạch đầy và không dây trói lớn. Giao tươi sống tận nhà!
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/san-pham"
                className="bg-[#d97706] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition duration-300 cursor-pointer shadow-sm active:scale-95 flex items-center gap-2 group decoration-transparent"
              >
                Đặt Hàng Ngay
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/thuong-lai"
                className="border border-white/20 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition duration-300 cursor-pointer bg-white/5 decoration-transparent"
              >
                Tìm Thương Lái
              </Link>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-800 font-mono text-xs text-gray-400">
              <div>
                <span className="block text-2xl font-black text-white">25+</span>
                <span>Năm Thâm Niên Đầm Đước</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">100%</span>
                <span>An Toàn Thủy Sản</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">OCOP 4★</span>
                <span>Làng Nghề Truyền Thống</span>
              </div>
            </div>
          </div>

          {/* Hero Premium Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#04333f] relative group">
              <Image
                src="/images/products/cua-ca-mau.jpg"
                alt="Cua biển Cà Mau tươi sống chắc thịt"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021317]/90 via-[#021317]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-amber-500">Giới thiệu vinh dự</span>
                <h3 className="text-lg font-black text-white uppercase mt-1">Cua gạch son Năm Căn đỏ au bùi ngậy</h3>
                <p className="text-gray-300 text-xs mt-1.5 line-clamp-2">Thu hoạch hoàn toàn dã ngoại từ các đầm sinh thái đước rậm của vựa thương lái Chú Năm.</p>
              </div>
            </div>
            
            {/* Trust badge banner overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white text-[#031e25] p-4 rounded-xl shadow-lg border border-gray-100 hidden sm:flex items-center gap-3 max-w-xs">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider m-0">Đảm bảo EEAT Đối Tác</h4>
                <p className="text-[10px] text-gray-500 mt-0.5 font-medium m-0">Đối tác thương lái đã qua kiểm định thực thể, có giấy phép ATVSTP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUALITY COMMITMENT CARDS - E-E-A-T Showcase */}
      <section id="trust-guarantee-benefits" className="py-16 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 pb-12">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#d97706] font-mono m-0">Bản lĩnh thượng hạng</h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a0a0a] uppercase leading-tight font-sans m-0">
              Cam Kết &quot;Canh Cánh&quot; Với Thực Khách
            </p>
            <p className="text-sm text-gray-500 leading-relaxed m-0">
              Chúng tôi xem chất lượng thủy sản là danh dự và sự tin yêu lâu bền của mỗi gia đình sành ăn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-md transition duration-300 space-y-4">
              <div className="h-12 w-12 bg-amber-50 text-[#d97706] flex items-center justify-center rounded-xl font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] m-0">Đổi trả 1 đổi 1 tận gốc</h3>
              <p className="text-xs text-gray-500 leading-relaxed m-0">
                Một chiếc cua bị ốp, một con tôm bị bở hư dưới 85% thịt son sẽ được thương lái Năm Căn đền bù ngay mẻ mới, đảm bảo rủi ro mua hải sản tươi tận số lượng bằng 0%.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-md transition duration-300 space-y-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] m-0">Ngủ đông tôm sú tươi sục</h3>
              <p className="text-xs text-gray-500 leading-relaxed m-0">
                Áp dụng quy trình hạ nhiệt gây tê sinh học chuyển dời tôm đi sâu giấc ngủ, tôm giữ nguyên độ canxi hoang dại và bật nhảy tách tách sảng khoái khi gặp nước mát.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-md transition duration-300 space-y-4">
              <div className="h-12 w-12 bg-sky-50 text-sky-600 flex items-center justify-center rounded-xl font-bold">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] m-0">Giá vựa trực tiếp tại đầm</h3>
              <p className="text-xs text-gray-500 leading-relaxed m-0">
                Cung cấp bảng giá gốc thu mua cầu cảng hàng ngày của thương lái. Nhà sản xuất hải sản và khách sỉ được tiếp cận trực tiếp không dối gạt chi phí phụ gia thừa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEAFOOD CATEGORIES SECTION - Grid display */}
      <section id="seafood-categories-grid" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4 border-b border-[#e5e7eb] mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] m-0">01. Danh Mục Chủ Đạo</h2>
              <p className="text-xl sm:text-2xl font-black uppercase text-[#0a0a0a] m-0">Các Ngành Hàng Hải Sản Tuyển Chọn</p>
            </div>
            <Link
              href="/san-pham"
              className="group text-[10px] uppercase font-bold text-[#d97706] hover:brightness-110 transition flex items-center gap-1 cursor-pointer shrink-0 decoration-transparent"
            >
              Xem Tất Cả &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/danh-muc/${category.slug}`}
                className="bg-white border border-[#e5e7eb] p-4 group cursor-pointer transition duration-300 hover:shadow-md decoration-transparent block"
              >
                <div className="aspect-video bg-[#e5e7eb] mb-4 flex items-center justify-center overflow-hidden relative rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xs font-black uppercase mb-1 tracking-wider text-[#0a0a0a] group-hover:text-[#d97706] transition m-0">{category.name}</h3>
                <p className="text-[11px] opacity-60 leading-relaxed text-[#0a0a0a] line-clamp-2 m-0">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CARD HIGHLIGHTS */}
      <section id="premium-products-highlight" className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 pb-12">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#d97706] font-mono m-0">Bữa ngon hoàng tộc</h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a0a0a] uppercase leading-tight font-sans m-0">
              Đặc Sản Săn Đón Nhiều Nhất
            </p>
            <p className="text-sm text-gray-500 leading-relaxed m-0">
              Các mẻ hải sản cua sú dạn gạch vừa cập cảng được sục khí khỏe mạnh chờ đóng gói vận chuyển.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => (
              <Link 
                key={prod.id}
                href={`/san-pham/${prod.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer group decoration-transparent block"
              >
                <div className="relative h-64 overflow-hidden bg-slate-50">
                  {prod.image_url ? (
                    <Image
                      src={prod.image_url}
                      alt={`${prod.name} - hải sản tươi ngon từ vựa thương lái Cà Mau`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs">Hình ảnh thực tế</div>
                  )}
                  {prod.original_price && (
                    <div className="absolute top-4 left-4 bg-[#d97706] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                      GIẢM GIÁ GỐC
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-[#031e25]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white font-mono text-xs font-bold border border-[#04333f]">
                    {prod.price.toLocaleString("vi-VN")} đ
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-wider uppercase font-sans">
                    <span>KHU VỰC: {prod.harvestLocation}</span>
                    <span className="flex items-center gap-0.5 text-[#d97706]">
                      <Star className="w-3 h-3 fill-[#d97706]" /> {prod.rating} ({prod.reviewsCount})
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#d97706] transition uppercase tracking-wide leading-snug line-clamp-2 m-0">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed m-0">
                    {prod.description}
                  </p>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] text-gray-400 font-mono">THƯƠNG LÁI</span>
                      <span className="text-xs font-bold text-gray-700">Chú Năm Năm Căn</span>
                    </div>
                    <span className="px-3.5 py-1.5 bg-slate-100 text-[#031e25] text-[10px] font-bold uppercase tracking-wider rounded group-hover:bg-[#031e25] group-hover:text-white transition duration-300">
                      Xem đầm sản phẩm &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MERCHANT SECTION - Professional partner list */}
      <section id="featured-merchants-carousel" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4 border-b border-[#e5e7eb] mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] m-0">02. Đối Tác Uy Tín</h2>
              <p className="text-xl sm:text-2xl font-black uppercase text-[#0a0a0a] m-0">Thương Lái Thu Mua Tiêu Biểu</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0a0a0a]/50">Tiêu Chuẩn E-E-A-T</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrichedMerchants.map((merchant) => (
              <Link
                key={merchant.id}
                href={`/thuong-lai/${merchant.slug}`}
                className="bg-white border border-[#e5e7eb] p-4 group cursor-pointer transition duration-300 hover:shadow-md flex flex-col justify-between decoration-transparent text-inherit"
              >
                <div className="space-y-4">
                  {/* Avatar and Info */}
                  <div className="flex gap-4 items-center">
                    <Image
                      src={merchant.avatar}
                      alt={merchant.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border border-[#e5e7eb] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wide m-0">
                          {merchant.name.split(" - ")[0]}
                        </p>
                        {merchant.isCertified && (
                          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                            OCOP 4★
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-50 font-medium tracking-wide m-0">⭐ {merchant.rating} ({merchant.reviewsCount} đánh giá) • {merchant.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-2 m-0">
                    &quot;{merchant.bio}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e7eb] mt-4 flex items-center justify-between text-[11px] font-bold text-[#0a0a0a] uppercase tracking-wider">
                  <span className="text-gray-400 font-mono text-[9px]">KINH NGHIỆM: {merchant.experience.split(" ")[0]} NĂM</span>
                  <span className="text-[#d97706] group-hover:translate-x-1.5 transition-transform duration-300">Ghé vựa &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Latest Blogs */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb] mb-8">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] m-0">03. Tin Tức & Cẩm Nang</h2>
              <p className="text-xl sm:text-2xl font-black uppercase text-[#0a0a0a] m-0">Góc Chia Sẻ Kinh Nghiệm</p>
            </div>
            <Link href="/blog" className="text-xs font-bold uppercase text-[#d97706] hover:underline decoration-transparent">
              Xem tất cả &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBlogs.map((blog) => (
              <Link 
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-2xl border border-gray-150 border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer group decoration-transparent block"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {blog.cover_image_url ? (
                    <Image 
                      src={blog.cover_image_url} 
                      alt={blog.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Hình ảnh cẩm nang</div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">
                    {blog.publish_date ? new Date(blog.publish_date).toLocaleDateString("vi-VN") : "Gần đây"}
                  </span>
                  <h3 className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#d97706] transition line-clamp-1 m-0">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed m-0">
                    {blog.meta_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
