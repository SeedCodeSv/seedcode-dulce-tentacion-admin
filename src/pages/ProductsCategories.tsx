import { useEffect } from 'react';
import Layout from '../layout/Layout';
import ListCategories from '../components/categories/ListCategories';

import { useViewsStore } from '@/store/views.store';

function ProductsCategories() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  const categoriasView = viewasAction.find((view) => view.view.name === 'Categorias');
  const actions = categoriasView?.actions?.name || [];
  return (
    <Layout title="Categorías de producto">
      {categoriasView ? (
        <ListCategories actions={actions} />
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
