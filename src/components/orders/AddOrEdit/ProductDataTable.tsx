import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { OrderProduct } from '../types';

type ProductDataTableProps = {
  onAddProductClick: () => void;
  orderProducts: OrderProduct[];
  deleteProduct: (
    productId: number,
    orderId: number | undefined
  ) => Promise<void>;
};

const ProductDataTable = ({
  onAddProductClick,
  orderProducts,
  deleteProduct
}: ProductDataTableProps) => {
  const dataTableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products in the order</span>
      <Button
        icon="pi pi-plus"
        onClick={onAddProductClick}
        className="p-mb-3"
        rounded
      />
    </div>
  );

  const actionsButtons = (rowData: OrderProduct) => (
    <Button
      icon="pi pi-trash"
      className="p-button-text p-button-rounded p-button-danger"
      onClick={() => deleteProduct(rowData.product_id, rowData.order_id)}
      aria-label={`Delete product ${rowData.name}`}
      title={`Delete product ${rowData.name}`}
    />
  );

  return (
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
      <Column
        header="Actions"
        body={(rowData: OrderProduct) => actionsButtons(rowData)}
      />
    </DataTable>
  );
};

export default ProductDataTable;
