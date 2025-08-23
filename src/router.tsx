import App from './components/App';
import Orders from './components/orders';
import AddOrEditOrder from './components/orders/AddOrEdit';
import { createBrowserRouter } from 'react-router';

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
