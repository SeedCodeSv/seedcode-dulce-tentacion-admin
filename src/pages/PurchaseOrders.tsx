import Layout from '../layout/Layout';
import ListPurchasesOrders from '../components/list_purchase/ListPurchasesOrders';
import { useViewsStore } from '@/store/views.store';

function PurchaseOrders() {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Ordenes de Compra');
  const actionView = viewName?.actions.name || [];
  return (
    <Layout title="Ordenes de Compra">
      <ListPurchasesOrders actions={actionView} />
    </Layout>
  );
}

export default PurchaseOrders;
