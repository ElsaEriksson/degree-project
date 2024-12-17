export interface Order {
  order_id: number;
  user_id: number;
  cart_id: number;
  total_price: number;
  order_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItems {
  order_items_id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}
