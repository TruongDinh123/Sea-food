import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { ArrowLeftIcon } from '@/components/ui/Icons'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface BlogPostDetails {
  slug: string
  title: string
  desc: string
  date: string
  category: string
  content: string
}

const POSTS_DETAILS: Record<string, BlogPostDetails> = {
  'bi-quyet-chon-cua-bien-ca-mau-ngon-chac-thit': {
    slug: 'bi-quyet-chon-cua-bien-ca-mau-ngon-chac-thit',
    title: 'Bí Quyết Chọn Cua Biển Cà Mau Ngon, Chắc Thịt Béo Ngậy',
    desc: 'Làm thế nào để phân biệt cua Y, cua gạch, cua cốm và chọn được những con cua nhiều thịt, béo ngọt chuẩn thương hiệu Cà Mau? Đọc ngay hướng dẫn từ vựa thu mua.',
    date: '2026-05-20',
    category: 'Cẩm Nang Chọn Lựa',
    content: `
      Cua biển Cà Mau từ lâu đã nổi tiếng với thịt ngọt đậm đà, chắc nịch và lượng gạch béo ngậy vô cùng đặc trưng. Để chọn được một chú cua ngon hoàn hảo, bạn cần nắm vững những kinh nghiệm đúc kết từ những người làm vựa hải sản lâu năm dưới đây.

      ### 1. Phân Biệt Các Loại Cua Biển Phổ Biến
      - **Cua Y (Cua Thịt):** Đây là loại cua đực, có chiếc yếm hình chữ Y hẹp. Cua Y ngon phải chắc thịt, khi bóp vào phần yếm dưới bụng thấy cứng cáp, không bị lõm hay phập phồng.
      - **Cua Gạch (Cua Cái):** Cua cái có chiếc yếm to tròn che gần hết phần bụng dưới. Cua gạch chuẩn là cua đang ôm đầy gạch béo màu cam. Bạn có thể kiểm tra bằng cách bóp nhẹ vào phần đùi của chân bơi hoặc nhìn khe yếm xem có thấy gạch cam lấp ló hay không.
      - **Cua Cốm (Cua Hai Da):** Đây là loại cua cực kỳ quý hiếm, chuẩn bị lột vỏ. Lớp vỏ bên trong cực kỳ mềm và ngọt lịm. Cua cốm thường đắt nhất vì độ ngon vượt trội và cực kỳ bổ dưỡng.

      ### 2. Mẹo Xem Ngoại Hình Để Chọn Cua Chắc
      - **Xem yếm dưới bụng:** Dùng ngón tay ấn mạnh vào yếm cua. Nếu yếm cứng, không bị lún là cua chắc thịt. Ngược lại, yếm mềm hoặc phập phồng là cua ốp (nhiều nước, ít thịt).
      - **Xem màu sắc yếm:** Yếm cua ngon thường có màu hơi ngả vàng hoặc xám đục, không phải màu trắng tinh. Màu yếm đục chứng tỏ cua đã trưởng thành và sinh trưởng lâu năm trong rừng ngập mặn.
      - **Độ linh hoạt:** Cua tươi sống khỏe mạnh sẽ quẫy đạp rất mạnh khi cầm lên, càng cua kẹp rất chặt. Tránh mua cua lờ đờ, chân càng rụng rời.

      Hy vọng với những bí quyết trên, bạn sẽ luôn tự tin chọn được những chú cua biển Cà Mau hảo hạng nhất cho gia đình mình!
    `,
  },
  'cach-che-bien-tom-su-hap-nuoc-dua-chuan-vi-mien-tay': {
    slug: 'cach-che-bien-tom-su-hap-nuoc-dua-chuan-vi-mien-tay',
    title: 'Cách Chế Biến Tôm Sú Hấp Nước Dừa Ngọt Lịm Chuẩn Vị Miền Tây',
    desc: 'Tôm sú sinh thái Cà Mau hấp nước dừa xiêm là món ăn cực kỳ dễ làm nhưng giữ trọn vẹn vị ngọt đậm đà vốn có của tôm sú tự nhiên. Xem ngay công thức chi tiết.',
    date: '2026-05-18',
    category: 'Công Thức Chế Biến',
    content: `
      Tôm sú sinh thái được nuôi tự nhiên dưới tán rừng ngập mặn Cà Mau có kích thước lớn, vỏ bóng khỏe, thịt dai ngọt tự nhiên. Hấp tôm sú với nước dừa xiêm là cách hoàn hảo nhất để giữ trọn vị ngọt biển cả quyện cùng hương thơm béo nhẹ của nước dừa.

      ### Chuẩn bị Nguyên Liệu:
      - 500g Tôm sú sinh thái Cà Mau tươi sống (size 15-20 con/kg).
      - 1 Trái dừa xiêm nhiều nước, ngọt thanh.
      - 2 Củ sả tươi đập dập.
      - 1 Ít hành lá, hành tím thái lát.
      - Muối, hạt nêm, tiêu đen.

      ### Các Bước Thực Hiện:
      1. **Sơ chế tôm:** Tôm mua về rửa sạch với nước muối loãng, cắt bớt râu và gai nhọn trên đầu, rút bỏ chỉ đen dọc lưng tôm để sạch cát. Để ráo nước.
      2. **Chuẩn bị nước hấp:** Chặt dừa lấy nước đổ vào nồi hấp. Thêm sả đập dập, hành tím thái lát và 1 muỗng cà phê hạt nêm vào nước dừa đun sôi lên cho dậy mùi thơm.
      3. **Hấp tôm:** Khi nước dừa đã sôi bùng, trút tôm sú vào nồi. Đậy vung thật kín và hấp trong khoảng 5-7 phút tùy kích thước tôm. Tôm chín sẽ chuyển sang màu đỏ cam rực rỡ và uốn cong mình lại đẹp mắt.
      4. **Trình bày:** Vớt tôm ra đĩa, có thể dùng vỏ trái dừa xiêm tỉa miệng rộng để xếp tôm xung quanh cho đúng điệu miền quê. Rưới thêm một chút nước dừa hấp tôm lên trên để giữ độ mọng nước.

      Món tôm sú hấp nước dừa ăn kèm muối tiêu chanh ớt hoặc nước chấm hải sản xanh cay nồng sẽ đem lại trải nghiệm ẩm thực vô cùng khó quên!
    `,
  },
  'bao-quan-tom-kho-dat-cam-mau-dung-cach-tai-nha': {
    slug: 'bao-quan-tom-kho-dat-cam-mau-dung-cach-tai-nha',
    title: 'Hướng Dẫn Bảo Quản Tôm Khô Đất Cà Mau Đúng Cách Tại Nhà',
    desc: 'Tôm khô đất Cà Mau là đặc sản thượng hạng. Làm sao để giữ tôm khô luôn dẻo ngọt, không bị mốc và mất đi hương vị nguyên bản mà không dùng chất bảo quản?',
    date: '2026-05-15',
    category: 'Mẹo Hay Gia Đình',
    content: `
      Tôm khô đất Cà Mau được làm từ loài tôm đất thiên nhiên sông nước ngọt, luộc và phơi thủ công dưới nắng giòn. Tôm có màu đỏ cam tự nhiên cực kỳ đẹp mắt, vị ngọt đậm dẻo thơm dai mà không loài tôm khô nào sánh bằng. Vì sản phẩm tự nhiên không chứa chất bảo quản hóa học, việc bảo quản tại nhà đúng cách rất quan trọng để tôm không bị mốc hay mất vị ngọt.

      ### 1. Phương Pháp Bảo Quản Trong Tủ Lạnh (Khuyên Dùng)
      Đây là cách tốt nhất để bảo quản tôm khô giữ trọn hương vị dẻo ngọt trong thời gian dài từ 6 tháng đến 1 năm.
      - **Ngăn đông (Trữ lâu dài):** Chia tôm khô thành từng túi nhỏ hút chân không hoặc hộp kín. Khi ăn chỉ cần lấy đúng lượng cần thiết ra rã đông khoảng 5 phút. Việc cấp đông giúp thịt tôm săn lại mà không bị khô cứng hay mất đi chất ngọt.
      - **Ngăn mát (Sử dụng hàng ngày):** Nếu bạn ăn thường xuyên, hãy để tôm trong hộp kín ở ngăn mát tủ lạnh. Cách này giữ tôm ngon trong vòng 1-2 tháng. Tránh để tôm hở vì hơi lạnh của tủ lạnh sẽ hút hết nước làm tôm bị xơ xác.

      ### 2. Phương Pháp Bảo Quản Nhiệt Độ Thường (Dưới 1 Tháng)
      Nếu gia đình không có tủ lạnh hoặc mang đi du lịch dài ngày:
      - Bọc tôm thật kỹ bằng 2-3 lớp giấy báo sạch, sau đó cho vào túi nilon buộc kín hơi. Giấy báo có tác dụng hút ẩm rất tốt, ngăn không cho nấm mốc phát triển.
      - Định kỳ 1 tuần nên mang tôm ra phơi lại dưới nắng giòn khoảng 1-2 tiếng để tôm luôn khô ráo và giữ màu đẹp.

      Chúc các bạn luôn có những bữa cơm ấm cúng cùng đĩa tôm khô đất Cà Mau thượng hạng!
    `,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS_DETAILS[slug]

  if (!post) {
    return { title: 'Không Tìm Thấy Bài Viết | Hải Sản Cà Mau' }
  }

  return {
    title: `${post.title} | Hải Sản Cà Mau`,
    description: post.desc,
    alternates: { canonical: `/blog/${slug}` },
  }
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = POSTS_DETAILS[slug]

  if (!post) {
    notFound()
  }

  // JSON-LD — Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/blog/${slug}`,
    },
    headline: post.title,
    description: post.desc,
    datePublished: `${post.date}T08:00:00+07:00`,
    dateModified: `${post.date}T08:00:00+07:00`,
    author: {
      '@type': 'Organization',
      name: 'Hải Sản Cà Mau',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hải Sản Cà Mau',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'}/favicon.ico`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-deepwater-teal text-pure-white">
        <div className="mx-auto max-w-7xl px-5 pt-[45px] pb-[45px]">
          <Breadcrumb
            light={true}
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${slug}` },
            ]}
          />
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-[2.22px] uppercase text-pure-white/50 mb-3">
              {post.category} — {post.date}
            </p>
            <h1 className="text-heading font-semibold tracking-[-0.51px] text-pure-white max-w-3xl leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-4xl px-5 py-[45px]">
          <div className="bg-pure-white rounded-[32px] p-[20px] sm:p-[45px] border border-canvas">
            {/* Render markdown content with pristine typography layout */}
            <div className="prose prose-neutral max-w-none text-ink-black/90">
              {post.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim()
                if (!trimmed) return null

                if (trimmed.startsWith('###')) {
                  return (
                    <h3 key={index} className="text-heading-sm font-semibold tracking-[-0.35px] text-ink-black mt-6 mb-3">
                      {trimmed.replace('###', '').trim()}
                    </h3>
                  )
                }

                if (trimmed.startsWith('-')) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-2 my-3 text-[14px]">
                      {trimmed
                        .split('\n')
                        .map((li) => li.trim().replace('-', '').trim())
                        .map((liText, liIdx) => (
                          <li key={liIdx} className="leading-[1.44] text-soft-gray">
                            <span className="text-ink-black/90">{liText}</span>
                          </li>
                        ))}
                    </ul>
                  )
                }

                if (trimmed.startsWith('1.')) {
                  return (
                    <ol key={index} className="list-decimal pl-5 space-y-2 my-3 text-[14px]">
                      {trimmed
                        .split('\n')
                        .map((li) => li.trim().replace(/^\d+\.\s*/, '').trim())
                        .map((liText, liIdx) => (
                          <li key={liIdx} className="leading-[1.44] text-soft-gray">
                            <span className="text-ink-black/90">{liText}</span>
                          </li>
                        ))}
                    </ol>
                  )
                }

                return (
                  <p key={index} className="text-[14px] leading-[1.6] text-ink-black/80 mb-4 whitespace-pre-line">
                    {trimmed}
                  </p>
                )
              })}
            </div>

            {/* Back button */}
            <div className="mt-[45px] pt-[30px] border-t border-canvas">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-black hover:text-deepwater-teal transition-colors duration-150"
              >
                <ArrowLeftIcon size={14} aria-hidden="true" />
                Quay Lại Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
