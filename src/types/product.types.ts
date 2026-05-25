export interface Product {
  id: number;
  merchant_id: number;
  name: string;
  slug: string;
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

export interface ProductWithMerchant extends Product {
  merchant_name: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateProductInput = Partial<CreateProductInput>;
