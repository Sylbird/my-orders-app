import ProductDialog from './ProductDialog';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { addOrder, addProductForOrder } from './api';
import type { Order, OrderProduct } from '../types';

const AddOrder = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>({
    order_number: '',
    date: new Date().toLocaleDateString(),
    num_products: 0,
    final_price: 0
  });
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const errorToast = useRef<Toast>(null);

  const showErrorToast = () => {
    errorToast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Please add at least one product'
    });
  };

  const handleChange = (field: string, value: string) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderProducts.length === 0) return showErrorToast();

    try {
      const newOrder = await addOrder(order);
      // Add products to order
      for (const product of orderProducts) {
        const newOrderProduct: OrderProduct = {
          order_id: newOrder.id,
          product_id: product.product_id,
          quantity: product.quantity,
          total_price: product.total_price
        };
        await addProductForOrder(newOrderProduct);
      }

      navigate('/my-orders');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const dataTableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products in the order</span>
      <ProductDialog
        orderId={undefined}
        setOrderProducts={setOrderProducts}
        setOrder={setOrder}
      ></ProductDialog>
    </div>
  );

  return (
    <main>
      <Toast ref={errorToast} />
      <form onSubmit={handleSubmit} className="p-card p-4 w-min mb-4">
        <h2 className="mt-0">Add New Order</h2>
        <div className="field p-mb-4">
          <label htmlFor="order_number">Order Number</label>
          <InputText
            id="order_number"
            value={order.order_number}
            onChange={(e) => handleChange('order_number', e.target.value)}
            required
          />
        </div>
        <div className="field p-mb-4">
          <label htmlFor="date">Date</label>
          <InputText id="date" value={order.date} disabled />
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
      <DataTable
        showGridlines
        value={orderProducts}
        tableStyle={{ minWidth: '50rem' }}
        header={dataTableHeader}
      >
        <Column field="product_id" header="ID" />
        <Column field="name" header="Name" />
        <Column
          field="unit_price"
          header="Unit Price"
          body={(rowData: OrderProduct) => rowData.unit_price?.toFixed(2)}
        />
        <Column field="quantity" header="Qty" />
        <Column
          field="total_price"
          header="Total Price"
          body={(rowData: OrderProduct) => rowData.total_price.toFixed(2)}
        />
      </DataTable>
    </main>
  );
};

export default AddOrder;
