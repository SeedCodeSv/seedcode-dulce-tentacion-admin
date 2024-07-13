import Layout from '../layout/Layout';
import ListProducts from '../components/products/ListProducts';
import {  useEffect } from 'react';

import { useViewsStore } from '@/store/views.store';

function Employees() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const productsView = viewasAction.find((view) => view.view.name === 'Productos');
  const actions = productsView?.actions?.name || [];
    useEffect(() => {
      OnGetViewasAction();
    }, []);

  return (
    <Layout title="PRODUCTOS">
      {productsView ? (
        <ListProducts actions={actions} />
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

export default Employees;
