import React, { useEffect, useMemo, useState } from 'react';
import { CheckIcon, AlertCircleIcon } from 'lucide-react';
import { Checkbox, Input } from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { formatNameByCode } from './utils';

import { Detail } from '@/types/production-order.types';
import { filtrarPorCategoria } from '@/components/add-product/validation-add-product';

type Product = Detail & {
  producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
  hasDevolution: boolean;
  damagedReason: string;
  devolutionProducts: DevolutionProduct[];
};

type DevolutionProduct = {
  id: number;
  name: string;
  quantity: number;
  uniMedida: string;
  unidadDeMedida: string;
};

interface ProductItemProps {
  product: Product;
  onQuantityChange: (id: number, produced: number, damaged: number) => void;
  onDevolutionChange: (id: number, hasDevolution: boolean) => void;
  onAddProductDevolution: (id: number, devolutionProduct: DevolutionProduct[]) => void;
  onDamageReasonChange: (id: number, damageReason: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onQuantityChange,
  onDevolutionChange,
  onAddProductDevolution,
  onDamageReasonChange,
}) => {
  const { id, expectedQuantity, products, productRecipe } = product;

  const { name, code, uniMedida: unit } = products;

  const [canReturnProduct, setCanReturnProduct] = useState<boolean>(false);

  const [producedQuantity, setProducedQuantity] = useState<number>(expectedQuantity);
  const [damagedQuantity, setDamagedQuantity] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [damageReason, setDamageReason] = useState<string>('');

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);

  const handleDamagedChange = (text: number) => {
    const value = text;

    setDamagedQuantity(+value);
    onQuantityChange(id, +producedQuantity, +value);
  };

  const handleProducedChange = (text: number) => {
    const value = text;

    setProducedQuantity(+value);
    onQuantityChange(id, +value, +damagedQuantity);
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

  const [devolution, setDevolution] = useState<DevolutionProduct[]>([]);

  useEffect(() => {
    if (productRecipe) {
      setDevolution(
        productRecipe.recipe.recipeDetails.map((item) => ({
          name: item.branchProduct.product.name,
          id: item.branchProduct.id,
          quantity: 0,
          uniMedida: item.branchProduct.product.uniMedida,
          unidadDeMedida: item.branchProduct.product.unidaDeMedida,
        }))
      );
    }
  }, [productRecipe]);

  const handleEditUniMedida = (uniMedida: string, index: number) => {
    const list_suppliers = [...devolution];

    list_suppliers[index].uniMedida = uniMedida;
    setDevolution(list_suppliers);
  };

  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...devolution];

    list_suppliers[index].quantity = Number(quantity);
    setDevolution(list_suppliers);
  };

  useEffect(() => {
    if (canReturnProduct) {
      const validDevolution = devolution.filter((item) => item.quantity > 0);

      onAddProductDevolution(id, validDevolution);
    }
  }, [canReturnProduct, devolution]);

  return (
    <div className="border dark:bg-gray-900 rounded-lg mb-4 bg-white overflow-hidden transition-all duration-200">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300/80">{code}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-300/80">Esperado</p>
            <p className="font-medium">
              {expectedQuantity} {formatNameByCode(unit)}
            </p>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 "
            onClick={() => setExpanded(!expanded)}
          >
            <svg
              className={`w-5 h-5 transform transition-transform dark:text-gray-100 ${expanded ? 'rotate-180' : ''}`}
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
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                classNames={{
                  label: 'font-semibold text-xs',
                  base: 'dark:text-white'
                }}
                label="Cantidad Producida (Buena)"
                labelPlacement="outside"
                placeholder="0.00"
                value={producedQuantity.toString()}
                variant="bordered"
                onValueChange={(text) => handleProducedChange(text as unknown as number)}
              />
            </div>
            <div>
              <Input
                classNames={{
                  label: 'font-semibold text-xs',
                  base: 'dark:text-white'
                }}
                label="Cantidad Dañada/Perdida"
                labelPlacement="outside"
                placeholder="0.00"
                value={damagedQuantity.toString()}
                variant="bordered"
                onValueChange={(text) => handleDamagedChange(text as unknown as number)}
              />
            </div>
            {damagedQuantity > 0 && (
              <div className="mb-4">
                <Input
                  classNames={{
                    label: 'font-semibold text-xs',
                  }}
                  label="Motivo de daño o perdida"
                  labelPlacement="outside"
                  placeholder="Ingrese el motivo del daño o perdida"
                  value={damageReason}
                  variant="bordered"
                  onValueChange={(text) => {
                    setDamageReason(text);
                    onDamageReasonChange(id, text);
                  }}
                />
              </div>
            )}
            <Checkbox
              defaultChecked={canReturnProduct}
              isSelected={canReturnProduct}
              onValueChange={(val) => {
                setCanReturnProduct(val);
                onDevolutionChange(id, val);
              }}
            >
              Devolución de materia prima a inventario
            </Checkbox>
          </div>
          {canReturnProduct && (
            <div>
              <p className="font-semibold text-lg py-3 dark:text-gray-300">Receta / Materia prima</p>
              <div className="grid grid-cols-2 gap-5">
                {devolution.map((ingredient) => (
                  <>
                    <div className="border p-4 bg-white dark:bg-gray-900 rounded-[12px]">
                      <p className="pb-3 font-semibold dark:text-gray-100">{ingredient.name}</p>
                      <Input
                        className="w-full"
                        classNames={{
                          label: 'text-xs font-semibold',
                          base: 'dark:text-white'
                        }}
                        endContent={
                          <>
                            <select
                              className="outline-none border-0 bg-transparent text-default-400 text-small"
                              id="currency"
                              name="currency"
                              value={ingredient.uniMedida}
                              onChange={(e) =>{
                                handleEditUniMedida(String(e.target.value), devolution.indexOf(ingredient));
                                }
                              }
                            >
                              {filtrarPorCategoria(
                                ingredient.unidadDeMedida,
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
                        onValueChange={(text) =>
                          handleEditQuantity(
                            text as unknown as number,
                            devolution.indexOf(ingredient)
                          )
                        }
                      />
                    </div>
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
