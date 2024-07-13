import Layout from '../layout/Layout';

import { useEffect } from 'react';

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
    <Layout title="DESCUENTOS">
      {discountsView ? (
        <ListPromotions actions={actions} />
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Discounts;
