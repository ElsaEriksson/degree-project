export interface OrderData {
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

export interface OrderItems {
  order_items_id?: number;
  order_id?: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}
