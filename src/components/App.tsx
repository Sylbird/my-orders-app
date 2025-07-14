import { useNavigate } from 'react-router';

const App = () => {
  const navigate = useNavigate();
  return (
    <main>
      <h1>You could check your orders here:</h1>
      <button onClick={() => navigate('/my-orders')}>My Orders</button>
    </main>
  );
};

export default App;
