import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/lib/services";
import { getBlogBySlug } from "@/lib/utils/cached-queries";
import { AUTHOR_CHU_NAM } from "@/lib/constants/authors";
import { ArrowLeft, Clock } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Hàm parse TOC từ markdown ──────────────────────────────────────────────
function toSlugId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(markdown: string): { level: 2 | 3; text: string; id: string }[] {
  const headings: { level: 2 | 3; text: string; id: string }[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const text = h3Match[1].trim();
      headings.push({ level: 3, text, id: toSlugId(text) });
    } else if (h2Match) {
      const text = h2Match[1].trim();
      headings.push({ level: 2, text, id: toSlugId(text) });
    }
  }
  return headings;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    // Cached — không gửi duplicate request với page component
    const blog = await getBlogBySlug(slug);
    // Canonical: ưu tiên canonical_url tùy chỉnh nếu admin đã nhập, fallback về self
    const canonicalHref = blog.canonical_url || `/blog/${slug}`;
    return {
      title: `${blog.title} - Cẩm Nang Hải Sản Cao Cấp`,
      description: blog.meta_description || blog.title,
      alternates: {
        canonical: canonicalHref,
      },
      openGraph: {
        title: `${blog.title} - Cẩm Nang Hải Sản Cao Cấp`,
        description: blog.meta_description || blog.title,
        type: "article",
        url: `/blog/${slug}`,
        images: blog.cover_image_url ? [blog.cover_image_url] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${blog.title} - Cẩm Nang Hải Sản Cao Cấp`,
        description: blog.meta_description || blog.title,
        images: blog.cover_image_url ? [blog.cover_image_url] : [],
      }
    };
  } catch {
    return {
      title: "Không Tìm Thấy Bài Viết | Hải Sản Cao Cấp",
    };
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let blog;
  try {
    // Cached — không gửi request mới nếu đã có trong generateMetadata
    blog = await getBlogBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch related products (server component, async is fine)
  const allProducts = await productService.getAllProducts();
  const displayProducts = allProducts.slice(0, 3);

  // Calculate reading time (200 words/min, Vietnamese text)
  const wordCount = blog.content ? blog.content.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/blog/${blog.slug}`;

  // Author profile — dùng constants cố định thay vì hardcode theo title (tránh schema drift)
  const author = AUTHOR_CHU_NAM;

  // Article JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.meta_description || "",
    "image": blog.cover_image_url ? `${baseUrl}${blog.cover_image_url}` : undefined,
    "datePublished": blog.publish_date ? new Date(blog.publish_date).toISOString() : new Date(blog.created_at).toISOString(),
    "dateModified": new Date(blog.updated_at).toISOString(),
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "url": `${baseUrl}/thuong-lai/${author.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hải Sản Cao Cấp Marketplace",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bài viết",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": canonicalUrl
      }
    ]
  };

  // Parse TOC headings từ nội dung bài viết
  const tocHeadings = extractHeadings(blog.content || '');

  // Custom components for Markdown rendering (với id cho h2/h3 để TOC scroll)
  const MarkdownComponents = {
    h1: ({ ...props }) => (
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#031e25] uppercase tracking-tight mt-8 mb-4 leading-tight font-sans" {...props} />
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: (props: any) => {
      const children = props.children;
      const text = typeof children === 'string' ? children : String(children ?? '');
      const id = toSlugId(text);
      return <h2 id={id} className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mt-8 mb-4 leading-normal font-sans">{children}</h2>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: (props: any) => {
      const children = props.children;
      const text = typeof children === 'string' ? children : String(children ?? '');
      const id = toSlugId(text);
      return <h3 id={id} className="text-lg sm:text-xl font-bold text-[#031e25] uppercase tracking-wide mt-6 mb-3 border-l-4 border-[#d97706] pl-3 font-sans">{children}</h3>;
    },
    p: ({ ...props }) => (
      <p className="text-slate-700 text-sm md:text-base leading-relaxed text-justify font-light text-balance mb-4 font-sans" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm md:text-base font-light font-sans" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal pl-5 space-y-2 mb-4 text-slate-700 text-sm md:text-base font-light font-sans" {...props} />
    ),
    li: ({ ...props }) => (
      <li className="pl-1 font-sans" {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-amber-500 bg-amber-50/50 pl-4 py-2 pr-2 my-4 rounded-r-lg italic text-slate-700 text-sm md:text-base font-sans" {...props} />
    ),
    table: ({ ...props }) => (
      <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm font-sans" {...props} />
      </div>
    ),
    thead: ({ ...props }) => (
      <thead className="bg-[#031e25]/5" {...props} />
    ),
    tbody: ({ ...props }) => (
      <tbody className="divide-y divide-gray-100 bg-white" {...props} />
    ),
    tr: ({ ...props }) => (
      <tr className="hover:bg-slate-50/50 transition-colors" {...props} />
    ),
    th: ({ ...props }) => (
      <th className="px-4 py-3 text-left text-xs font-bold text-[#031e25] uppercase tracking-wider font-mono border-b border-gray-200" {...props} />
    ),
    td: ({ ...props }) => (
      <td className="px-4 py-3 text-gray-700 font-light border-b border-gray-100" {...props} />
    ),
    strong: ({ ...props }) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
  };

  const category = blog.title.toLowerCase().includes('giá') ? "Bảng Giá" : "Cẩm Nang";

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 font-sans text-[#0a0a0a] antialiased">
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Layout 2 cột: TOC trái + Nội dung phải */}
      <div className="flex gap-10 items-start">

        {/* ─── TOC Sidebar (chỉ hiển trên desktop) ─── */}
        {tocHeadings.length > 0 && (
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 bg-white/90 backdrop-blur border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono mb-3">
                Mục lục
              </p>
              <nav>
                <ul className="space-y-1.5">
                  {tocHeadings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'ml-3' : ''}>
                      <a
                        href={`#${h.id}`}
                        className={`block text-xs leading-snug transition hover:text-[#d97706] ${
                          h.level === 2
                            ? 'font-bold text-[#031e25]'
                            : 'font-normal text-gray-500'
                        }`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        )}

        {/* ─── Nội dung chính ─── */}
        <article id="blog-reader-view" className="flex-1 min-w-0 space-y-8">

      {/* Breadcrumb điều hướng */}
      <Breadcrumbs
        items={[
          { label: "Bài viết", href: "/blog" },
          { label: blog.title },
        ]}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-xs font-bold text-[#031e25]/75 hover:text-[#d97706] transition decoration-transparent"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Quay Lại Cẩm Nang Hỏi Đáp
      </Link>

      {/* Title Area */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-200">
            {category}
          </span>
          <span className="text-gray-400 text-xs font-mono font-medium">
            {blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('vi-VN') : 'Gần đây'}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} phút đọc
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#031e25] leading-tight uppercase tracking-tight m-0">
          {blog.title}
        </h1>

        <p className="text-sm text-gray-500 font-light leading-relaxed border-l-2 border-gray-200 pl-4 italic m-0">
          {blog.meta_description}
        </p>
      </div>

      {/* Main banner */}
      {blog.cover_image_url && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative">
          <Image
            src={blog.cover_image_url}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Spacious Reading Content */}
      <div className="prose prose-slate max-w-none py-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
          {blog.content}
        </ReactMarkdown>
      </div>

      {/* Premium EEAT Author Box */}
      <div id="blog-author-card" className="bg-slate-50 border border-gray-200/60 rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-inner mt-12">
        <Image
          src={author.avatar}
          alt={author.name}
          width={64}
          height={64}
          className="rounded-full object-cover border-2 border-[#d97706]/40 shrink-0 shadow-sm"
        />
        <div className="space-y-2 flex-grow">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wide m-0">Người Đúc Kết: {author.name}</h4>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black border border-amber-200 font-mono uppercase">
              {author.role}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-light leading-relaxed m-0">
            {author.bio} Tất cả bài viết đóng góp trên bảng tin đều trải qua khâu thẩm duyệt thực hành thủy sản an toàn Năm Căn Cà Mau.
          </p>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {displayProducts.length > 0 && (
        <section id="related-products-section" className="pt-8 border-t border-gray-200">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#031e25] border-l-4 border-[#d97706] pl-3 m-0">
              Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {displayProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/san-pham/${prod.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition decoration-transparent block text-inherit"
                >
                  {prod.image_url && (
                    <div className="h-36 relative overflow-hidden">
                      <Image
                        src={prod.image_url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 uppercase truncate m-0">{prod.name}</h3>
                    <p className="text-xs font-black text-[#d97706] m-0">
                      {prod.price?.toLocaleString('vi-VN')} đ/kg
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
        </article>
        {/* Đóng flex container */}
      </div>
    </div>
  );
}
