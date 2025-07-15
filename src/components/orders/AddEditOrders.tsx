import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import EditOrder from './EditOrder';
import AddOrder from './AddOrder';
import type { Order } from './types';

const AddEditOrder = () => {
  const { id } = useParams();
  const isEditMode = id !== 'new';
  const [order, setOrder] = useState<Order>({} as Order);

  useEffect(() => {
    if (isEditMode && id) {
      fetchOrderById(id);
    }
  }, [id, isEditMode]);

  const fetchOrderById = async (orderId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}orders/${orderId}`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  return (
    <div>
      {isEditMode && id ? <EditOrder id={id} order={order} /> : <AddOrder />}
    </div>
  );
};

export default AddEditOrder;
