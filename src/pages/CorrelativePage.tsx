import Correlatives from '@/components/correlatives/Correlatives';
import Layout from '@/layout/Layout';
import { useViewsStore } from '@/store/views.store';

function CorrelativePage() {
  const { actions } = useViewsStore();

  const viewName = actions.find((v) => v.view.name == 'Correlativos');
  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="Correlativos">
      <Correlatives actions={actionView}></Correlatives>
    </Layout>
  );
}

export default CorrelativePage;
