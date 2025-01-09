export interface OrderData {
  order_id?: number;
  user_id?: number | null;
  guest_id?: number | null;
  cart_id?: number | null;
  total_price: number | string;
  first_name: string;
  last_name: string;
  phone_number: string;
  shipping_address: string;
  postal_code: string;
  city: string;
  email: string;
}

export interface OrderItem {
  order_items_id?: number;
  order_id?: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}

export interface OrderDataFromDatabase {
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
  items: OrderItemFromDatabase[];
}

export interface OrderItemFromDatabase {
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}
