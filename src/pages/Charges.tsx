import { useEffect } from 'react';

import Layout from '../layout/Layout';
import ListCharges from '../components/charges/ListCharges';

import { useViewsStore } from '@/store/views.store';

function ProductsCategories() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const chargesView = viewasAction.find((view) => view.view.name === 'Cargos de Empleados');
  const actions = chargesView?.actions?.name || [];

  useEffect(() => {
    OnGetViewasAction();
  }, []);

  return (
    <Layout title="Cargos de Empleados">
      {chargesView ? (
        <ListCharges actions={actions} />
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

export default ProductsCategories;
