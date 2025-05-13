import React, { useMemo, useState } from 'react';
import { CheckIcon, AlertCircleIcon } from 'lucide-react';
import { Checkbox, Input } from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { Detail } from '@/types/production-order.types';
import { filtrarPorCategoria } from '@/components/add-product/validation-add-product';

type Product = Detail & {
  producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
};

interface ProductItemProps {
  product: Product;
  onQuantityChange: (id: string, produced: number, damaged: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onQuantityChange }) => {
  const { id, expectedQuantity, products, productRecipe } = product;

  const { name, code, uniMedida: unit } = products;

  const [canReturnProduct, setCanReturnProduct] = useState<boolean>(false);

  const [producedQuantity] = useState<number>(expectedQuantity);
  const [damagedQuantity, setDamagedQuantity] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [damageReason, setDamageReason] = useState<string>('');

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);

  const handleDamagedChange = (text: number) => {
    const value = text;

    setDamagedQuantity(+value);
    onQuantityChange(id.toString(), +producedQuantity, +value);
  };

  const getStatusIcon = () => {
    if (producedQuantity === expectedQuantity && damagedQuantity === 0) {
      return <CheckIcon className="text-green-500 h-5 w-5" />;
    } else if (producedQuantity < expectedQuantity || damagedQuantity > 0) {
      return <AlertCircleIcon className="text-yellow-500 h-5 w-5" />;
    } else {
      return <CheckIcon className="text-green-500 h-5 w-5" />;
    }
  };


  return (
    <div className="border rounded-lg mb-4 bg-white overflow-hidden transition-all duration-200">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{code}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Esperado</p>
            <p className="font-medium">
              {expectedQuantity} {unit}
            </p>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setExpanded(!expanded)}
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                readOnly
                label="Cantidad Producida (Buena)"
                value={(Number(producedQuantity) - Number(damagedQuantity)).toString()}
                variant="bordered"
              />
            </div>
            <div>
              <Input
                label="Cantidad Dañada/Perdida"
                value={damagedQuantity.toString()}
                variant="bordered"
                onValueChange={(text) => handleDamagedChange(text as unknown as number)}
              />
            </div>
            {damagedQuantity > 0 && (
              <div className="mb-4">
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={damageReason}
                  onChange={(e) => setDamageReason(e.target.value)}
                >
                  <option value="">Seleccionar razón</option>
                  <option value="error_produccion">Error de producción</option>
                  <option value="materia_prima_defectuosa">Materia prima defectuosa</option>
                  <option value="falla_maquinaria">Falla de maquinaria</option>
                  <option value="error_humano">Error humano</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            )}
            <Checkbox
              defaultChecked={canReturnProduct}
              isSelected={canReturnProduct}
              onValueChange={setCanReturnProduct}
            >
              Devolución de materia prima a inventario
            </Checkbox>
          </div>
          {canReturnProduct && (
            <div>
              <p className="font-semibold text-lg py-3">Receta / Materia prima</p>
              <div className="grid grid-cols-2 gap-5">
                {productRecipe.recipe.recipeDetails.map((ingredient) => (
                  <>
                    <div className="border p-4 bg-white rounded-[12px]">
                      <p className="pb-3 font-semibold">{ingredient.branchProduct.product.name}</p>
                      <Input
                        className="w-full"
                        classNames={{
                          label: 'text-xs font-semibold',
                        }}
                        endContent={
                          <>
                            <select
                              className="outline-none border-0 bg-transparent text-default-400 text-small"
                              id="currency"
                              name="currency"
                              value={ingredient.branchProduct.product.uniMedida}
                              // onChange={(e) =>
                              //   handleEditUniMedida(e.target.value, productsRecipe.indexOf(sp))
                              // }
                            >
                              {filtrarPorCategoria(
                                ingredient.branchProduct.product.unidaDeMedida,
                                services.get014UnidadDeMedida()
                              ).map((tpS) => (
                                <option key={tpS.codigo} value={tpS.codigo}>
                                  {tpS.valores}
                                </option>
                              ))}
                            </select>
                          </>
                        }
                        label="Cantidad a devolver"
                        placeholder="0"
                        variant="bordered"
                      />
                    </div>
                  </>
                ))}
              </div>
            </div>
          )}
          {/* <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-blue-800 font-medium">Total Producido</p>
              <p className="text-xl font-bold text-blue-900">
                {(Number(totalProduced) - Number(damagedQuantity)).toString()} {unit}
              </p>
            </div>
            <div
              className={`${difference < 0 ? 'bg-red-50' : difference > 0 ? 'bg-green-50' : 'bg-gray-50'} p-3 rounded-md`}
            >
              <p
                className={`${difference < 0 ? 'text-red-800' : difference > 0 ? 'text-green-800' : 'text-gray-800'} font-medium`}
              >
                Diferencia
              </p>
              <p
                className={`text-xl font-bold ${difference < 0 ? 'text-red-900' : difference > 0 ? 'text-green-900' : 'text-gray-900'}`}
              >
                {difference > 0 ? '+' : ''}
                {difference} {unit}
              </p>
            </div>
            <div className={`${efficiency < 90 ? 'bg-yellow-50' : 'bg-green-50'} p-3 rounded-md`}>
              <p
                className={`${efficiency < 90 ? 'text-yellow-800' : 'text-green-800'} font-medium`}
              >
                Eficiencia
              </p>
              <p
                className={`text-xl font-bold ${efficiency < 90 ? 'text-yellow-900' : 'text-green-900'}`}
              >
                {efficiency}%
              </p>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
