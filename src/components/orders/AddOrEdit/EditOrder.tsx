import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router';
import type { Order, OrderProduct, Product } from '../types';
import { Toast } from 'primereact/toast';
import { fetchProducts, fetchOrderByID, fetchProductsForOrder } from './api';

const EditOrder = ({ id }: { id: number }) => {
  const navigate = useNavigate();
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [order, setOrder] = useState<Order>({
    order_number: '',
    date: new Date().toLocaleDateString(),
    num_products: 0,
    final_price: 0
  });
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const errorToast = useRef<Toast>(null);

  useEffect(() => {
    fetchAndSetData(id);
  }, [id]);

  const fetchAndSetData = async (id: number) => {
    try {
      const [OrderData, ProductsForOrderData, ProductsData] = await Promise.all(
        [fetchOrderByID(id), fetchProductsForOrder(id), fetchProducts()]
      );
      setOrder(OrderData);
      setOrderProducts(ProductsForOrderData);
      setAvailableProducts(ProductsData);
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

  const handleAddProduct = () => {
    if (!selectedProduct || !quantity) return;
    const newOrderProduct: OrderProduct = {
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      unit_price: selectedProduct.unit_price,
      quantity,
      total_price: selectedProduct.unit_price * quantity
    };
    setOrderProducts([...orderProducts, newOrderProduct]);
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderProducts.length === 0) return showErrorToast();

    try {
      // Update order_number
      const orderResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/orders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_number: order.order_number })
        }
      );
      if (!orderResponse.ok) throw new Error('Failed to update order');

      const existingProducts = await fetchProductsForOrder(id);

      // Sync orderProducts
      for (const product of orderProducts) {
        const existing = existingProducts.find(
          (p: OrderProduct) => p.product_id === product.product_id
        );
        const method = existing ? 'PUT' : 'POST';
        const productResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/order_products`,
          {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: id,
              product_id: product.product_id,
              quantity: product.quantity
            })
          }
        );
        if (!productResponse.ok) throw new Error('Failed to sync product');
      }

      navigate('/my-orders');
    } catch (error) {
      console.error('Error Updating Order');
    }
  };
  const handleChange = (field: string, value: string) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const actionsButtons = (rowData: OrderProduct) => (
    <Button
      icon="pi pi-trash"
      className="p-button-text p-button-rounded p-button-danger"
      onClick={() => handleDeleteProduct(rowData.product_id)}
      aria-label={`Delete product ${rowData.name}`}
    />
  );

  const modalFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowModal(false)}
        className="p-button-text"
      />
      <Button
        label="Add"
        icon="pi pi-check"
        onClick={handleAddProduct}
        disabled={!selectedProduct || !quantity}
      />
    </div>
  );

  const dataTableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products in the order</span>
      <Button
        icon="pi pi-plus"
        onClick={() => setShowModal(true)}
        className="p-mb-3"
        rounded
      />
    </div>
  );

  return (
    <main>
      <Toast ref={errorToast} />
      <h1>Edit Order #{order.order_number}</h1>
      <form onSubmit={handleSubmit} className="p-card p-4 w-min mb-4">
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
            value={orderProducts
              .reduce((sum, p) => sum + p.quantity, 0)
              .toString()}
            disabled
          />
        </div>
        <div className="field p-mb-4">
          <label htmlFor="final_price">Final Price</label>
          <InputText
            id="final_price"
            value={orderProducts
              .reduce((sum, p) => sum + p.total_price, 0)
              .toFixed(2)}
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
          body={(rowData: OrderProduct) => rowData.unit_price.toFixed(2)}
        />
        <Column field="quantity" header="Qty" />
        <Column
          field="total_price"
          header="Total Price"
          body={(rowData: OrderProduct) => rowData.total_price.toFixed(2)}
        />
        <Column header="Actions" body={actionsButtons} />
      </DataTable>
      <Dialog
        header="Add New Product"
        visible={showModal}
        style={{ width: '30rem' }}
        footer={modalFooter}
        onHide={() => setShowModal(false)}
      >
        <div className="p-fluid">
          <div className="field p-mb-4">
            <label htmlFor="product">Product</label>
            <Dropdown
              id="product"
              value={selectedProduct}
              options={availableProducts}
              optionLabel="name"
              onChange={(e) => setSelectedProduct(e.value)}
              placeholder="Select a product"
            />
          </div>
          <div className="field p-mb-4">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber
              id="quantity"
              value={quantity}
              onValueChange={(e) => setQuantity(e.value || 1)}
              min={1}
              maxFractionDigits={0}
            />
          </div>
        </div>
      </Dialog>
    </main>
  );
};

export default EditOrder;
