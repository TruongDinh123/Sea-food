import postgres from 'postgres';
import sql from '../db/index';
import { Order, OrderItem } from '../../types/order.types';

interface DbOrder {
  id: number;
  merchant_id: number;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  order_value: string | number;
  buyer_name?: string;
  buyer_phone?: string;
  buyer_address?: string;
  payment_method?: string;
  notes?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

interface DbOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  created_at: string | Date;
  updated_at: string | Date;
}

export class OrderRepository {
  private mapOrderRow(row: DbOrder): Order {
    return {
      id: row.id,
      merchant_id: row.merchant_id,
      status: row.status,
      order_value: Number(row.order_value),
      buyer_name: row.buyer_name,
      buyer_phone: row.buyer_phone,
      buyer_address: row.buyer_address,
      payment_method: row.payment_method,
      notes: row.notes ?? null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  private mapOrderItemRow(row: DbOrderItem): OrderItem {
    return {
      id: row.id,
      order_id: row.order_id,
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: Number(row.unit_price),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  async findById(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Order | null> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM orders
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    if (rows.length === 0) return null;
    return this.mapOrderRow(rows[0] as DbOrder);
  }

  async findByMerchantId(merchantId: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<Order[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM orders
      WHERE merchant_id = ${merchantId} AND deleted_at IS NULL
      ORDER BY id DESC
    `;
    return rows.map((row) => this.mapOrderRow(row as DbOrder));
  }

  async create(
    merchantId: number,
    orderValue: number,
    status: Order['status'] = 'pending',
    buyerName?: string,
    buyerPhone?: string,
    buyerAddress?: string,
    paymentMethod?: string,
    notes?: string | null,
    tx?: postgres.Sql | postgres.TransactionSql
  ): Promise<Order> {
    const client = tx || sql;
    const data: Record<string, string | number | Date | null | undefined> = {
      merchant_id: merchantId,
      status,
      order_value: orderValue,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (buyerName !== undefined) data.buyer_name = buyerName;
    if (buyerPhone !== undefined) data.buyer_phone = buyerPhone;
    if (buyerAddress !== undefined) data.buyer_address = buyerAddress;
    if (paymentMethod !== undefined) data.payment_method = paymentMethod;
    if (notes !== undefined) data.notes = notes;

    const rows = await client`
      INSERT INTO orders ${client(data)}
      RETURNING *
    `;
    return this.mapOrderRow(rows[0] as DbOrder);
  }

  async createItem(orderId: number, productId: number, quantity: number, unitPrice: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<OrderItem> {
    const client = tx || sql;
    const data = {
      order_id: orderId,
      product_id: productId,
      quantity,
      unit_price: unitPrice,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const rows = await client`
      INSERT INTO order_items ${client(data)}
      RETURNING *
    `;
    return this.mapOrderItemRow(rows[0] as DbOrderItem);
  }

  async findItemsByOrderId(orderId: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<OrderItem[]> {
    const client = tx || sql;
    const rows = await client`
      SELECT * FROM order_items
      WHERE order_id = ${orderId}
      ORDER BY id ASC
    `;
    return rows.map((row) => this.mapOrderItemRow(row as DbOrderItem));
  }

  async updateStatus(id: number, status: Order['status'], tx?: postgres.Sql | postgres.TransactionSql): Promise<Order | null> {
    const client = tx || sql;
    const rows = await client`
      UPDATE orders
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return this.mapOrderRow(rows[0] as DbOrder);
  }

  async softDelete(id: number, tx?: postgres.Sql | postgres.TransactionSql): Promise<boolean> {
    const client = tx || sql;
    const rows = await client`
      UPDATE orders
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}

