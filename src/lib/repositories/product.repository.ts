import { sql } from '../db/client';
import type { Product, ProductWithMerchant, CreateProductInput, UpdateProductInput } from '@/types/product.types';

export interface DBProductRow {
  id: number;
  merchant_id: number;
  name: string;
  slug: string;
  price: string | number;
  original_price: string | number | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  is_auto_listed: boolean;
  specific_commission_rate: string | number | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
  merchant_name?: string;
}

// Helper to convert database row types to application Product types
function mapRow(row: DBProductRow): Product {
  return {
    id: row.id,
    merchant_id: row.merchant_id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    original_price: row.original_price ? Number(row.original_price) : null,
    category: row.category,
    description: row.description,
    image_url: row.image_url,
    is_auto_listed: row.is_auto_listed,
    specific_commission_rate: row.specific_commission_rate ? Number(row.specific_commission_rate) : null,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export const ProductRepository = {
  findAll: async (options?: { 
    merchantId?: number; 
    category?: string; 
    isAutoListed?: boolean;
    limit?: number; 
    offset?: number; 
  }): Promise<Product[]> => {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const rows = await sql`
      SELECT 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
      FROM products
      WHERE deleted_at IS NULL
      ${options?.merchantId !== undefined ? sql`AND merchant_id = ${options.merchantId}` : sql``}
      ${options?.category !== undefined ? sql`AND category = ${options.category}` : sql``}
      ${options?.isAutoListed !== undefined ? sql`AND is_auto_listed = ${options.isAutoListed}` : sql``}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return (rows as unknown as DBProductRow[]).map(mapRow);
  },

  findById: async (id: number): Promise<Product | null> => {
    const rows = await sql`
      SELECT 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
      FROM products
      WHERE id = ${id} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) return null;
    return mapRow(rows[0] as unknown as DBProductRow);
  },

  findBySlug: async (slug: string): Promise<Product | null> => {
    const rows = await sql`
      SELECT 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
      FROM products
      WHERE slug = ${slug} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) return null;
    return mapRow(rows[0] as unknown as DBProductRow);
  },

  findBySlugPrefix: async (prefix: string): Promise<Product[]> => {
    const rows = await sql`
      SELECT 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
      FROM products
      WHERE slug LIKE ${prefix + '%'} AND deleted_at IS NULL
      ORDER BY price ASC
    `;

    return (rows as unknown as DBProductRow[]).map(mapRow);
  },

  count: async (options?: { 
    merchantId?: number; 
    category?: string;
    isAutoListed?: boolean;
  }): Promise<number> => {
    const rows = await sql`
      SELECT COUNT(*)::int as total
      FROM products
      WHERE deleted_at IS NULL
      ${options?.merchantId !== undefined ? sql`AND merchant_id = ${options.merchantId}` : sql``}
      ${options?.category !== undefined ? sql`AND category = ${options.category}` : sql``}
      ${options?.isAutoListed !== undefined ? sql`AND is_auto_listed = ${options.isAutoListed}` : sql``}
    `;
    return rows[0]?.total ?? 0;
  },

  findAllWithMerchant: async (options?: {
    merchantId?: number;
    category?: string;
    isAutoListed?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ProductWithMerchant[]> => {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const rows = await sql`
      SELECT 
        p.id, p.merchant_id, p.name, p.slug, p.price, p.original_price, 
        p.category, p.description, p.image_url, p.is_auto_listed, 
        p.specific_commission_rate, p.created_at, p.updated_at, p.deleted_at,
        m.name as merchant_name
      FROM products p
      INNER JOIN merchants m ON p.merchant_id = m.id
      WHERE p.deleted_at IS NULL AND m.deleted_at IS NULL AND m.is_active = true
      ${options?.merchantId !== undefined ? sql`AND p.merchant_id = ${options.merchantId}` : sql``}
      ${options?.category !== undefined ? sql`AND p.category = ${options.category}` : sql``}
      ${options?.isAutoListed !== undefined ? sql`AND p.is_auto_listed = ${options.isAutoListed}` : sql``}
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return (rows as unknown as DBProductRow[]).map((row) => ({
      ...mapRow(row),
      merchant_name: row.merchant_name || '',
    }));
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const rows = await sql`
      INSERT INTO products (
        merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate
      )
      VALUES (
        ${data.merchant_id}, ${data.name}, ${data.slug}, ${data.price}, ${data.original_price}, 
        ${data.category}, ${data.description}, ${data.image_url}, ${data.is_auto_listed}, 
        ${data.specific_commission_rate}
      )
      RETURNING 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
    `;

    return mapRow(rows[0] as unknown as DBProductRow);
  },

  update: async (id: number, data: UpdateProductInput): Promise<Product | null> => {
    const current = await ProductRepository.findById(id);
    if (!current) return null;

    const merchant_id = data.merchant_id ?? current.merchant_id;
    const name = data.name ?? current.name;
    const slug = data.slug ?? current.slug;
    const price = data.price !== undefined ? data.price : current.price;
    const original_price = data.original_price !== undefined ? data.original_price : current.original_price;
    const category = data.category !== undefined ? data.category : current.category;
    const description = data.description !== undefined ? data.description : current.description;
    const image_url = data.image_url !== undefined ? data.image_url : current.image_url;
    const is_auto_listed = data.is_auto_listed !== undefined ? data.is_auto_listed : current.is_auto_listed;
    const specific_commission_rate = data.specific_commission_rate !== undefined ? data.specific_commission_rate : current.specific_commission_rate;

    const rows = await sql`
      UPDATE products
      SET 
        merchant_id = ${merchant_id},
        name = ${name},
        slug = ${slug},
        price = ${price},
        original_price = ${original_price},
        category = ${category},
        description = ${description},
        image_url = ${image_url},
        is_auto_listed = ${is_auto_listed},
        specific_commission_rate = ${specific_commission_rate},
        updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING 
        id, merchant_id, name, slug, price, original_price, 
        category, description, image_url, is_auto_listed, 
        specific_commission_rate, created_at, updated_at, deleted_at
    `;

    if (rows.length === 0) return null;
    return mapRow(rows[0] as unknown as DBProductRow);
  },

  softDelete: async (id: number): Promise<boolean> => {
    const rows = await sql`
      UPDATE products
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
};
