'use client';

import { useState } from 'react';
import { MapPin, Award, Calendar, Star, CheckCircle, Ship } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { EnrichedProduct, EnrichedMerchant } from '@/lib/utils/enrichment';

interface MerchantProfileClientProps {
  merchant: EnrichedMerchant;
  products: EnrichedProduct[];
}

export default function MerchantProfileClient({ merchant, products }: MerchantProfileClientProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqPhone) return;

    setLoading(true);
    // Giả lập cuộc gửi tin cho thương lái
    setTimeout(() => {
      setFormSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setFormSubmitted(false);
        setInqName('');
        setInqPhone('');
      }, 3000);
    }, 1000);
  };

  return (
    <div id="merchant-profile-view" className="font-sans text-[#0a0a0a] antialiased space-y-0">
      {/* 1. HERO PROFILE COVER - Large background area with Avatar overlay */}
      <section id="merchant-cover-section" className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden rounded-2xl">
        <Image
          src={merchant.coverImage}
          alt={`Hình bìa vựa thu mua hải sản của ${merchant.name}`}
          fill
          sizes="100vw"
          className="object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        
        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <Image
            src={merchant.avatar}
            alt={merchant.name}
            width={80}
            height={80}
            className="rounded-full border-4 border-white object-cover shadow-lg shrink-0"
          />
          <div className="text-white space-y-1.5 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-none text-[#ffffff] m-0">
                {merchant.name}
              </h1>
              {merchant.isCertified && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  Đối Tác Đã Thẩm Định OCOP
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-300 font-medium flex items-center gap-1 m-0">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Bến vựa: {merchant.address}
            </p>
          </div>
        </div>
      </section>

      {/* 2. THREE-COLUMNS PROFILE LAYOUT */}
      <section className="mx-auto max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Author Story and Experience (EEAT Showcase) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#031e25] flex items-center gap-1.5 m-0">
                  <Ship className="w-4 h-4 text-amber-500" /> Hồ sơ lý lịch vựa thương lái
                </h2>
              </div>

              {/* Bio block demonstrating Expertise & Experience */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <div className="h-9 w-9 bg-amber-50 text-[#d97706] rounded-lg flex items-center justify-center shrink-0 font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase leading-none">Thâm niên thu mua</span>
                    <span className="font-extrabold text-gray-800 leading-normal">{merchant.experience}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="h-9 w-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase leading-none">Kiểm định chất lượng</span>
                    <span className="font-extrabold text-[#031e25] leading-normal">
                      {merchant.isCertified ? 'Đã cấp chứng thư VietGAP / HACCP' : 'Đăng ký ATVSTP Cơ sở'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 font-bold" />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase leading-none">Điểm uy tín hệ thống</span>
                    <span className="font-extrabold text-gray-800 leading-normal">
                      {merchant.rating} / 5.0 ({merchant.reviewsCount} khách sỉ)
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Author Story */}
              <div className="space-y-2 text-xs text-gray-600 leading-relaxed font-light font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold uppercase text-[9px] block text-[#0a0a0a] tracking-wide mb-1 font-mono">Bản tuyên ngôn danh dự:</span>
                <p className="m-0">&quot;{merchant.bio}&quot;</p>
              </div>

              {/* Verified certifications */}
              <div className="space-y-2.5">
                <span className="block text-[10px] uppercase font-black text-gray-400 font-mono">Văn Bằng & Chứng Chỉ Đã Khai Báo</span>
                <div className="space-y-2">
                  {merchant.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs font-semibold text-gray-700 leading-normal">
                      <CheckCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct wholesales message form */}
            <div className="bg-[#031e25] text-white rounded-2xl p-6 border border-[#04333f] space-y-4 shadow-md font-sans">
              <h3 className="text-sm font-black uppercase text-[#d97706] m-0">Yêu cầu báo giá sỉ nhanh</h3>
              <p className="text-[11px] text-gray-300 leading-relaxed m-0">
                Gửi ngay liên hệ để được bốc máy kết nối trực tiếp với thương lái đàm phán giá tốt nhất.
              </p>

              {formSubmitted ? (
                <div className="p-3 bg-emerald-600 text-white rounded-lg text-xs font-bold font-mono">
                  ✓ Gửi thông tin thành công. Thương lái sẽ liên hệ lại.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-[#0a0a0a]">
                  <input
                    type="text"
                    required
                    placeholder="Tên của bạn..."
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-700/60 rounded-lg placeholder-gray-400 text-xs focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Điện thoại liên hệ..."
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-700/60 rounded-lg placeholder-gray-400 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#d97706] hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] rounded-lg transition duration-200 shadow-sm cursor-pointer border-0 disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : 'GỬI YÊU CẦU →'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Grid displaying products from this merchant */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-gray-200">
              <div className="space-y-1">
                <h2 className="text-xs font-black tracking-widest uppercase text-amber-600 font-mono m-0">Sản vật phân phối</h2>
                <p className="text-xl sm:text-2xl font-black uppercase text-[#031e25] leading-none m-0">
                  Hải Sản Đang Phân Phối Trực Tiếp
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono font-bold">
                KHO HÀNG: {products.length} SẢN PHẨM
              </span>
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border">
                <p className="text-xs text-gray-500 m-0">Thương lái chưa khai báo sản vật sỉ lẻ đợt này.</p>
              </div>
            )}

            {/* Product Display Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/san-pham/${prod.slug}`}
                  className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer flex flex-col group h-full decoration-transparent text-inherit block"
                >
                  <div className="relative h-48 bg-slate-50 overflow-hidden shrink-0">
                    {prod.image_url ? (
                      <Image
                        src={prod.image_url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs">Hình ảnh thực tế</div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#031e25]/85 text-[#d97706] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      GIÁ GỐC ĐẦM
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">Khu Vực: {prod.harvestLocation}</span>
                      <h3 className="text-xs font-black text-gray-800 uppercase group-hover:text-[#d97706] transition tracking-wide leading-tight line-clamp-2 m-0">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed m-0">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 mt-4 flex justify-between items-center">
                      <div>
                        <span className="block text-[8px] text-gray-400 font-mono">GIÁ NIÊM YẾT</span>
                        <span className="text-xs font-black text-[#d97706] tracking-tight">{prod.price.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <span className="px-3.5 py-1.5 bg-slate-100 text-[#031e25] text-[9px] font-bold uppercase tracking-wider rounded group-hover:bg-[#031e25] group-hover:text-white transition duration-300">
                        Đặt sỉ &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* General Disclaimer */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs text-gray-500 leading-relaxed font-light">
              <span className="font-bold uppercase text-[9px] block text-[#0a0a0a] tracking-wider mb-1.5">Tuyên bố miễn trừ & Đảm bảo pháp lý:</span>
              Mọi hồ sơ định danh thương lái đều đã được Hải Sản Cao Cấp xác minh qua số điện thoại chính thức, tài khoản ngân hàng trùng khớp, địa chỉ bến vựa thực tế dưới sự hỗ trợ giám sát của chi cục thủy sản địa phương Năm Căn. Quá trình giao thương tự do luôn yêu cầu người mua kiểm nghiệm hàng sống rổ lạt trước khi thanh toán sòng phẳng.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
