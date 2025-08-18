import OrderForm from './OrderForm';
import ProductDataTable from './ProductDataTable';
import ProductDialog from './ProductDialog';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import { addOrder, addProductForOrder } from './api';
import type { Order, OrderProduct } from '../types';

const AddOrder = () => {
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

  const handleDeleteProduct = async (productId: number) => {
    try {
      setOrderProducts((prevOrderProducts) => {
        const updOrdProds = prevOrderProducts.filter(
          (p) => p.product_id !== productId
        );
        setOrder((prevOrder) => ({
          ...prevOrder,
          num_products: updOrdProds.reduce((sum, p) => sum + p.quantity, 0),
          final_price: updOrdProds.reduce((sum, p) => sum + p.total_price, 0)
        }));
        return updOrdProds;
      });
    } catch (error) {
      console.error('Error deleting Product:', error);
    }
  };

  return (
    <main>
      <Toast ref={errorToast} />
      <OrderForm
        header="Add New Order"
        orderId={undefined}
        order={order}
        submitForm={handleSubmit}
        inputChange={handleChange}
      />
      <ProductDataTable
        onAddProductClick={() => setIsDialogOpen(true)}
        orderProducts={orderProducts}
        deleteProduct={handleDeleteProduct}
      ></ProductDataTable>
      <ProductDialog
        visible={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
        addProduct={handleAddProduct}
      ></ProductDialog>
    </main>
  );
};

export default AddOrder;
