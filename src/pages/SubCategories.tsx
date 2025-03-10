import Layout from '../layout/Layout';
import ListSubCategory from '../components/sub_categories/list-sub-categories';
import { useViewsStore } from '@/store/views.store';
function ProductsCategories() {
  const { actions } = useViewsStore();
  const subcategoriasView = actions.find((view) => view.view.name === 'Sub Categorias');
  const actionsView = subcategoriasView?.actions?.name || [];
  return (
    <Layout title="Sub Categorias">
      <ListSubCategory actions={actionsView} />
    </Layout>
  );
}

export default ProductsCategories;
