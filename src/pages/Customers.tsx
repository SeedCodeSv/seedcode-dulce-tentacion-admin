import ListClients from '../components/clients/ListClients';

import { useViewsStore } from '@/store/views.store';

function Customers() {
  const { actions } = useViewsStore();
  const empleadosView = actions.find((view) => view.view.name === 'Clientes');
  const actionsView = empleadosView?.actions?.name || [];

  return (
    <>
      <ListClients actions={actionsView} />
    </>
  );
}

export default Customers;
