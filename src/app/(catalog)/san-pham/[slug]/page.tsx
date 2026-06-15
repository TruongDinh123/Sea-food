import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services";
import { getProductBySlug, getMerchantById, getAllProducts } from "@/lib/utils/cached-queries";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import ProductDetailClient from "./ProductDetailClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render tất cả trang sản phẩm tại build time — Googlebot crawl nhanh hơn
export async function generateStaticParams() {
  try {
    const products = await productService.getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    // Dùng cached query — tự động memoize, không gửi duplicate request với page component
    const product = await getProductBySlug(slug);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Ư u tiên meta_description riêng biệt; fallback sang description; fallback cuối cùng sang generic
    const metaDesc =
      product.meta_description?.trim() ||
      (product.description ? product.description.slice(0, 155) + '...' : null) ||
      `Mua ngay ${product.name} chất lượng cao trực tiếp từ thương lái uy tín Cà Mau. Cam kết tươi sống, giao hàng tận nhà.`;

    const ogImage = product.image_url
      ? [{ url: product.image_url, width: 1200, height: 630, alt: product.name }]
      : [];

    return {
      title: `${product.name} | Giá Vựa Hôm Nay — Hải Sản Cao Cấp`,
      description: metaDesc,
      alternates: {
        canonical: product.canonical_url || `/san-pham/${slug}`,
      },
      openGraph: {
        title: `${product.name} — Giá Vựa Trực Tiếp`,
        description: metaDesc,
        url: `${baseUrl}/san-pham/${slug}`,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — Giá Vựa Trực Tiếp`,
        description: metaDesc,
        images: product.image_url ? [product.image_url] : [],
      }
    };
  } catch {
    return {
      title: "Không Tìm Thấy Sản Phẩm | Hải Sản Cao Cấp",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let dbProduct;
  let dbMerchant;

  try {
    // Cached — không gửi request mới nếu đã có trong generateMetadata
    dbProduct = await getProductBySlug(slug);
    dbMerchant = await getMerchantById(dbProduct.merchant_id);
  } catch {
    notFound();
  }

  // Làm giàu dữ liệu cho UI phống phú
  const product = enrichProduct(dbProduct);
  const merchant = enrichMerchant(dbMerchant);

  // Lấy sản phẩm liên quan (cùng danh mục)
  const categoryFilter = dbProduct.category || undefined;
  const categoryProducts = categoryFilter
    ? await getAllProducts({ category: categoryFilter })
    : [];
  const similarProducts = categoryProducts
    .filter(p => p.id !== dbProduct.id)
    .slice(0, 3)
    .map(enrichProduct);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/san-pham/${product.slug}`;

  // Tính ngày hiệu lực giá (30 ngày từ updated_at)
  const priceValidDate = new Date(product.updated_at);
  priceValidDate.setDate(priceValidDate.getDate() + 30);

  // JSON-LD Product Schema — Product + Offer + Brand
  // Ghi chú: aggregateRating đã xóa (data mock — chưa có review thực từ user)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
    "description": product.meta_description || product.description || "",
    "sku": `PROD-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": merchant.name.split(' - ')[0]
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "VND",
      "price": product.price,
      "priceValidUntil": priceValidDate.toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "LocalBusiness",
        "name": merchant.name,
        "address": merchant.address,
        "telephone": merchant.phone,
      }
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
        "name": "Sản phẩm",
        "item": `${baseUrl}/san-pham`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <div className="w-full">
      {/* JSON-LD injection */}
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
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.name },
        ]}
        className="mb-4 px-1"
      />

      {/* Thông tin sản phẩm (product card) */}
      <ProductDetailClient product={product} merchant={merchant} similarProducts={similarProducts} />

      {/* Mô tả chi tiết sản phẩm dưới dạng markdown */}
      {dbProduct.description_detail && (
        <section
          id="product-description-detail"
          className="max-w-3xl mx-auto mt-12 px-4 py-8 border-t border-gray-100"
        >
          <h2 className="text-xl font-black uppercase tracking-wide text-[#031e25] mb-6 border-l-4 border-[#d97706] pl-3">
            Giới Thiệu Sản Phẩm
          </h2>
          {/* Render HTML từ TipTap (không phải Markdown) */}
          <div
            className="prose prose-slate max-w-none text-sm md:text-base [&>h2]:text-xl [&>h2]:font-black [&>h2]:text-gray-900 [&>h2]:uppercase [&>h2]:tracking-tight [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#031e25] [&>h3]:uppercase [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:border-l-2 [&>h3]:border-[#d97706] [&>h3]:pl-2 [&>p]:text-slate-700 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:font-light [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:mb-4 [&>ul]:text-slate-700 [&>ul]:text-sm [&>ul]:font-light [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:mb-4 [&>ol]:text-slate-700 [&>ol]:text-sm [&>ol]:font-light [&>blockquote]:border-l-4 [&>blockquote]:border-amber-400 [&>blockquote]:bg-amber-50/40 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:text-sm [&_img]:w-full [&_img]:rounded-xl [&_img]:my-5 [&_img]:shadow-sm"
            dangerouslySetInnerHTML={{ __html: dbProduct.description_detail }}
          />
        </section>
      )}
    </div>
  );
}
