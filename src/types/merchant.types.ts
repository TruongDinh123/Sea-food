export interface Merchant {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  is_active: boolean;
  commission_type: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value: number;
  monthly_flat_rate: number;
  user_id: string | null; // UUID
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateMerchantInput {
  name: string;
  phone: string;
  address?: string | null;
  is_active?: boolean;
  commission_type?: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value?: number;
  monthly_flat_rate?: number;
  user_id?: string | null;
}

export interface UpdateMerchantInput {
  name?: string;
  phone?: string;
  address?: string | null;
  is_active?: boolean;
  commission_type?: 'percentage' | 'fixed' | 'monthly_flat';
  commission_value?: number;
  monthly_flat_rate?: number;
  user_id?: string | null;
}
