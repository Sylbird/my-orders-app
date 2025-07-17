import { useNavigate, useParams } from 'react-router';
import AddOrder from './AddOrder';
import EditOrder from './EditOrder';
import { useEffect } from 'react';

const AddOrEditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id !== 'new' && !(id && !isNaN(parseInt(id)))) {
      navigate('/');
    }
  }, [id]);

  if (id === 'new') {
    return <AddOrder />;
  } else if (id && !isNaN(parseInt(id))) {
    return <EditOrder id={id} />;
  }
};

export default AddOrEditOrder;
