export interface CartItems {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  variant_id: number;
  name: string;
  size: string;
  quantity: number;
  price: number | string;
  stock_quantity: number;
  main_image: string;
}
