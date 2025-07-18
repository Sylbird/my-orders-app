import type { Order, OrderProduct, Product } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};

export const fetchOrderByID = async (id: number): Promise<Order> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API}/orders/${id}`
  );
  if (!response.ok) throw new Error('Failed to fetch order');
  return await response.json();
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
};

export const fetchProductsForOrder = async (
  id: number
): Promise<OrderProduct[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API}/order_products?order_id=${id}`
  );
  if (!response.ok) throw new Error('Failed to fetch order products');
  return await response.json();
};
