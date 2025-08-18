import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import type { Order } from '../types';

type OrderFormProps = {
  header: string;
  orderId: number | undefined;
  order: Order;
  submitForm: (e: React.FormEvent, orderId?: number) => void;
  inputChange?: (field: string, value: string) => void;
};

const OrderForm = ({
  header,
  orderId,
  order,
  submitForm,
  inputChange
}: OrderFormProps) => {
  return (
    <form
      onSubmit={(e) => submitForm(e, orderId)}
      className="p-card p-4 w-min mb-4"
    >
      <h2 className="mt-0">
        {header} {orderId}
      </h2>
      <div className="field p-mb-4">
        <label htmlFor="order_number">Order Number</label>
        <InputText
          id="order_number"
          value={order.order_number}
          onChange={(e) => inputChange?.(`order_number`, e.target.value)}
          disabled={orderId ? true : false}
        />
      </div>
      <div className="field p-mb-4">
        <label htmlFor="date">Date</label>
        <InputText
          id="date"
          value={new Date(order.date).toLocaleDateString()}
          disabled
        />
      </div>
      <div className="field p-mb-4">
        <label htmlFor="num_products"># Products</label>
        <InputText
          id="num_products"
          value={order.num_products.toString()}
          disabled
        />
      </div>
      <div className="field p-mb-4">
        <label htmlFor="final_price">Final Price</label>
        <InputText
          id="final_price"
          value={order.final_price.toFixed(2)}
          disabled
        />
      </div>
      <Button label="Save" icon="pi pi-save" type="submit" />
    </form>
  );
};
export default OrderForm;
