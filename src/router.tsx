import { createBrowserRouter } from 'react-router';
import App from './components/App';
import AddEditOrder from './components/orders/AddEditOrders';
import Orders from './components/orders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'my-orders',
    element: <Orders />
  },
  {
    path: 'add-order/:id',
    element: <AddEditOrder />
  }
]);

export default router;
