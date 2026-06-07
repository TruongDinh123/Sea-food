import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { merchantService, productService } from "@/lib/services";
import { enrichProduct, enrichMerchant } from "@/lib/utils/enrichment";
import { slugify } from "@/app/sitemap";
import MerchantProfileClient from "./MerchantProfileClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const merchants = await merchantService.getAllActiveMerchants();
  const rawMerchant = merchants.find((m) => slugify(m.name) === slug);

  if (!rawMerchant) {
    return {
      title: "Không Tìm Thấy Thương Lái | Hải Sản Cao Cấp",
    };
  }

  const merchant = enrichMerchant(rawMerchant);
  const description = `Gian hàng chính thức của ${merchant.name} tại Cà Mau. Chuyên cung cấp hải sản tươi sống, cua biển, tôm sú sinh thái và đặc sản khô chất lượng cao trực tiếp từ vựa.`;

  return {
    title: `${merchant.name} - Thương Lái Hải Sản Cà Mau | Hải Sản Cao Cấp`,
    description,
    alternates: {
      canonical: `/thuong-lai/${slug}`,
    },
    openGraph: {
      title: `${merchant.name} - Thương Lái Hải Sản Cà Mau`,
      description,
      type: "profile",
      url: `/thuong-lai/${slug}`,
      images: merchant.avatar
        ? [{ url: merchant.avatar, width: 400, height: 400, alt: `Ảnh đại diện thương lái ${merchant.name}` }]
        : [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Hải Sản Cao Cấp Marketplace" }],
    },
    twitter: {
      card: "summary",
      title: `${merchant.name} - Thương Lái Hải Sản Cà Mau`,
      description,
      images: merchant.avatar ? [merchant.avatar] : ["/images/og-default.jpg"],
    }
  };
}

export default async function MerchantDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const merchants = await merchantService.getAllActiveMerchants();
  const rawMerchant = merchants.find((m) => slugify(m.name) === slug);

  if (!rawMerchant) {
    notFound();
  }

  // Làm giàu dữ liệu cho UI
  const merchant = enrichMerchant(rawMerchant);

  // Lấy các sản vật của thương lái này
  const rawProducts = await productService.getProductsByMerchant(merchant.id);
  const products = rawProducts.map(enrichProduct);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/thuong-lai/${slug}`;

  // JSON-LD LocalBusiness & Profile Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${canonicalUrl}#localbusiness`,
        "name": merchant.name,
        "telephone": merchant.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": merchant.address,
          "addressLocality": "Cà Mau",
          "addressCountry": "VN"
        },
        "url": canonicalUrl
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#profilepage`,
        "url": canonicalUrl,
        "mainEntity": {
          "@type": "Person",
          "name": merchant.name,
          "description": `Thương lái hải sản tại Cà Mau`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
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
            "name": "Thương lái",
            "item": `${baseUrl}/thuong-lai`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": merchant.name,
            "item": canonicalUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full">
      {/* Script JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb điều hướng */}
      <Breadcrumbs
        items={[
          { label: "Thương Lái", href: "/thuong-lai" },
          { label: merchant.name.split(" - ")[0] },
        ]}
        className="mb-4 px-1"
      />

      <MerchantProfileClient merchant={merchant} products={products} />
    </div>
  );
}
