import Layout from '../layout/Layout';
import ListClients from '../components/clients/ListClients';
import { useEffect } from 'react';
import { useViewsStore } from '@/store/views.store';

function Customers() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  const empleadosView = viewasAction.find((view) => view.view.name === 'Clientes');
  const actions = empleadosView?.actions?.name || [];
  return (
    <Layout title="Clientes">
      <ListClients actions={actions} />
    </Layout>
  );
}

export default Customers;
