export interface OrderData {
  user_id?: number;
  cart_id: number;
  total_price: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  shipping_address: string;
  postal_code: string;
  city: string;
  email: string;
}

export interface OrderItems {
  order_items_id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}
