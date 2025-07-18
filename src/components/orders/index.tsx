import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { Toolbar } from 'primereact/toolbar';
import type { Order } from './types';
import { fetchOrders } from './AddOrEdit/api';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const deleteOrder = async (rowData: Order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/orders/${rowData.id}`,
        {
          method: 'DELETE'
        }
      );
      if (!response.ok) throw new Error('Failed to delete order');
      fetchAndSetData();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const fetchAndSetData = async () => {
    try {
      const OrdersData = await fetchOrders();
      setOrders(OrdersData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const actionButtons = (rowData: Order) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => navigate(`/add-order/${rowData.id}`)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => deleteOrder(rowData)}
        />
      </>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <h2>You can also create a new Order:</h2>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        onClick={() => navigate('/add-order/new')}
      />
    );
  };

  return (
    <div>
      <h1>My Orders</h1>
      <div>
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          showGridlines
          value={orders}
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="id" header="Id"></Column>
          <Column field="order_number" header="#Order"></Column>
          <Column
            field="date"
            header="Date"
            body={(rowData: Order) =>
              new Date(rowData.date).toLocaleDateString()
            }
          ></Column>
          <Column field="num_products" header="#Products"></Column>
          <Column
            field="final_price"
            header="FinalPrice"
            body={(rowData: Order) => rowData.final_price.toFixed(2)}
          ></Column>
          <Column
            header="Actions"
            body={actionButtons}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Orders;
