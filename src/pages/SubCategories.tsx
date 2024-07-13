import { useEffect } from 'react';
import Layout from '../layout/Layout';
import ListSubCategory from '../components/sub_categories/ListSubCategories';
import { useViewsStore } from '@/store/views.store';
function ProductsCategories() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  const subcategoriasView = viewasAction.find((view) => view.view.name === 'Sub Categorias');
  const actions = subcategoriasView?.actions?.name || [];
  return (
    <Layout title="Sub Categorias">
      {subcategoriasView ? (
        <ListSubCategory actions={actions} />
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
