export interface Order {
  id: number;
  merchant_id: number;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  order_value: number;
  buyer_name?: string;
  buyer_phone?: string;
  buyer_address?: string;
  payment_method?: string;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateOrderItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderInput {
  merchant_id: number;
  status?: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  order_value?: number; // Optional if calculated from items in service layer
  buyer_name?: string;
  buyer_phone?: string;
  buyer_address?: string;
  payment_method?: string;
  notes?: string | null;
  items: CreateOrderItemInput[];
}
