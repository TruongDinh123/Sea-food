export interface Merchant {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  is_active: boolean;
  commission_type: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value: number;
  monthly_flat_rate: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type CreateMerchantInput = Omit<Merchant, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateMerchantInput = Partial<CreateMerchantInput>;
