import { Detail, ProductStatus } from '@/types/production-order.types';

export const checkOrderFulfillment = (details: Detail[]) => {
  const productStatus: Record<number, ProductStatus> = {};
  let canFulfillAll = true;

  // Primero, calculamos el total requerido de cada ingrediente a través de todos los productos
  const totalIngredientsRequired: Record<number, number> = {};
  const ingredientAvailableStock: Record<number, number> = {};

  // Para cada producto en la orden
  details.forEach((detail) => {
    const recipe = detail.productRecipe.recipe;

    // Acumular requisitos totales de ingredientes
    if (recipe && recipe.recipeDetails) {
      recipe.recipeDetails.forEach((ingredient) => {
        const ingredientId = ingredient.productIdReference;
        const quantityPerUnit = parseFloat(ingredient.quantity);
        const requiredForThisProduct = quantityPerUnit * detail.quantity;

        // Acumular el total requerido para este ingrediente
        totalIngredientsRequired[ingredientId] =
          (totalIngredientsRequired[ingredientId] || 0) + requiredForThisProduct;

        // Guardar el stock disponible (solo necesitamos hacerlo una vez por ingrediente)
        if (!(ingredientId in ingredientAvailableStock)) {
          ingredientAvailableStock[ingredientId] = ingredient.branchProduct?.stock || 0;
        }
      });
    }
  });

  // Ahora verificamos cada producto con los totales acumulados
  details.forEach((detail) => {
    const productId = detail.productId;
    const recipe = detail.productRecipe.recipe;
    const ingredients: Record<
      number,
      {
        sufficient: boolean;
        requiredStock: number;
        availableStock: number
        usedByOthers: boolean
      }
    > = {};

    let canFulfillProduct = true;

    if (recipe && recipe.recipeDetails) {
      recipe.recipeDetails.forEach((ingredient) => {
        const ingredientId = ingredient.productIdReference;
        const quantityPerUnit = parseFloat(ingredient.quantity);
        const totalRequired = totalIngredientsRequired[ingredientId];
        const availableStock = ingredientAvailableStock[ingredientId];
        const requiredForThisProduct = quantityPerUnit * detail.quantity;

        const sufficient = availableStock >= totalRequired;

        const usedByOthers = totalRequired > requiredForThisProduct;

        ingredients[ingredientId] = {
          sufficient,
          requiredStock: requiredForThisProduct,
          availableStock,
          usedByOthers,
        };
        if (!sufficient) {
          canFulfillProduct = false;
        }
      });
    }

    productStatus[productId] = {
      canFulfill: canFulfillProduct,
      ingredients,
    };

    if (!canFulfillProduct) {
      canFulfillAll = false;
    }
  });

  return {
    canFulfillAll,
    productStatus,
  };
};
