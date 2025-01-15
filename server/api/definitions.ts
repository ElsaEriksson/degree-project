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

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

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
  status?: OrderStatus;
  created_at: string;
  items: DetailedOrderItem[];
}

export interface OrderItem {
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}

interface DetailedOrderItem {
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface Product {
  product_id: number;
  name: string;
  main_image: string;
  video: string;
  additional_image: string;
  collection_id: number;
  collection_name?: string;
  price: number;
  description_short: string;
  description_long: string;
  material: string;
  gender: string;
  season: string;
}

export interface Variant {
  variant_id: number;
  product_id: number;
  size: string;
  stock_quantity: number;
}

export interface ProductWithVariants extends Product {
  variants: { variant_id: number; size: string; stock_quantity: number }[];
}

export interface Collection {
  collection_id: number;
  name: string;
  description: string;
  image: string;
}

export interface Color {
  color_id: number;
  product_id: number;
  name: string;
  hex_code: string;
}

export interface Flag {
  flag_id: number;
  product_id: number;
  flag_type: string;
  created_at: string;
}
