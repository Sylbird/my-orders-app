import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';

const App = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Order Management
        </h1>
        <p className="text-gray-600 mb-6">
          View and manage your orders with ease.
        </p>
        <Button
          label="My Orders"
          icon="pi pi-arrow-right"
          className="p-button-raised p-button-primary"
          onClick={() => navigate('/my-orders')}
          aria-label="Navigate to My Orders"
        />
      </div>
    </main>
  );
};

export default App;
