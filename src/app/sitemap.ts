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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticUrls = [
    { url: baseUrl, lastModified: new Date('2026-05-30') },
    { url: `${baseUrl}/san-pham`, lastModified: new Date('2026-05-30') },
    { url: `${baseUrl}/thuong-lai`, lastModified: new Date('2026-05-30') },
    { url: `${baseUrl}/blog`, lastModified: new Date('2026-05-30') },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date('2026-05-30') },
  ];

  let productUrls: { url: string; lastModified: Date }[] = [];
  let merchantUrls: { url: string; lastModified: Date }[] = [];
  let blogUrls: { url: string; lastModified: Date }[] = [];

  try {
    const products = await productService.getAllProducts();
    productUrls = products.map((p) => ({
      url: `${baseUrl}/san-pham/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    }));
  } catch (e) {
    console.error('Error fetching products for sitemap:', e);
  }

  try {
    const merchants = await merchantService.getAllActiveMerchants();
    merchantUrls = merchants.map((m) => ({
      url: `${baseUrl}/thuong-lai/${slugify(m.name)}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    }));
  } catch (e) {
    console.error('Error fetching merchants for sitemap:', e);
  }

  try {
    const blogs = await blogService.getAllBlogs(true);
    blogUrls = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    }));
  } catch (e) {
    console.error('Error fetching blogs for sitemap:', e);
  }

  return [...staticUrls, ...productUrls, ...merchantUrls, ...blogUrls];
}
