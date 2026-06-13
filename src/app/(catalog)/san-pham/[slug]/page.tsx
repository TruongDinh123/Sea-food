import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService, merchantService } from "@/lib/services";
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
    const product = await productService.getProductBySlug(slug);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Ưu tiên meta_description riêng biệt; fallback sang description; fallback cuối cùng sang generic
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
        canonical: `/san-pham/${slug}`,
      },
      openGraph: {
        title: `${product.name} — Giá Vựa Trực Tiếp`,
        description: metaDesc,
        type: "website",
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
    dbProduct = await productService.getProductBySlug(slug);
    dbMerchant = await merchantService.getMerchantById(dbProduct.merchant_id);
  } catch {
    notFound();
  }

  // Làm giàu dữ liệu cho UI phong phú
  const product = enrichProduct(dbProduct);
  const merchant = enrichMerchant(dbMerchant);

  // Lấy sản phẩm liên quan (cùng danh mục)
  const categoryFilter = dbProduct.category || undefined;
  const categoryProducts = categoryFilter 
    ? await productService.getAllProducts({ category: categoryFilter }) 
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

  // JSON-LD Product Schema — nâng cao với aggregateRating, brand, priceValidUntil
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": product.reviewsCount
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

      <ProductDetailClient product={product} merchant={merchant} similarProducts={similarProducts} />
    </div>
  );
}
