import { useMemo } from 'react';

import Layout from '../layout/Layout';
import ListProducts from '../components/products/list-product';

import { usePermission } from '@/hooks/usePermission';

function Employees() {
  const { returnActionsByView, roleActions } = usePermission();

  const actions = useMemo(() => {
    if (roleActions) {
      const actions = returnActionsByView('Productos');

      return actions;
    }

    return [];
  }, [roleActions]);

  return (
    <Layout title="PRODUCTOS">
      <ListProducts actions={actions} />
    </Layout>
  );
}

export default Employees;
