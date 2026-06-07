import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService, merchantService } from "@/lib/services";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import CategoryClient from "../../san-pham/CategoryClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dữ liệu danh mục tập trung — single source of truth
const CATEGORY_META: Record<string, {
  name: string;
  description: string;
  ogImage: string;
  keywords: string;
}> = {
  'cua-bien': {
    name: 'Cua Biển Cà Mau',
    description: 'Cua biển Cà Mau tươi sống nguyên con, đánh bắt tự nhiên từ rừng ngập mặn Năm Căn. Cam kết cua chắc thịt, gạch đỏ au, giao sống tận nhà toàn quốc.',
    ogImage: '/images/products/cua-ca-mau.jpg',
    keywords: 'cua biển Cà Mau, cua gạch son, cua Năm Căn, mua cua tươi sống',
  },
  'tom-su': {
    name: 'Tôm Sú Quảng Canh',
    description: 'Tôm sú sinh thái rừng ngập mặn Cà Mau — nuôi quảng canh hoàn toàn tự nhiên, không hóa chất, thịt ngọt đậm. Đạt chuẩn xuất khẩu Nhật Bản, Châu Âu.',
    ogImage: '/images/og-default.jpg',
    keywords: 'tôm sú Cà Mau, tôm sú quảng canh, tôm sú sinh thái, mua tôm sú tươi',
  },
  'do-kho': {
    name: 'Đồ Khô Cao Cấp',
    description: 'Tôm khô Vinh Kim, khô mực câu Phú Quốc phơi nắng tự nhiên — đặc sản khô biển không tẩm ướp hóa chất, hương vị nguyên bản từ làng nghề truyền thống.',
    ogImage: '/images/og-default.jpg',
    keywords: 'tôm khô Vinh Kim, khô mực Phú Quốc, đồ khô hải sản, mua khô biển',
  },
};

const VALID_SLUGS = Object.keys(CATEGORY_META);

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) return { title: "Danh Mục Không Tồn Tại" };

  return {
    title: `${meta.name} Tươi Sống Sỉ & Lẻ | Hải Sản Cao Cấp Cà Mau`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/danh-muc/${slug}`,
    },
    openGraph: {
      title: `${meta.name} Tươi Sống — Mua Trực Tiếp Từ Vựa Thương Lái`,
      description: meta.description,
      url: `/danh-muc/${slug}`,
      type: "website",
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: `${meta.name} tươi sống chất lượng cao từ vựa Cà Mau`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} Tươi Sống Sỉ & Lẻ | Hải Sản Cao Cấp`,
      description: meta.description,
      images: [meta.ogImage],
    }
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];

  // 404 nếu slug không hợp lệ
  if (!meta) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/danh-muc/${slug}`;

  const rawProducts = await productService.getAllProducts();
  const rawMerchants = await merchantService.getAllActiveMerchants();

  const products = rawProducts.map(enrichProduct);
  const merchants = rawMerchants.map(enrichMerchant);

  // Lọc sản phẩm theo danh mục để dùng trong ItemList schema
  const categoryProducts = products.filter(p => p.category === slug).slice(0, 10);

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Sản phẩm", "item": `${baseUrl}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": meta.name, "item": canonicalUrl },
    ],
  };

  // ItemList JSON-LD — giúp Google hiểu đây là trang danh sách sản phẩm
  const itemListJsonLd = categoryProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${meta.name} — Hải Sản Cao Cấp`,
    "description": meta.description,
    "url": canonicalUrl,
    "numberOfItems": categoryProducts.length,
    "itemListElement": categoryProducts.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${baseUrl}/san-pham/${p.slug}`,
      "name": p.name,
    })),
  } : null;

  return (
    <div className="w-full">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      {/* ItemList JSON-LD */}
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: 'Sản phẩm', href: '/san-pham' },
            { label: meta.name },
          ]}
          className="mb-4"
        />
      </div>

      <CategoryClient
        initialProducts={products}
        merchants={merchants}
        activeCategorySlug={slug}
      />
    </div>
  );
}
