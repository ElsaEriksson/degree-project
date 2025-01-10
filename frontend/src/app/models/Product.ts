export interface Product {
  product_id: number;
  name: string;
  main_image: string;
  video: string;
  additional_image?: string;
  collection_id: number;
  collection_name?: string;
  price: number;
  description_short: string;
  description_long: string;
  material: string;
  gender: string;
  season: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  variant_id: number;
  product_id?: number;
  size: string;
  stock_quantity: number;
}

export interface ProductWithVariants extends Product {
  variants: { variant_id: number; size: string; stock_quantity: number }[];
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
