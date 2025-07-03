import ListSuppliers from '../components/supplier/ListSuppliers';

import { useViewsStore } from '@/store/views.store';

function Supplier() {
  const { actions } = useViewsStore();
  const supplierView = actions.find((view) => view.view.name === 'Proveedores');
  const actionsView = supplierView?.actions?.name || [];

  return (
    <>
      <ListSuppliers actions={actionsView} />
    </>
  );
}

export default Supplier;
