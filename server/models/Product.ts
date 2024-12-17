export interface Product {
  product_id: number;
  name: string;
  mainImage: string;
  video: string;
  additionalImage?: string;
  category_id: number;
  price: number;
  salePrice: number;
  description_short: string;
  description_long: string;
  material: string;
  gender: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  variant_id: number;
  product_id: number;
  size: string;
  stock_quantity: number;
}

export interface Collection {
  collection_id: number;
  name: string;
  description_short: string;
  description_long: string;
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
