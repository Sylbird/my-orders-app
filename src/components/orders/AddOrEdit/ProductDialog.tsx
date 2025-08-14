import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';
import { fetchProducts } from './api';
import type { Order, OrderProduct, Product } from '../types';

type DialogProps = {
  orderId: number | undefined;
  setOrderProducts: React.Dispatch<React.SetStateAction<OrderProduct[]>>;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
};

const ProductDialog = ({
  orderId,
  setOrderProducts,
  setOrder
}: DialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const fetchAndSetData = async () => {
    try {
      const serverAvailableProducts = await fetchProducts();
      setAvailableProducts(serverAvailableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = (order_id: number | undefined) => {
    if (!selectedProduct || !quantity) return;
    const newOrderProduct: OrderProduct = {
      order_id: order_id || undefined,
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      unit_price: selectedProduct.unit_price,
      quantity,
      total_price: selectedProduct.unit_price * quantity
    };
    setOrderProducts((prev) => {
      const newOrderProducts = [...prev, newOrderProduct];
      setOrder((prev) => ({
        ...prev,
        num_products: newOrderProducts.reduce((sum, p) => sum + p.quantity, 0),
        final_price: newOrderProducts.reduce((sum, p) => sum + p.total_price, 0)
      }));
      return newOrderProducts;
    });
    setShowDialog(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowDialog(false)}
        className="p-button-text"
      />
      <Button
        label="Add"
        icon="pi pi-check"
        onClick={() => handleAddProduct(orderId || undefined)}
        disabled={!selectedProduct || !quantity}
      />
    </div>
  );

  return (
    <>
      <Button
        icon="pi pi-plus"
        onClick={() => setShowDialog(true)}
        className="p-mb-3"
        rounded
      />
      <Dialog
        onShow={() => fetchAndSetData()}
        footer={dialogFooter}
        header="Add New Product"
        style={{ width: '30rem' }}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
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
    </>
  );
};

export default ProductDialog;
