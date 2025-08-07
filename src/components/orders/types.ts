export interface Order {
  id?: number;
  order_number: string;
  date: string;
  num_products: number;
  final_price: number;
}

export interface Product {
  id: number;
  name: string;
  unit_price: number;
}

export interface OrderProduct {
  order_id?: number;
  product_id: number;
  name?: string;
  unit_price?: number;
  quantity: number;
  total_price: number;
}
