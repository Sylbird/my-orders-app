import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';
import { fetchProducts } from './api';
import type { OrderProduct, Product } from '../types';

type ProductDialogProps = {
  orderId: number | undefined;
  visible: boolean;
  closeDialog: () => void;
  addProduct: (product: OrderProduct) => void;
};

const ProductDialog = ({
  orderId,
  visible,
  closeDialog,
  addProduct
}: ProductDialogProps) => {
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

    addProduct(newOrderProduct);
    setSelectedProduct(null);
    setQuantity(1);
    closeDialog();
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => closeDialog()}
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
    <Dialog
      onShow={() => fetchAndSetData()}
      footer={dialogFooter}
      header="Add New Product"
      style={{ width: '30rem' }}
      visible={visible}
      onHide={() => closeDialog()}
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
  );
};

export default ProductDialog;
