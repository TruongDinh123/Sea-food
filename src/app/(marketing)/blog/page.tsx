import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Cẩm Nang Ẩm Thực Hải Sản Cà Mau',
  description:
    'Chia sẻ bí quyết chọn cua biển ngon, cách chế biến tôm sú sinh thái và cẩm nang ẩm thực đặc sản Mũi Cà Mau từ các chuyên gia bản địa.',
  alternates: { canonical: '/blog' },
}

interface BlogPost {
  slug: string
  title: string
  desc: string
  date: string
  category: string
}

const MOCK_POSTS: BlogPost[] = [
  {
    slug: 'bi-quyet-chon-cua-bien-ca-mau-ngon-chac-thit',
    title: 'Bí Quyết Chọn Cua Biển Cà Mau Ngon, Chắc Thịt Béo Ngậy',
    desc: 'Làm thế nào để phân biệt cua Y, cua gạch, cua cốm và chọn được những con cua nhiều thịt, béo ngọt chuẩn thương hiệu Cà Mau? Đọc ngay hướng dẫn từ vựa thu mua.',
    date: '2026-05-20',
    category: 'Cẩm Nang Chọn Lựa',
  },
  {
    slug: 'cach-che-bien-tom-su-hap-nuoc-dua-chuan-vi-mien-tay',
    title: 'Cách Chế Biến Tôm Sú Hấp Nước Dừa Ngọt Lịm Chuẩn Vị Miền Tây',
    desc: 'Tôm sú sinh thái Cà Mau hấp nước dừa xiêm là món ăn cực kỳ dễ làm nhưng giữ trọn vẹn vị ngọt đậm đà vốn có của tôm sú tự nhiên. Xem ngay công thức chi tiết.',
    date: '2026-05-18',
    category: 'Công Thức Chế Biến',
  },
  {
    slug: 'bao-quan-tom-kho-dat-cam-mau-dung-cach-tai-nha',
    title: 'Hướng Dẫn Bảo Quản Tôm Khô Đất Cà Mau Đúng Cách Tại Nhà',
    desc: 'Tôm khô đất Cà Mau là đặc sản thượng hạng. Làm sao để giữ tôm khô luôn dẻo ngọt, không bị mốc và mất đi hương vị nguyên bản mà không dùng chất bảo quản?',
    date: '2026-05-15',
    category: 'Mẹo Hay Gia Đình',
  },
]

export default function BlogListPage() {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[36px]">
          <Breadcrumb light={true} items={[{ label: 'Blog', href: '/blog' }]} />
          <h1 className="mt-4 text-heading font-medium tracking-[-0.51px]">
            Cẩm Nang Hải Sản Cà Mau
          </h1>
          <p className="mt-3 text-[18px] leading-[1.33] tracking-[-0.32px] text-pure-white/70 max-w-xl">
            Chia sẻ mẹo chọn vựa, công thức chế biến và câu chuyện ẩm thực sinh thái từ miền sông nước Cà Mau.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-[45px]">
          {MOCK_POSTS.length === 0 ? (
            <p className="text-center text-soft-gray py-[72px]">
              Chưa có bài viết nào. Vui lòng quay lại sau.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-pure-white rounded-[32px] p-[20px] border border-canvas hover:shadow-md transition-all duration-150"
                  style={{ boxShadow: 'none' }}
                >
                  <div className="mb-[14px]">
                    <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-soft-gray mb-2">
                      {post.category}
                    </p>
                    <h2 className="text-[22px] font-medium tracking-[-0.35px] text-ink-black group-hover:text-deepwater-teal transition-colors duration-150 line-clamp-2">
                      {post.title}
                    </h2>
                  </div>

                  <p className="text-[14px] leading-[1.44] text-soft-gray line-clamp-3 mb-[18px]">
                    {post.desc}
                  </p>

                  <div className="mt-auto pt-[14px] border-t border-canvas flex items-center justify-between text-[11px] text-soft-gray tracking-[1px]">
                    <span>{post.date}</span>
                    <span className="font-semibold text-deepwater-teal group-hover:underline">Đọc tiếp →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
