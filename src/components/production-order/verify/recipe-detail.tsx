import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { ProductStatus, Recipe } from '@/types/production-order.types';
import { getUnitLabel } from '@/utils/formatters';

interface RecipeDetailProps {
  recipe: Recipe;
  orderQuantity: number;
  status: ProductStatus;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, orderQuantity, status }) => {
  if (!recipe || !recipe.recipeDetails || recipe.recipeDetails.length === 0) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <p className="text-sm text-gray-500 italic">No hay detalles de receta disponibles</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 sm:px-6">
      <h4 className="text-md font-medium text-gray-900 mb-3">Requisitos de Receta</h4>
      <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                Ingrediente
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                Cantidad por Unidad
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                Total Requerido
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                En Stock
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipe.recipeDetails.map((ingredient) => {
              const ingredientStatus = status.ingredients[ingredient.productIdReference];

              return (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ingredient.branchProduct.product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ingredient.quantity} {getUnitLabel(ingredient.extraUniMedida)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(parseFloat(ingredient.quantity) * orderQuantity).toFixed(2)}{' '}
                    {getUnitLabel(ingredient.extraUniMedida)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ingredientStatus ? ingredientStatus.availableStock : 'Desconocido'}{' '}
                    {getUnitLabel(ingredient.branchProduct.product.uniMedida)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredientStatus ? (
                      ingredientStatus.sufficient ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1" size={14} />
                          Suficiente
                        </span>
                      ) : ingredientStatus.availableStock > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="mr-1" size={14} />
                          Insuficiente{ingredientStatus.usedByOthers ? ' (Usado por otros)' : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1" size={14} />
                          Sin Stock
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Desconocido
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetail;
