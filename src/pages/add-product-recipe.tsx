import { useParams } from 'react-router';

import Layout from '@/layout/Layout';
import UpdateRecipeBook from '@/components/products/recipe-book/update-recipe-book';
import AddRecipeBook from '@/components/products/recipe-book/add-recipe-book';

function AddProductRecipe() {
  const params = useParams<{ id: string; recipe: string }>();

  return (
    <Layout title={Number(params.recipe) === 0 ? 'Agregar Receta' : 'Actualizar Receta'}>
      {Number(params.recipe) === 0 ? (
        <AddRecipeBook id={Number(params.id)} />
      ) : (
        <UpdateRecipeBook productId={Number(params.id)} />
      )}
    </Layout>
  );
}

export default AddProductRecipe;
