import { sql } from '../db/client';
import type { Merchant, CreateMerchantInput, UpdateMerchantInput } from '@/types/merchant.types';

export interface DBMerchantRow {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  is_active: boolean;
  commission_type: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value: string | number;
  monthly_flat_rate: string | number;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

// Helper to convert database row types to application Merchant types
function mapRow(row: DBMerchantRow): Merchant {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    is_active: row.is_active,
    commission_type: row.commission_type,
    commission_value: Number(row.commission_value),
    monthly_flat_rate: Number(row.monthly_flat_rate),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

export const MerchantRepository = {
  findAll: async (options?: { 
    isActive?: boolean; 
    limit?: number; 
    offset?: number; 
  }): Promise<Merchant[]> => {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const rows = await sql`
      SELECT 
        id, name, phone, address, is_active, 
        commission_type, commission_value, monthly_flat_rate,
        created_at, updated_at, deleted_at
      FROM merchants
      WHERE deleted_at IS NULL
      ${options?.isActive !== undefined ? sql`AND is_active = ${options.isActive}` : sql``}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return (rows as unknown as DBMerchantRow[]).map(mapRow);
  },

  findById: async (id: number): Promise<Merchant | null> => {
    const rows = await sql`
      SELECT 
        id, name, phone, address, is_active, 
        commission_type, commission_value, monthly_flat_rate,
        created_at, updated_at, deleted_at
      FROM merchants
      WHERE id = ${id} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) return null;
    return mapRow(rows[0] as unknown as DBMerchantRow);
  },

  count: async (options?: { isActive?: boolean }): Promise<number> => {
    const rows = await sql`
      SELECT COUNT(*)::int as total
      FROM merchants
      WHERE deleted_at IS NULL
      ${options?.isActive !== undefined ? sql`AND is_active = ${options.isActive}` : sql``}
    `;
    return rows[0]?.total ?? 0;
  },

  create: async (data: CreateMerchantInput): Promise<Merchant> => {
    const rows = await sql`
      INSERT INTO merchants (
        name, phone, address, is_active, 
        commission_type, commission_value, monthly_flat_rate
      )
      VALUES (
        ${data.name}, ${data.phone}, ${data.address}, ${data.is_active}, 
        ${data.commission_type}, ${data.commission_value}, ${data.monthly_flat_rate}
      )
      RETURNING 
        id, name, phone, address, is_active, 
        commission_type, commission_value, monthly_flat_rate,
        created_at, updated_at, deleted_at
    `;

    return mapRow(rows[0] as unknown as DBMerchantRow);
  },

  update: async (id: number, data: UpdateMerchantInput): Promise<Merchant | null> => {
    // Lấy bản ghi hiện tại để kiểm tra
    const current = await MerchantRepository.findById(id);
    if (!current) return null;

    // Chuẩn bị dữ liệu cập nhật
    const name = data.name ?? current.name;
    const phone = data.phone ?? current.phone;
    const address = data.address !== undefined ? data.address : current.address;
    const is_active = data.is_active !== undefined ? data.is_active : current.is_active;
    const commission_type = data.commission_type ?? current.commission_type;
    const commission_value = data.commission_value !== undefined ? data.commission_value : current.commission_value;
    const monthly_flat_rate = data.monthly_flat_rate !== undefined ? data.monthly_flat_rate : current.monthly_flat_rate;

    const rows = await sql`
      UPDATE merchants
      SET 
        name = ${name},
        phone = ${phone},
        address = ${address},
        is_active = ${is_active},
        commission_type = ${commission_type},
        commission_value = ${commission_value},
        monthly_flat_rate = ${monthly_flat_rate},
        updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING 
        id, name, phone, address, is_active, 
        commission_type, commission_value, monthly_flat_rate,
        created_at, updated_at, deleted_at
    `;

    if (rows.length === 0) return null;
    return mapRow(rows[0] as unknown as DBMerchantRow);
  },

  softDelete: async (id: number): Promise<boolean> => {
    const rows = await sql`
      UPDATE merchants
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
};
