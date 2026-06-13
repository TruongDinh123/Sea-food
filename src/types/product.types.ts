export interface Product {
  id: number;
  merchant_id: number;
  name: string;
  slug: string;
  meta_description: string | null;
  price: number;
  original_price: number | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  is_auto_listed: boolean;
  specific_commission_rate: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateProductInput {
  merchant_id: number;
  name: string;
  slug: string;
  meta_description?: string | null;
  price: number;
  original_price?: number | null;
  category?: string | null;
  description?: string | null;
  image_url?: string | null;
  is_auto_listed?: boolean;
  specific_commission_rate?: number | null;
}

export interface UpdateProductInput {
  merchant_id?: number;
  name?: string;
  slug?: string;
  meta_description?: string | null;
  price?: number;
  original_price?: number | null;
  category?: string | null;
  description?: string | null;
  image_url?: string | null;
  is_auto_listed?: boolean;
  specific_commission_rate?: number | null;
}
