import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { merchantService } from "@/lib/services";
import { enrichMerchant } from "@/lib/utils/enrichment";
import { MapPin } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Danh Sách Vựa Thương Lái Uy Tín Cà Mau | Hải Sản Cao Cấp",
  description: "Danh sách các vựa thương lái hải sản khô, tươi sống uy tín hàng đầu Năm Căn, Sông Đốc. Kết nối mua trực tiếp giá gốc, đầy đủ giấy phép ATVSTP.",
  alternates: {
    canonical: "/thuong-lai",
  },
  openGraph: {
    title: "Danh Sách Vựa Thương Lái Uy Tín Cà Mau | Hải Sản Cao Cấp",
    description: "Danh sách các vựa thương lái hải sản khô, tươi sống uy tín hàng đầu Năm Căn, Sông Đốc. Kết nối mua trực tiếp giá gốc, đầy đủ giấy phép ATVSTP.",
    url: "/thuong-lai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh Sách Vựa Thương Lái Uy Tín Cà Mau | Hải Sản Cao Cấp",
    description: "Danh sách các vựa thương lái hải sản khô, tươi sống uy tín hàng đầu Năm Căn, Sông Đốc. Kết nối mua trực tiếp giá gốc, đầy đủ giấy phép ATVSTP.",
  }
};

export default async function MerchantListPage() {
  const rawMerchants = await merchantService.getAllActiveMerchants();
  const merchants = rawMerchants.map(enrichMerchant);

  return (
    <div className="w-full">
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Thương Lái' }]} />
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#031e25] uppercase tracking-wide">
          Danh Sách Vựa Thương Lái Uy Tín Cà Mau — Đối Tác Đồng Hành
        </h1>
      </div>
      <div id="featured-merchants-carousel" className="py-4 px-4 sm:px-6 lg:px-8 bg-transparent space-y-8 font-sans">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4 border-b border-[#e5e7eb] gap-4">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] m-0">Đối Tác Uy Tín</h2>
            <p className="text-xl sm:text-2xl font-black uppercase text-[#0a0a0a] m-0">Thương Lái Thu Mua Tiêu Biểu</p>
          </div>
          <span className="text-xs text-gray-400 font-mono font-bold">Tiêu Chuẩn E-E-A-T Thẩm Định</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <Link
              key={merchant.id}
              href={`/thuong-lai/${merchant.slug}`}
              className="bg-white border border-[#e5e7eb] p-6 group cursor-pointer transition duration-300 hover:shadow-md flex flex-col justify-between decoration-transparent text-inherit block"
            >
              <div className="space-y-4">
                {/* Avatar and Info */}
                <div className="flex gap-4 items-center">
                  <Image
                    src={merchant.avatar}
                    alt={merchant.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover border border-[#e5e7eb] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wide m-0">
                        {merchant.name.split(' - ')[0]}
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

                <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3 m-0">
                  &quot;{merchant.bio}&quot;
                </p>
                
                <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bến: {merchant.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e7eb] mt-4 flex items-center justify-between text-[11px] font-bold text-[#0a0a0a] uppercase tracking-wider">
                <span className="text-gray-400 font-mono text-[9px]">KINH NGHIỆM: {merchant.experience.split(' ')[0]} NĂM</span>
                <span className="text-[#d97706] group-hover:translate-x-1.5 transition-transform duration-300">Ghé vựa &rarr;</span>
              </div>
            </Link>
          ))}
          {merchants.length === 0 && (
            <p className="col-span-full text-center text-sm text-[var(--color-ink)]/50 py-12 m-0">
              Hiện chưa có thương lái nào hoạt động trên hệ thống.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
