import postgres from 'postgres';
import sql from '../db/index';
import { ReferralLog, CreateReferralLogInput } from '../../types/referral.types';

interface DbReferralLog {
  id: number;
  product_id: number;
  merchant_id: number;
  buyer_phone: string | null;
  order_value: string | number | null;
  calculated_commission: string | number;
  status: 'pending' | 'completed' | 'cancelled';
  order_id: number | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export class ReferralRepository {
  private mapRow(row: DbReferralLog): ReferralLog {
    return {
      id: row.id,
      product_id: row.product_id,
      merchant_id: row.merchant_id,
      buyer_phone: row.buyer_phone,
      order_value: row.order_value ? Number(row.order_value) : null,
      calculated_commission: Number(row.calculated_commission),
      status: row.status,
      order_id: row.order_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  async findById(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM referral_logs
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbReferralLog);
  }

  async findByOrderId(orderId: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM referral_logs
      WHERE order_id = ${orderId} AND deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapRow(row as DbReferralLog));
  }

  async findByMerchantId(merchantId: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM referral_logs
      WHERE merchant_id = ${merchantId} AND deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapRow(row as DbReferralLog));
  }

  async create(input: CreateReferralLogInput, tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog> {
    const client = tx || sql;
    const data = {
      product_id: input.product_id,
      merchant_id: input.merchant_id,
      buyer_phone: input.buyer_phone ?? null,
      order_value: input.order_value ?? null,
      calculated_commission: input.calculated_commission,
      status: input.status ?? 'pending',
      order_id: input.order_id ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rows = await client`
      INSERT INTO referral_logs ${client(data)}
      RETURNING *
    `;
    return this.mapRow(rows[0] as DbReferralLog);
  }

  async updateStatus(id: number, status: 'pending' | 'completed' | 'cancelled', tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog | null> {
    const client = tx || sql;
    const rows = await client`
      UPDATE referral_logs
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return this.mapRow(rows[0] as DbReferralLog);
  }

  async updateStatusByOrderId(orderId: number, status: 'pending' | 'completed' | 'cancelled', tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog[]> {
    const client = tx || sql;
    const rows = await client`
      UPDATE referral_logs
      SET status = ${status}, updated_at = NOW()
      WHERE order_id = ${orderId} AND deleted_at IS NULL
      RETURNING *
    `;
    return rows.map((row) => this.mapRow(row as DbReferralLog));
  }

  async findAll(tx?: postgres.Sql | postgres.TransactionSql): Promise<ReferralLog[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT
        id, product_id, merchant_id, buyer_phone,
        order_value, calculated_commission, status,
        order_id, created_at, updated_at, deleted_at
      FROM referral_logs
      WHERE deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapRow(row as DbReferralLog));
  }

  async softDelete(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<boolean> {
    const client = tx || sql;
    const rows = await client`
      UPDATE referral_logs
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}

