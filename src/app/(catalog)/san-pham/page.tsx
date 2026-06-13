import type { Metadata } from "next";
import { productService, merchantService } from "@/lib/services";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import CategoryClient from "./CategoryClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Bảng Giá Hải Sản Cà Mau Mới Nhất | Hải Sản Cao Cấp",
  description: "Bảng giá vựa chi tiết các loại cua biển Năm Căn, tôm sú sinh thái, tôm khô Vinh Kim, khô mực Phú Quốc. Mua trực tiếp thương lái, giao sống tận nhà.",
  alternates: {
    canonical: "/san-pham",
  },
  openGraph: {
    title: "Bảng Giá Hải Sản Cà Mau Mới Nhất | Hải Sản Cao Cấp",
    description: "Bảng giá vựa chi tiết các loại cua biển Năm Căn, tôm sú sinh thái, tôm khô Vinh Kim, khô mực Phú Quốc. Mua trực tiếp thương lái, giao sống tận nhà.",
    url: "/san-pham",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bảng Giá Hải Sản Cà Mau Mới Nhất | Hải Sản Cao Cấp",
    description: "Bảng giá vựa chi tiết các loại cua biển Năm Căn, tôm sú sinh thái, tôm khô Vinh Kim, khô mực Phú Quốc. Mua trực tiếp thương lái, giao sống tận nhà.",
  }
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    merchantId?: string;
    search?: string;
  }>;
}

export default async function ProductCatalogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { category, search } = resolvedSearchParams;

  // Lấy dữ liệu thô từ database
  const rawProducts = await productService.getAllProducts();
  const rawMerchants = await merchantService.getAllActiveMerchants();

  // Làm giàu dữ liệu cho giao diện premium
  const products = rawProducts.map(enrichProduct);
  const merchants = rawMerchants.map(enrichMerchant);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // ItemList JSON-LD — giúp Google hiểu đây là trang danh sách sản phẩm
  const itemListJsonLd = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Toàn Bộ Hải Sản Cao Cấp Cà Mau",
    "description": "Bảng giá vựa chi tiết các loại cua biển, tôm sú, đồ khô. Mua trực tiếp từ thương lái.",
    "url": `${baseUrl}/san-pham`,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${baseUrl}/san-pham/${p.slug}`,
      "name": p.name,
    })),
  } : null;

  return (
    <div className="w-full">
      {/* ItemList JSON-LD */}
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: 'Sản phẩm' }]} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#031e25] uppercase tracking-wide">
          Hải Sản Cao Cấp Cà Mau — Bảng Giá Sản Vật Đất Mũi
        </h1>
      </div>
      <CategoryClient 
        initialProducts={products} 
        merchants={merchants} 
        activeCategorySlug={category}
        initialSearchQuery={search}
      />
    </div>
  );
}
