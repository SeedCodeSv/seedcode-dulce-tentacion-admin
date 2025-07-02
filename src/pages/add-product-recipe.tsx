import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import UpdateRecipeBook from '@/components/products/recipe-book/update-recipe-book';
import AddRecipeBook from '@/components/products/recipe-book/add-recipe-book';

function AddProductRecipe() {
  const params = useParams<{ id: string; recipe: string }>();

  return (
    <>
      <Helmet>
        <title>{Number(params.recipe) === 0 ? 'Agregar Receta' : 'Actualizar Receta'}</title>
      </Helmet>
      {Number(params.recipe) === 0 ? (
        <AddRecipeBook id={Number(params.id)} />
      ) : (
        <UpdateRecipeBook productId={Number(params.id)} />
      )}
    </>
  );
}

export default AddProductRecipe;
