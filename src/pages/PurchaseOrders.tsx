import { useContext, useMemo } from 'react';

import { PermissionContext } from '@/hooks/usePermission';
import ListPurchasesOrders from '@/components/list_purchase/ListPurchasesOrders';

function PurchaseOrders() {
  const { roleActions } = useContext(PermissionContext);

  const actions = useMemo(() => {
    if (roleActions) {
      const viewActions = roleActions.views.find((view) => view.view.name === 'Ordenes de Compra');

      return viewActions ? viewActions.view.actions.map((action) => action.name) : [];
    }

    return [];
  }, [roleActions]);

  return (
    <>
      <ListPurchasesOrders actions={actions} />
    </>
  );
}

export default PurchaseOrders;
