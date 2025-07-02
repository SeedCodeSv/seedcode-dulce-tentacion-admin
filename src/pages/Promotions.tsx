import { useEffect } from 'react';

import Layout from '../layout/Layout';
import ListPromotions from '../components/discounts/ListPromotions';

import { useViewsStore } from '@/store/views.store';

function Discounts() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const discountsView = viewasAction.find((view) => view.view.name === 'Descuentos');
  const actions = discountsView?.actions?.name || [];

  useEffect(() => {
    OnGetViewasAction();
  }, []);

  return (
    <>
      <ListPromotions actions={actions} />
    </>
  );
}

export default Discounts;
