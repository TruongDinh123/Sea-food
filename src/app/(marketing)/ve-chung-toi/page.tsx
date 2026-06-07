import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Hải Sản Cao Cấp",
  description: "Tìm hiểu về sứ mệnh kết nối thương lái hải sản khô Cà Mau và người tiêu dùng của Hải Sản Cao Cấp Marketplace.",
  alternates: {
    canonical: "/ve-chung-toi",
  },
};

export default function AboutUsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: 'Về Chúng Tôi' }]} className="mb-4" />

      <article className="bg-[var(--color-white)] p-card-padding rounded-cards border border-[var(--color-canvas)] shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-[var(--color-deepwater)] tracking-tight">
          Về Chúng Tôi
        </h1>

        <p className="text-sm leading-relaxed text-[var(--color-ink)]/90">
          Chào mừng bạn đến với <strong>Hải Sản Khô Marketplace</strong> - Nền tảng kết nối trực tiếp các vựa hải sản, thương lái uy tín tại Cà Mau và các tỉnh miền Tây với người tiêu dùng trên toàn quốc.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-deepwater)]">Sứ mệnh của chúng tôi</h2>
          <p className="text-sm leading-relaxed text-[var(--color-ink)]/80">
            Chúng tôi sinh ra với sứ mệnh xóa bỏ rào cản trung gian, giúp người mua có thể sở hữu sản phẩm tôm khô, cua khô, cá khô chất lượng cao nhất với giá gốc từ vựa, đồng thời hỗ trợ thương lái địa phương tối ưu hóa kênh bán hàng kỹ thuật số.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-deepwater)]">Cam kết chất lượng</h2>
          <p className="text-sm leading-relaxed text-[var(--color-ink)]/80">
            Tất cả thương lái tham gia hệ thống đều được kiểm duyệt chặt chẽ về giấy phép vệ sinh an toàn thực phẩm cũng như quy trình sản xuất truyền thống tự nhiên. Chúng tôi cam kết nói không với hóa chất bảo quản và phẩm màu độc hại.
          </p>
        </div>

        <div className="border-t border-[var(--color-canvas)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Bạn muốn mua sắm ngay?</span>
          <Link
            href="/san-pham"
            className="bg-[var(--color-deepwater)] hover:opacity-90 text-[var(--color-white)] font-bold py-2 px-6 rounded-md text-sm transition-opacity"
          >
            Đến cửa hàng
          </Link>
        </div>
      </article>
    </div>
  );
}
