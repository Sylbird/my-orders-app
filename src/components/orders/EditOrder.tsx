import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Order, OrderProduct } from './types';

const EditOrder = ({ id }: { id: string | undefined }) => {
  const [orderData, setOrderData] = useState<Order>({
    order_number: '',
    date: new Date().toISOString(),
    num_products: 0,
    final_price: 0
  });
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order
        const orderResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/orders/${id}`
        );
        if (!orderResponse.ok) throw new Error('Failed to fetch order');
        const order = await orderResponse.json();
        setOrderData({
          order_number: order.order_number || '',
          date: order.date || new Date().toISOString(),
          num_products: order.num_products || 0,
          final_price: order.final_price || 0
        });

        // Fetch order products
        const orderProductsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/order_products?order_id=${id}`
        );
        if (!orderProductsResponse.ok)
          throw new Error('Failed to fetch order products');
        const orderProductsData = await orderProductsResponse.json();
        setOrderProducts(
          Array.isArray(orderProductsData) ? orderProductsData : []
        );
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    if (id && !isNaN(parseInt(id))) {
      fetchData();
    }
  }, [id]);

  const handleDeleteProduct = async (product_id: number) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API
        }/order_products?order_id=${id}&product_id=${product_id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete product');
      setOrderProducts(
        orderProducts.filter((p) => p.product_id !== product_id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Not working / Incomplete');
  };

  const actionsButtons = (rowData: OrderProduct) => (
    <Button
      icon="pi pi-trash"
      className="p-button-text p-button-rounded p-button-danger"
      onClick={() => handleDeleteProduct(rowData.product_id)}
      aria-label={`Delete product ${rowData.name}`}
    />
  );

  return (
    <div>
      <h1>Edit Order #{orderData.order_number}</h1>
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="p-field p-mb-4">
          <label htmlFor="order_number">Order Number</label>
          <InputText
            id="order_number"
            value={orderData.order_number}
            required
          />
        </div>
        <div className="p-field p-mb-4">
          <label htmlFor="date">Date</label>
          <InputText id="date" value={orderData.date} disabled />
        </div>
        <div className="p-field p-mb-4">
          <label htmlFor="num_products"># Products</label>
          <InputText
            id="num_products"
            value={orderProducts
              .reduce((sum, p) => sum + p.quantity, 0)
              .toString()}
            disabled
          />
        </div>
        <div className="p-field p-mb-4">
          <label htmlFor="final_price">Final Price</label>
          <InputText
            id="final_price"
            value={`${orderProducts
              .reduce(
                (sum: number, p: OrderProduct) =>
                  sum + (Number(p.total_price) || 0),
                0
              )
              .toFixed(2)}`}
            disabled
          />
        </div>
        <Button label="Save" icon="pi pi-save" type="submit" />
      </form>
      <h3>Products</h3>
      <Button
        label="Add Product"
        icon="pi pi-plus"
        onClick={() => alert('Not working / Incomplete')}
        className="p-mb-3"
      />
      <DataTable value={orderProducts} tableStyle={{ minWidth: '50rem' }}>
        <Column field="product_id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="unit_price" header="Unit Price" />
        <Column field="quantity" header="Qty" />
        <Column field="total_price" header="Total Price" />
        <Column header="Actions" body={actionsButtons} />
      </DataTable>
    </div>
  );
};

export default EditOrder;
