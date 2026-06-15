/**
 * cached-queries.ts
 * Memoize các DB calls tốn kém bằng React cache() để tránh duplicate requests
 * trong cùng một render cycle (giữa generateMetadata và page component).
 *
 * Theo chuẩn NotebookLM: "Next.js automatically memoizes fetch requests —
 * you can call the same API inside generateMetadata and your page component
 * without triggering duplicate network calls."
 */
import { cache } from 'react';
import { productService, merchantService, blogService } from '@/lib/services';

// ─── Products ────────────────────────────────────────────────────────────────

/** Lấy sản phẩm theo slug — memoized trong 1 render cycle */
export const getProductBySlug = cache(
  async (slug: string) => productService.getProductBySlug(slug)
);

/** Lấy tất cả sản phẩm — memoized trong 1 render cycle */
export const getAllProducts = cache(
  async (filters?: Parameters<typeof productService.getAllProducts>[0]) =>
    productService.getAllProducts(filters)
);

// ─── Merchants ────────────────────────────────────────────────────────────────

/** Lấy tất cả thương lái đang hoạt động — memoized trong 1 render cycle */
export const getAllActiveMerchants = cache(
  async () => merchantService.getAllActiveMerchants()
);

/** Lấy thương lái theo ID — memoized trong 1 render cycle */
export const getMerchantById = cache(
  async (id: number) => merchantService.getMerchantById(id)
);

// ─── Blogs ────────────────────────────────────────────────────────────────────

/** Lấy bài viết theo slug — memoized trong 1 render cycle */
export const getBlogBySlug = cache(
  async (slug: string) => blogService.getBlogBySlug(slug)
);
