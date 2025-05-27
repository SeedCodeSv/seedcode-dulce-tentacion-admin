import {  ProductionOrderDetailsVerify, ProductStatus } from '@/types/production-order.types';

export const checkOrderFulfillment = (order: ProductionOrderDetailsVerify | null) => {
  const productStatus: Record<number, ProductStatus> = {};
  let canFulfillAll = true;

  const totalIngredientsRequired: Record<number, number> = {};
  const ingredientAvailableStock: Record<number, number> = {};

  // Primero: acumulamos requerimientos y stock disponible
  order?.details.forEach((ingredient) => {
    const ingredientId = ingredient.branchProduct.product.id;
    const requiredForThisProduct = Number(ingredient.quantity);

    totalIngredientsRequired[ingredientId] =
      (totalIngredientsRequired[ingredientId] || 0) + requiredForThisProduct;

    if (!(ingredientId in ingredientAvailableStock)) {
      ingredientAvailableStock[ingredientId] = ingredient.branchProduct?.stock || 0;
    }
  });

  // Ahora: agrupamos todo bajo order.branchProduct.productId
  const productId = order?.branchProduct.productId;
  const ingredients: Record<
    number,
    {
      sufficient: boolean;
      requiredStock: number;
      availableStock: number;
      usedByOthers: boolean;
    }
  > = {};

  let canFulfillProduct = true;

  order?.details.forEach((ingredient) => {
    const ingredientId = ingredient.branchProduct.product.id;
    const requiredStock = Number(ingredient.quantity);
    const availableStock = ingredientAvailableStock[ingredientId];
    const totalRequired = totalIngredientsRequired[ingredientId];

    const sufficient = availableStock >= totalRequired;
    const usedByOthers = totalRequired > requiredStock;

    ingredients[ingredientId] = {
      sufficient,
      requiredStock,
      availableStock,
      usedByOthers,
    };

    if (!sufficient) {
      canFulfillProduct = false;
    }
  });

  if (productId !== undefined) {
    productStatus[productId] = {
      canFulfill: canFulfillProduct,
      ingredients,
    };
  }

  if (!canFulfillProduct) {
    canFulfillAll = false;
  }

  return {
    canFulfillAll,
    productStatus,
  };
};
