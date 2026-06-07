export interface ReferralLog {
  id: number;
  product_id: number;
  merchant_id: number;
  buyer_phone: string | null;
  order_value: number | null;
  calculated_commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  order_id: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateReferralLogInput {
  product_id: number;
  merchant_id: number;
  buyer_phone?: string | null;
  order_value?: number | null;
  calculated_commission: number;
  status?: 'pending' | 'completed' | 'cancelled';
  order_id?: number | null;
}
