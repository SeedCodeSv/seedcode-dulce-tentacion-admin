import { useContext, useMemo } from 'react';

import Layout from '../layout/Layout';

import { PermissionContext } from '@/hooks/usePermission';
import ListPurchasesOrders from '@/components/list_purchase/ListPurchasesOrders';

function PurchaseOrders() {
  const { roleActions } = useContext(PermissionContext);

  const actions = useMemo(() => {
    if (roleActions) {
      const viewActions = roleActions.views.find((view) => view.view.name === 'Ordenes de Compras');

      return viewActions ? viewActions.view.actions.map((action) => action.name) : [];
    }

    return [];
  }, [roleActions]);

  return (
    <Layout title="Ordenes de Compra">
      <ListPurchasesOrders actions={actions} />
    </Layout>
  );
}

export default PurchaseOrders;
