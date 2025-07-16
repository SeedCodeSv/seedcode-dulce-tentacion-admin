
import ListShopping from '@/components/shopping/list-shopping.tsx';
import { useViewsStore } from '@/store/views.store.ts';

function Shopping() {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];

  return (
    <>
      <ListShopping actions={actionView} />
    </>
  );
}

export default Shopping;
