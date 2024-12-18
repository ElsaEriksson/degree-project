export interface Cart {
  cart_id: number;
  user_id: number;
  guest_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItems {
  cart_item_id: number;
  cart_id: number;
  variant_id: number;
  quantity: number;
}
