export interface OrderData {
  order_id: number;
  user_id: number | null;
  guest_id: number | null;
  total_price: number;
  first_name: string;
  last_name: string;
  shipping_address: string;
  postal_code: string;
  city: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}
