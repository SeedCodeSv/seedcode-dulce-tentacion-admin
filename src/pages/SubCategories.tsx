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
     
        <ListSubCategory actions={actions} />
      
    </Layout>
  );
}

export default ProductsCategories;
