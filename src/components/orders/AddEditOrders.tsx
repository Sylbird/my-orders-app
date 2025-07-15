import { useParams } from 'react-router';
import AddOrder from './AddOrder';
import EditOrder from './EditOrder';

const AddEditOrder = () => {
  const { id } = useParams<{ id: string }>();
  return id === 'new' ? <AddOrder /> : <EditOrder id={id} />;
};

export default AddEditOrder;
