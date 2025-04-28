import Layout from '../layout/Layout';
import ListClients from '../components/clients/ListClients';

import { useViewsStore } from '@/store/views.store';

function Customers() {
  const { actions } = useViewsStore();
  const empleadosView = actions.find((view) => view.view.name === 'Clientes');
  const actionsView = empleadosView?.actions?.name || [];

  return (
    <Layout title="Clientes">
      <ListClients actions={actionsView} />
    </Layout>
  );
}

export default Customers;
