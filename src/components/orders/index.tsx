import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { Toolbar } from 'primereact/toolbar';
import type { Order } from './types';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}orders`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
          onClick={async () => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API}orders/${rowData.id}`,
                {
                  method: 'DELETE'
                }
              );
              if (!response.ok) throw new Error('Failed to delete order');
              fetchOrders();
            } catch (error) {
              console.error('Error deleting order:', error);
            }
          }}
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
        <DataTable value={orders} tableStyle={{ minWidth: '50rem' }}>
          <Column field="id" header="Id"></Column>
          <Column field="order_number" header="#Order"></Column>
          <Column field="date" header="Date"></Column>
          <Column field="num_products" header="#Products"></Column>
          <Column field="final_price" header="FinalPrice"></Column>
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
