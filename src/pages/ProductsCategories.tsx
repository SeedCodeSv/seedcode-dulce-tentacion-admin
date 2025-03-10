import Layout from '../layout/Layout';
import ListCategories from '../components/categories/list-categories';

import { useViewsStore } from '@/store/views.store';

function ProductsCategories() {
  const { actions } = useViewsStore();
  const categoriasView = actions.find((view) => view.view.name === 'Categorias de Productos');
  const actionView = categoriasView?.actions?.name || [];
  return (
    <Layout title="Categorías de producto">
      <ListCategories actions={actionView} />
    </Layout>
  );
}

export default ProductsCategories;
