import type { MetadataRoute } from 'next'
import { ProductService } from '@/lib/services/product.service'
import { MerchantService } from '@/lib/services/merchant.service'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://haisancamau.vn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/thuong-lai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/danh-muc/tom-su`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/danh-muc/cua-bien`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/danh-muc/hai-san-kho`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ve-chung-toi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic product pages
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: products } = await ProductService.getPublicProducts({ page: 1, limit: 500 })
    productRoutes = products.map((product) => ({
      url: `${BASE_URL}/san-pham/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Fail gracefully nếu DB không kết nối được lúc build
  }

  // Dynamic merchant pages
  let merchantRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: merchants } = await MerchantService.getPublicMerchants(1, 500)
    merchantRoutes = merchants.map((merchant) => ({
      url: `${BASE_URL}/thuong-lai/${merchant.id}`,
      lastModified: new Date(merchant.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // Fail gracefully nếu DB không kết nối được lúc build
  }

  // Dynamic blog pages
  const blogSlugs = [
    'bi-quyet-chon-cua-bien-ca-mau-ngon-chac-thit',
    'cach-che-bien-tom-su-hap-nuoc-dua-chuan-vi-mien-tay',
    'bao-quan-tom-kho-dat-cam-mau-dung-cach-tai-nha',
  ]
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...merchantRoutes, ...blogRoutes]
}
