// Define common types used across order components

export interface Order {
  id?: string;
  order_number: string;
  date: string;
  num_products: number;
  final_price: number;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface OrderProduct {
  product_id: string;
  quantity: number;
}
