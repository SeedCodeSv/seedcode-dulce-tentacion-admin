import ListShopping from '@/components/shopping/ListShopping.tsx';
import Layout from '../layout/Layout.tsx';
import { useViewsStore } from '@/store/views.store.ts';

function Shopping() {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  return (
    <Layout title="Compras">
      <ListShopping actions={actionView} />
    </Layout>
  );
}

export default Shopping;
