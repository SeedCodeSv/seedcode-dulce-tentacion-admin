import Layout from '../layout/Layout';
import ListSuppliers from '../components/supplier/ListSuppliers';
import { useEffect } from 'react';

import { useViewsStore } from '@/store/views.store';

function Supplier() {
  const { OnGetViewasAction } = useViewsStore();

  // const supplierView = viewasAction.find((view) => view.view.name === 'Proveedores');
  //const actions = supplierView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Proveedores">
      <ListSuppliers />
    </Layout>
  );
}

export default Supplier;
