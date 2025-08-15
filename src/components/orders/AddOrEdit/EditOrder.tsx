import ProductDialog from './ProductDialog';
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import {
  fetchOrderByID,
  fetchProductsForOrder,
  deleteProductFromOrder,
  addProductForOrder
} from './api';
import type { Order, OrderProduct } from '../types';

const EditOrder = ({ orderId }: { orderId: number }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [order, setOrder] = useState<Order>({
    order_number: '',
    date: new Date().toLocaleDateString(),
    num_products: 0,
    final_price: 0
  });
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const errorToast = useRef<Toast>(null);

  useEffect(() => {
    fetchAndSetData(orderId);
  }, [orderId]);

  const fetchAndSetData = async (orderId: number) => {
    try {
      const [OrderData, ProductsForOrderData] = await Promise.all([
        fetchOrderByID(orderId),
        fetchProductsForOrder(orderId)
      ]);
      setOrder(OrderData);
      setOrderProducts(ProductsForOrderData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showErrorToast = () => {
    errorToast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Please add at least one product'
    });
  };

  const handleDeleteProduct = async (product_id: number, orderId: number) => {
    try {
      await deleteProductFromOrder(orderId, product_id);
      setOrderProducts((prevOrderProducts) => {
        const updOrdProds = prevOrderProducts.filter(
          (p) => p.product_id !== product_id
        );
        setOrder((prevOrder) => ({
          ...prevOrder,
          num_products: updOrdProds.reduce((sum, p) => sum + p.quantity, 0),
          final_price: updOrdProds.reduce((sum, p) => sum + p.total_price, 0)
        }));
        return updOrdProds;
      });
    } catch (error) {
      console.log('Error deleting Product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, orderId: number) => {
    e.preventDefault();

    if (orderProducts.length === 0) return showErrorToast();

    try {
      const serverOrderProducts = await fetchProductsForOrder(orderId);
      const onlyNewProducts = orderProducts.filter(
        (p) => !serverOrderProducts.some((sp) => sp.product_id === p.product_id)
      );

      for (const onlyNewProduct of onlyNewProducts) {
        await addProductForOrder(onlyNewProduct);
      }

      navigate('/my-orders');
    } catch (error) {
      console.error('Error Updating Order');
    }
  };

  const actionsButtons = (rowData: OrderProduct) => (
    <Button
      icon="pi pi-trash"
      className="p-button-text p-button-rounded p-button-danger"
      onClick={() => handleDeleteProduct(rowData.product_id, orderId)}
      aria-label={`Delete product ${rowData.name}`}
    />
  );

  const dataTableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products in the order</span>
      <Button
        icon="pi pi-plus"
        onClick={() => setIsDialogOpen(true)}
        className="p-mb-3"
        rounded
      />
    </div>
  );

  const handleAddProduct = (newOrderProduct: OrderProduct) => {
    setOrderProducts((prev) => {
      const newOrderProducts = [...prev, newOrderProduct];
      setOrder((prev) => ({
        ...prev,
        num_products: newOrderProducts.reduce((sum, p) => sum + p.quantity, 0),
        final_price: newOrderProducts.reduce((sum, p) => sum + p.total_price, 0)
      }));
      return newOrderProducts;
    });
  };

  return (
    <main>
      <Toast ref={errorToast} />
      <form
        onSubmit={(e) => handleSubmit(e, orderId)}
        className="p-card p-4 w-min mb-4"
      >
        <h2 className="mt-0">Edit Order {orderId}</h2>
        <div className="field p-mb-4">
          <label htmlFor="order_number">Order Number</label>
          <InputText id="order_number" value={order.order_number} disabled />
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
        <Column header="Actions" body={actionsButtons} />
      </DataTable>
      <ProductDialog
        orderId={orderId}
        visible={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
        addProduct={handleAddProduct}
      ></ProductDialog>
    </main>
  );
};

export default EditOrder;
