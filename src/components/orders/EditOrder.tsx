import type { Order } from './types';

const EditOrder = ({ id, order }: { id: string; order: Order }) => {
  return (
    <div>
      <h1>Edit Order {id}</h1>
      <h2>Order Details {order.order_number}</h2>
    </div>
  );
};

export default EditOrder;
