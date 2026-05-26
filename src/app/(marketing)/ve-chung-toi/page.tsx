import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Hải Sản Cà Mau Sạch',
  description:
    'Sứ mệnh kết nối trực tiếp thực khách với các vựa thương lái uy tín tại Mũi Cà Mau. Hải sản tươi sống tự nhiên, truy xuất nguồn gốc rõ ràng.',
  alternates: { canonical: '/ve-chung-toi' },
}

export default function VeChungToiPage() {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[72px]">
          <Breadcrumb light={true} items={[{ label: 'Về Chúng Tôi', href: '/ve-chung-toi' }]} />
          <h1 className="mt-4 text-display font-medium tracking-[2.6px] uppercase leading-none text-pure-white/90 max-w-3xl text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px]">
            Hành Trình Tươi Sống
          </h1>
          <p className="mt-6 text-[18px] leading-[1.33] tracking-[-0.32px] text-pure-white/70 max-w-xl">
            Mang tinh hoa của biển cả Mũi Cà Mau đến bàn ăn mọi nhà thông qua liên kết trực tiếp với các thương lái uy tín.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-[72px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-heading font-medium tracking-[-0.51px] text-ink-black mb-5">
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <p className="text-[14px] leading-[1.44] text-ink-black/80 mb-4">
                Cà Mau sở hữu hệ sinh thái rừng ngập mặn trù phú, là nơi sinh trưởng của nhiều loài hải sản ngon bậc nhất Việt Nam như tôm sú, cua biển. Tuy nhiên, việc mua bán truyền thống qua nhiều tầng trung gian khiến chất lượng hải sản giảm sút khi đến tay người tiêu dùng, đồng thời giá cả bị đẩy lên cao.
              </p>
              <p className="text-[14px] leading-[1.44] text-ink-black/80">
                Hải Sản Cà Mau ra đời với sứ mệnh xóa nhòa khoảng cách này bằng cách thiết lập một cổng kết nối kỹ thuật số trực tiếp giữa thực khách, nhà hàng với các vựa hải sản, thương lái uy tín nhất tại Mũi Cà Mau.
              </p>
            </div>

            <div className="bg-pure-white rounded-[32px] p-[30px] border border-canvas">
              <h2 className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-6">
                Giá Trị Cốt Lõi
              </h2>
              <div className="space-y-[18px]">
                {[
                  {
                    title: '1. Tươi Ngon Sinh Thái',
                    desc: 'Tôm sú, cua biển được thu hoạch tự nhiên từ vùng rừng ngập mặn sinh thái Cà Mau, đảm bảo độ chắc thịt, béo ngọt tự nhiên không qua hóa chất.',
                  },
                  {
                    title: '2. Minh Bạch Nguồn Gốc',
                    desc: 'Mỗi sản phẩm đều ghi rõ tên thương lái, địa chỉ vựa thu mua và ngày đánh bắt để người tiêu dùng an tâm truy xuất nguồn gốc.',
                  },
                  {
                    title: '3. Kết Nối Trực Tiếp',
                    desc: 'Loại bỏ trung gian không cần thiết, giúp nâng cao giá trị thu nhập cho ngư dân địa phương và đem lại giá thành hợp lý nhất cho khách hàng.',
                  },
                ].map((val) => (
                  <div key={val.title}>
                    <h3 className="text-[16px] font-medium tracking-[-0.2px] text-ink-black mb-1">
                      {val.title}
                    </h3>
                    <p className="text-[14px] leading-[1.44] text-soft-gray">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action banner */}
          <div className="mt-[72px] bg-deepwater-teal text-pure-white rounded-[32px] p-[30px] sm:p-[45px] text-center max-w-4xl mx-auto">
            <h2 className="text-[22px] font-medium tracking-[-0.35px] mb-3">
              Trải Nghiệm Hương Vị Biển Cà Mau Ngay Hôm Nay
            </h2>
            <p className="text-[14px] text-pure-white/70 max-w-md mx-auto mb-6">
              Xem ngay danh sách hải sản tươi ngon nhất được cập nhật trực tiếp tại vựa thương lái hôm nay.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/san-pham"
                className="inline-flex items-center px-[20px] py-[10px] bg-pure-white text-ink-black text-[14px] font-medium rounded-[5px] transition-opacity duration-150 hover:opacity-90"
              >
                Khám Phá Sản Phẩm
              </Link>
              <Link
                href="/thuong-lai"
                className="inline-flex items-center px-[20px] py-[10px] border border-pure-white/30 text-pure-white text-[14px] font-medium rounded-[5px] transition-colors duration-150 hover:bg-pure-white/10"
              >
                Gặp Gỡ Thương Lái
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
