import Layout from '../layout/Layout';
import ListProducts from '../components/products/ListProducts';
import { useEffect } from 'react';

import { useViewsStore } from '@/store/views.store';

function Employees() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const productsView = viewasAction.find((view) => view.view.name === 'Productos');
  const actions = productsView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);

  return (
    <Layout title="PRODUCTOS">
      <ListProducts actions={actions} />
    </Layout>
  );
}

export default Employees;
