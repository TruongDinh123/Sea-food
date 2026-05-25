export interface ReferralLog {
  id: number;
  product_id: number;
  merchant_id: number;
  buyer_phone: string | null;
  order_value: number | null;
  calculated_commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type CreateReferralLogInput = Omit<ReferralLog, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateReferralLogInput = Partial<CreateReferralLogInput>;
