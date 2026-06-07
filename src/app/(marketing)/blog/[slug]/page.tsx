import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogService, productService } from "@/lib/services";
import { ArrowLeft, Clock } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const blog = await blogService.getBlogBySlug(slug);
    return {
      title: `${blog.title} - Cẩm Nang Hải Sản Cao Cấp`,
      description: blog.meta_description || blog.title,
      alternates: {
        canonical: `/blog/${slug}`,
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
    blog = await blogService.getBlogBySlug(slug);
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
      "name": "Chú Năm Đất Mũi",
      "jobTitle": "Thương Lái Thu Mua Cà Mau"
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

  // Định dạng nội dung bài viết
  const formatBodyContent = (text: string) => {
    return text.split('\n').map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('# ')) {
        return <h2 key={i} className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mt-8 mb-4 leading-normal font-sans m-0">{trimmed.substring(2)}</h2>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={i} className="text-lg sm:text-xl font-bold text-[#031e25] uppercase tracking-wide mt-6 mb-3 border-l-3 border-[#d97706] pl-2.5 font-sans m-0">{trimmed.substring(3)}</h3>;
      }
      if (trimmed.startsWith('* ')) {
        return <p key={i} className="text-sm font-semibold text-gray-800 tracking-normal pl-4 border-l border-gray-255 border-gray-200 py-1 leading-relaxed font-sans m-0">{trimmed.substring(2)}</p>;
      }
      if (trimmed.startsWith('| ')) {
        return <p key={i} className="text-xs text-gray-500 font-mono tracking-tight bg-slate-50 py-1.5 px-3 rounded border border-slate-100 m-0">{trimmed}</p>;
      }

      return <p key={i} className="text-slate-700 text-sm md:text-base leading-relaxed text-justify font-light text-balance mb-4 font-sans m-0">{trimmed}</p>;
    });
  };

  // Giả lập thông tin tác giả dựa trên tiêu đề bài viết
  const isBaBien = blog.title.toLowerCase().includes('ba') || blog.title.toLowerCase().includes('sông đốc');
  const authorName = isBaBien ? "Anh Ba Biên Sông Đốc" : "Chú Năm Đất Mũi";
  const authorRole = isBaBien ? "Chủ nhiệm HTX Đánh Bắt Sông Đốc" : "Thương Lái Thu Mua Cà Mau";
  const authorAvatar = isBaBien 
    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
    : "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=100&h=100&q=80";
  const authorBio = isBaBien
    ? "Sinh trưởng bờ biển Sông Đốc Cà Mau, quản lý đội tàu cào cá ngàn mã lực vận chuyển hải sản khơi tươi mặn từ khơi xa về đất liền an tâm."
    : "Bậc thầy thu mua cua tự nhiên tại dầm Năm Căn, Cà Mau hơn 25 năm thâm niên làm lụm bảo tồn gốc cua sành sạch ngon ăn.";

  const category = blog.title.toLowerCase().includes('giá') ? "Bảng Giá" : "Cẩm Nang";

  return (
    <article id="blog-reader-view" className="max-w-3xl mx-auto space-y-8 py-4 font-sans text-[#0a0a0a] antialiased">
      {/* Script JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

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
      <div className="prose prose-slate max-w-none space-y-2 py-4">
        {formatBodyContent(blog.content)}
      </div>

      {/* Premium EEAT Author Box */}
      <div id="blog-author-card" className="bg-slate-50 border border-gray-200/60 rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-inner mt-12">
        <Image
          src={authorAvatar}
          alt={authorName}
          width={64}
          height={64}
          className="rounded-full object-cover border-2 border-[#d97706]/40 shrink-0 shadow-sm"
        />
        <div className="space-y-2 flex-grow">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wide m-0">Người Đúc Kết: {authorName}</h4>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black border border-amber-200 font-mono uppercase">
              {authorRole}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-light leading-relaxed m-0">
            {authorBio} Tất cả bài viết đóng góp trên bảng tin đều trải qua khâu thẩm duyệt thực hành thủy sản an toàn Năm Căn Cà Mau.
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
  );
}
