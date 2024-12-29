export interface Cart {
  cart_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartItems {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  variant_id: number;
  name: string;
  size: string;
  quantity: number;
  price: number;
  stock_quantity: number;
}
