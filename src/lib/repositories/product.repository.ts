import postgres from 'postgres';
import sql from '../db/index';
import { Product, CreateProductInput, UpdateProductInput } from '../../types/product.types';

// Danh sách cột rõ ràng — tránh SELECT * theo quy tắc AGENTS.md
const PRODUCT_COLUMNS = sql`
  id, merchant_id, name, slug, meta_description, price, original_price,
  category, description, image_url, is_auto_listed, specific_commission_rate,
  focus_keyword, canonical_url, description_detail,
  created_at, updated_at, deleted_at
`;

interface DbProduct {
  id: number;
  merchant_id: number;
  name: string;
  slug: string;
  meta_description: string | null;
  price: string | number;
  original_price: string | number | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  is_auto_listed: boolean;
  specific_commission_rate: string | number | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  description_detail: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export class ProductRepository {
  private mapRow(row: DbProduct): Product {
    return {
      id: row.id,
      merchant_id: row.merchant_id,
      name: row.name,
      slug: row.slug,
      meta_description: row.meta_description,
      price: Number(row.price),
      original_price: row.original_price ? Number(row.original_price) : null,
      category: row.category,
      description: row.description,
      image_url: row.image_url,
      is_auto_listed: row.is_auto_listed,
      specific_commission_rate: row.specific_commission_rate ? Number(row.specific_commission_rate) : null,
      focus_keyword: row.focus_keyword ?? null,
      canonical_url: row.canonical_url ?? null,
      description_detail: row.description_detail ?? null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  async findById(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT ${PRODUCT_COLUMNS} FROM products
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbProduct);
  }

  async findBySlug(slug: string, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT ${PRODUCT_COLUMNS} FROM products
      WHERE slug = ${slug} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbProduct);
  }

  async findByMerchantId(merchantId: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT ${PRODUCT_COLUMNS} FROM products
      WHERE merchant_id = ${merchantId} AND deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapRow(row as DbProduct));
  }

  async findAll(filters?: { category?: string; merchantId?: number }, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product[]> {
    const client = tx || sql;
    let rows;
    if (filters?.category && filters?.merchantId) {
      rows = await client`
        SELECT ${PRODUCT_COLUMNS} FROM products
        WHERE category = ${filters.category} AND merchant_id = ${filters.merchantId} AND deleted_at IS NULL
        ORDER BY id DESC
      `;
    } else if (filters?.category) {
      rows = await client`
        SELECT ${PRODUCT_COLUMNS} FROM products
        WHERE category = ${filters.category} AND deleted_at IS NULL
        ORDER BY id DESC
      `;
    } else if (filters?.merchantId) {
      rows = await client`
        SELECT ${PRODUCT_COLUMNS} FROM products
        WHERE merchant_id = ${filters.merchantId} AND deleted_at IS NULL
        ORDER BY id DESC
      `;
    } else {
      rows = await client`
        SELECT ${PRODUCT_COLUMNS} FROM products
        WHERE deleted_at IS NULL
        ORDER BY id DESC
      `;
    }
    return rows.map((row) => this.mapRow(row as DbProduct));
  }

  async create(input: CreateProductInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product> {
    const client = tx || sql;
    const data = {
      merchant_id: input.merchant_id,
      name: input.name,
      slug: input.slug,
      meta_description: input.meta_description ?? null,
      price: input.price,
      original_price: input.original_price ?? null,
      category: input.category ?? null,
      description: input.description ?? null,
      image_url: input.image_url ?? null,
      is_auto_listed: input.is_auto_listed ?? true,
      specific_commission_rate: input.specific_commission_rate ?? null,
      focus_keyword: input.focus_keyword ?? null,
      canonical_url: input.canonical_url ?? null,
      description_detail: input.description_detail ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rows = await client`
      INSERT INTO products ${client(data)}
      RETURNING ${PRODUCT_COLUMNS}
    `;
    return this.mapRow(rows[0] as DbProduct);
  }

  async update(id: number, input: UpdateProductInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Product | null> {
    const client = tx || sql;
    const updateData: Record<string, postgres.ParameterOrJSON<never>> = {
      ...input,
      updated_at: new Date(),
    } as Record<string, postgres.ParameterOrJSON<never>>;

    const columns = Object.keys(updateData);
    if (columns.length === 0) {
      return this.findById(id, tx);
    }

    const rows = await client`
      UPDATE products
      SET ${client(updateData, columns)}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING ${PRODUCT_COLUMNS}
    `;

    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbProduct);
  }

  async softDelete(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<boolean> {
    const client = tx || sql;
    const rows = await client`
      UPDATE products
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}
