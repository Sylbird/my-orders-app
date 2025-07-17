import { createBrowserRouter } from 'react-router';
import App from './components/App';
import AddOrEditOrder from './components/orders/AddOrEdit';
import Orders from './components/orders';

const router = createBrowserRouter([
  {
    path: '*',
    element: <App />
  },
  {
    path: 'my-orders',
    element: <Orders />
  },
  {
    path: 'add-order/:id',
    element: <AddOrEditOrder />
  }
]);

export default router;
