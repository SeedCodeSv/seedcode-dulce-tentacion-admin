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
    
        <ListCategories actions={actions} />
      
    </Layout>
  );
}

export default ProductsCategories;
