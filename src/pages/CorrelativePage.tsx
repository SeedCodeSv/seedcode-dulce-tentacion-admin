import Correlatives from '@/components/correlatives/Correlatives';
import { useViewsStore } from '@/store/views.store';

function CorrelativePage() {
  const { actions } = useViewsStore();

  const viewName = actions.find((v) => v.view.name == 'Correlativos');
  const actionView = viewName?.actions.name || [];

  return (
    <>
      <Correlatives actions={actionView} />
    </>
  );
}

export default CorrelativePage;
