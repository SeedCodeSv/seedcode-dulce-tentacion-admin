import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { convertToShortNames } from '../utils';

import { Detail, ProductStatus } from '@/types/production-order.types';

interface RecipeDetailProps {
  recipe: Detail[];
  orderQuantity: number;
  status: ProductStatus;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, orderQuantity, status }) => {
  if (!recipe || recipe.length === 0) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <p className="text-sm text-gray-500 italic">No hay detalles de receta disponibles</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 sm:px-6">
      <h4 className="text-md font-medium text-gray-900 dark:text-gray-200 mb-3">Requisitos de Receta</h4>
      <div className="overflow-hidden border border-gray-200 sm:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              {['Ingrediente','Cantidad por Unidad','Total Requerido','En Stock','Estado'].map((head) =>
              <th
                key={head}
                className="px-6 py-3 text-left text-xs font-medium dark:bg-gray-900 text-gray-50 uppercase tracking-wider"
                scope="col"
              >
                {head}
              </th>
               )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipe.map((ingredient) => {
              const ingredientStatus = status.ingredients[ingredient.branchProduct.productId];

              return (
                <tr key={ingredient.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {ingredient.branchProduct.product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    {(Number(ingredient.quantity) / orderQuantity).toFixed(4)}{' '}
                    
                    {/* {convertToShortNames(ingredient.extraUniMedida)} (
                    {convertUnit(
                      Number(ingredient.quantity),
                      ingredient.extraUniMedida,
                      ingredient.branchProduct.product.uniMedida
                    ).toFixed(2) +
                      ' ' +
                      convertToShortNames(ingredient.branchProduct.product.uniMedida)}
                    ) */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    {ingredient.quantity}
                    {/* {convertToShortNames(ingredient.extraUniMedida)} (
                    {convertUnit(
                      Number(ingredient.quantity) * orderQuantity,
                      ingredient.extraUniMedida,
                      ingredient.branchProduct.product.uniMedida
                    ).toFixed(2) +
                      ' ' +
                      convertToShortNames(ingredient.branchProduct.product.uniMedida)}
                    ) */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    {ingredientStatus ? ingredientStatus.availableStock : 'Desconocido'}{' '}
                    {convertToShortNames(ingredient.branchProduct.product.uniMedida)}
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
