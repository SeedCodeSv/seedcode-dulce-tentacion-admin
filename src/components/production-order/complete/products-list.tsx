import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, CheckIcon } from 'lucide-react';
import { Checkbox, Input } from '@heroui/react';

import ProductItem from './product-item';
import { formatNameByCode } from './utils';

import { Detail, ProductionOrderDetailsVerify } from '@/types/production-order.types';
import { preventLetters } from '@/utils';


type DevolutionProduct = {
  id: number;
  name: string;
  quantity: number;
  uniMedida: string;
  unidadDeMedida: string;
};

type Product = Detail & {
  // producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
  damagedReason: string;
};

type ProductionOrder = ProductionOrderDetailsVerify & {
  hasDevolution: boolean
  devolutionProducts?: DevolutionProduct[];
};

interface ProductsListProps {
  products: Product[];
  order: ProductionOrder
  onOrderProductUpdate: (updateOrder: ProductionOrder) => void;
  onProductUpdate: (updatedProducts: Product[]) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, order, onOrderProductUpdate }) => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [damageReason, setDamageReason] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);
  const [producedQuantity, setProducedQuantity] = useState<number>(order.quantity);
  const [damagedQuantity, setDamagedQuantity] = useState<number>(0);
  const [canReturnProduct, setCanReturnProduct] = useState<boolean>(false);

  useEffect(() => {
    setProductsList(products);
  }, [products]);

  const handleQuantityChange = (produced: number, damaged: number) => {
    const updatedOrder = {
      ...order,
      producedQuantity: produced,
      damagedQuantity: damaged,
    };

    onOrderProductUpdate(updatedOrder);
  };

  const handleUpdateDevolution = (hasDevolution: boolean) => {
    const updatedOrder = {
      ...order,
      hasDevolution: hasDevolution,
    };

    onOrderProductUpdate(updatedOrder)
  };

  const handleAddProductDevolution = (devolutionProduct: DevolutionProduct[]) => {
    const updatedOrder = {
      ...order,
      devolutionProducts: devolutionProduct
    }

    onOrderProductUpdate(updatedOrder);
  };


  const updateDamageReason = (damageReason: string) => {
    const updatedOrder = {
      ...order,
      damagedReason: damageReason
    }

    onOrderProductUpdate(updatedOrder);
  };

  const getStatusIcon = () => {
    if (order.producedQuantity === order.quantity && order.damagedQuantity === 0) {
      return <CheckIcon className="text-green-500 h-5 w-5" />;
    } else if (order.quantity < order.producedQuantity || order.damagedQuantity > 0) {
      return <AlertCircleIcon className="text-yellow-500 h-5 w-5" />;
    } else {
      return <CheckIcon className="text-green-500 h-5 w-5" />;
    }
  };

  const handleProducedChange = (text: number) => {
    const value = text;

    setProducedQuantity(+value);
    handleQuantityChange(+value, order.damagedQuantity);
  };

  const handleDamagedChange = (text: number) => {
    const value = text;

    setDamagedQuantity(+value);
    handleQuantityChange(+producedQuantity, +value);
  };

  return (
    <div className="mb-8 px-4 xl:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Producto</h2>
      </div>

      <div className="border dark:bg-gray-900 rounded-lg mb-4 bg-white overflow-hidden transition-all duration-200">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">{order.branchProduct.product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300/80">{order.branchProduct.product.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-300/80">Esperado</p>
              <p className="font-medium">
                {order.quantity} {formatNameByCode(order.branchProduct.product.uniMedida)}
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

        {expanded &&
          <>
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
                    value={String(producedQuantity)}
                    variant="bordered"
                    onKeyDown={preventLetters}
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
                        updateDamageReason(text);
                      }}
                    />
                  </div>
                )}
                <Checkbox
                  defaultChecked={canReturnProduct}
                  isSelected={canReturnProduct}
                  onValueChange={(val) => {
                    setCanReturnProduct(val);
                    handleUpdateDevolution(val);
                  }}
                >
                  Devolución de materia prima a inventario
                </Checkbox>
              </div>
              {canReturnProduct && (
                <>
                  <p className="font-semibold text-lg py-3 dark:text-gray-300">Receta / Materia prima</p>
                  <ProductItem
                    canReturnProduct={canReturnProduct}
                    details={productsList}
                    onAddProductDevolution={handleAddProductDevolution}
                    onQuantityChange={handleQuantityChange}
                  />

                </>
              )
              }
            </div>
          </>
        }
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-gray-700 dark:text-gray-300/80 mb-3">Resumen de Producción</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Esperado</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{order.quantity}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Producido</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{producedQuantity}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Dañado</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{damagedQuantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
