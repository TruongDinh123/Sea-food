import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService, merchantService } from "@/lib/services";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import ProductDetailClient from "./ProductDetailClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const product = await productService.getProductBySlug(slug);
    return {
      title: `${product.name} - Hải Sản Cao Cấp`,
      description: product.description || `Mua ngay ${product.name} chất lượng cao trực tiếp từ thương lái uy tín.`,
      alternates: {
        canonical: `/san-pham/${slug}`,
      },
      openGraph: {
        title: `${product.name} - Hải Sản Cao Cấp`,
        description: product.description || `Mua ngay ${product.name} chất lượng cao trực tiếp từ thương lái uy tín.`,
        type: "website",
        url: `/san-pham/${slug}`,
        images: product.image_url ? [product.image_url] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - Hải Sản Cao Cấp`,
        description: product.description || `Mua ngay ${product.name} chất lượng cao trực tiếp từ thương lái uy tín.`,
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

  // Lấy sản vật liên đới (cùng danh mục)
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

  // JSON-LD Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || "",
    "sku": `PROD-${product.id}`,
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "VND",
      "price": product.price,
      "availability": "https://schema.org/InStock",
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
