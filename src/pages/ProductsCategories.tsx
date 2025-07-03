import ListCategories from '../components/categories/list-categories';

import { useViewsStore } from '@/store/views.store';

function ProductsCategories() {
  const { actions } = useViewsStore();
  const categoriasView = actions.find((view) => view.view.name === 'Categorias de Productos');
  const actionView = categoriasView?.actions?.name || [];

  return <ListCategories actions={actionView} />;
}

export default ProductsCategories;
