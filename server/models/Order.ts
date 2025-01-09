export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderData {
  order_id: number;
  user_id: number | null;
  guest_id?: number | null;
  total_price: number;
  first_name: string;
  last_name: string;
  shipping_address: string;
  postal_code: string;
  city: string;
  status?: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}
