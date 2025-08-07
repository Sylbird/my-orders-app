import type { Order, OrderProduct, Product } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};

export const fetchOrderByID = async (order_id: number): Promise<Order> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API}/orders/${order_id}`
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
  order_id: number
): Promise<OrderProduct[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API}/order_products?order_id=${order_id}`
  );
  if (!response.ok) throw new Error('Failed to fetch order products');
  return await response.json();
};

export const addOrder = async (order: Order): Promise<Order> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!response.ok) throw new Error('Failed to create order');
  return await response.json();
};

export const addProductForOrder = async (orderProduct: OrderProduct) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API}/order_products`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderProduct)
    }
  );
  if (!response.ok) throw new Error('Failed to add product');
};

export const deleteProductFromOrder = async (
  id: number,
  product_id: number
): Promise<void> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_API
    }/order_products?order_id=${id}&product_id=${product_id}`,
    { method: 'DELETE' }
  );
  if (!response.ok) throw new Error('Failed to delete product');
};
