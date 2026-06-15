import { MetadataRoute } from 'next';
import { productService, merchantService, blogService } from '@/lib/services';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Slug danh mục sản phẩm — cần đồng bộ với CATEGORY_META trong danh-muc/[slug]/page.tsx
const CATEGORY_SLUGS = ['cua-bien', 'tom-su', 'do-kho'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Trang tĩnh quan trọng
  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/san-pham`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/thuong-lai`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' },
  ];

  // Trang danh mục sản phẩm — Pyramid Level 2
  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url: `${baseUrl}/danh-muc/${slug}`,
    lastModified: new Date('2026-05-30'),
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  }));

  let productUrls: MetadataRoute.Sitemap = [];
  let merchantUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    const products = await productService.getAllProducts();
    productUrls = products.map((p) => ({
      url: `${baseUrl}/san-pham/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    }));
  } catch (e) {
    console.error('Error fetching products for sitemap:', e);
  }

  try {
    const merchants = await merchantService.getAllActiveMerchants();
    merchantUrls = merchants.map((m) => ({
      url: `${baseUrl}/thuong-lai/${slugify(m.name)}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    }));
  } catch (e) {
    console.error('Error fetching merchants for sitemap:', e);
  }

  try {
    const blogs = await blogService.getAllBlogs(true);
    blogUrls = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    }));
  } catch (e) {
    console.error('Error fetching blogs for sitemap:', e);
  }

  return [...staticUrls, ...categoryUrls, ...productUrls, ...merchantUrls, ...blogUrls];
}
