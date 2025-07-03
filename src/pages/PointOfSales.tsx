import Layout from '../layout/Layout';

import { useViewsStore } from '@/store/views.store';
import ListPointOfSales from '@/components/point-of-sales/ListPointOfSales';
function Employees() {
  const { actions } = useViewsStore();

  const pointOfSalesView = actions.find((view) => view.view.name === 'Puntos de Venta');
  const actionsView = pointOfSalesView?.actions?.name || [];

  return (
    <>
      <ListPointOfSales actions={actionsView} />
    </>
  );
}

export default Employees;
