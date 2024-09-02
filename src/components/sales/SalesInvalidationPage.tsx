import Layout from '@/layout/Layout';

import SalesInvalidationList from './components/SalesInvalidationList';
import { useViewsStore } from '@/store/views.store';

function SalesInvalidationPage() {
  const { actions } = useViewsStore();

  const viewName = actions.find((v) => v.view.name == 'Ventas');
  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="Ventas">
      <SalesInvalidationList actions={actionView}></SalesInvalidationList>
    </Layout>
  );
}

export default SalesInvalidationPage;
