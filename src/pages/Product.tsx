import Layout from '../layout/Layout';
import ListProducts from '../components/products/ListProducts';

import { useViewsStore } from '@/store/views.store';

function Employees() {
  const { actions} = useViewsStore();
  const productsView = actions.find((view) => view.view.name === 'Productos');
  const actionView = productsView?.actions?.name || [];
 

  return (
    <Layout title="PRODUCTOS">
      <ListProducts actions={actionView} />
    </Layout>
  );
}

export default Employees;
