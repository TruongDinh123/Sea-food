import postgres from 'postgres';
import sql from '../db/index';
import { Merchant, CreateMerchantInput, UpdateMerchantInput } from '../../types/merchant.types';

interface DbMerchant {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  is_active: boolean;
  commission_type: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value: string | number;
  monthly_flat_rate: string | number;
  user_id: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export class MerchantRepository {
  private mapRow(row: DbMerchant): Merchant {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      address: row.address,
      is_active: row.is_active,
      commission_type: row.commission_type,
      commission_value: Number(row.commission_value),
      monthly_flat_rate: Number(row.monthly_flat_rate),
      user_id: row.user_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  async findById(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Merchant | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM merchants
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbMerchant);
  }

  async findByUserId(userId: string, tx?: postgres.Sql | postgres.TransactionSql): Promise<Merchant | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM merchants
      WHERE user_id = ${userId} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbMerchant);
  }

  async findAll(tx?: postgres.Sql | postgres.TransactionSql): Promise<Merchant[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM merchants
      WHERE deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapRow(row as DbMerchant));
  }

  async create(input: CreateMerchantInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Merchant> {
    const client = tx || sql;
    const data = {
      name: input.name,
      phone: input.phone,
      address: input.address ?? null,
      is_active: input.is_active ?? true,
      commission_type: input.commission_type ?? 'percentage',
      commission_value: input.commission_value ?? 5.00,
      monthly_flat_rate: input.monthly_flat_rate ?? 0.00,
      user_id: input.user_id ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rows = await client`
      INSERT INTO merchants ${client(data)}
      RETURNING *
    `;
    return this.mapRow(rows[0] as DbMerchant);
  }

  async update(id: number, input: UpdateMerchantInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<Merchant | null> {
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
      UPDATE merchants
      SET ${client(updateData, columns)}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;

    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbMerchant);
  }

  async softDelete(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<boolean> {
    const client = tx || sql;
    const rows = await client`
      UPDATE merchants
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}


