import React, { useEffect, useMemo, useState } from 'react';

import ProductItem from './product-item';

import { Detail } from '@/types/production-order.types';

type DevolutionProduct = {
  id: number;
  name: string;
  quantity: number;
  uniMedida: string;
  unidadDeMedida: string;
};

type Product = Detail & {
  producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
  hasDevolution: boolean;
  damagedReason: string;
  devolutionProducts: DevolutionProduct[];
};

interface ProductsListProps {
  products: Product[];
  onProductUpdate: (updatedProducts: Product[]) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onProductUpdate }) => {
  const [productsList, setProductsList] = useState<Product[]>(products);

  useEffect(() => {
    setProductsList(products);
  }, [products]);

  const totalExpected = productsList.reduce((sum, product) => sum + product.expectedQuantity, 0);
  const totalProduced = productsList.reduce(
    (sum, product) => sum + (product.producedQuantity || 0),
    0
  );
  const totalDamaged = useMemo(
    () => productsList.reduce((sum, product) => sum + (product.damagedQuantity || 0), 0),
    [productsList]
  );

  const handleQuantityChange = (id: number, produced: number, damaged: number) => {
    const updatedProducts = productsList.map((product) =>
      product.id === id
        ? { ...product, producedQuantity: produced, damagedQuantity: damaged }
        : product
    );

    setProductsList(updatedProducts);
    onProductUpdate(updatedProducts);
  };

  const handleUpdateDevolution = (id: number, hasDevolution: boolean) => {
    const updatedProducts = productsList.map((product) =>
      product.id === id ? { ...product, hasDevolution } : product
    );

    setProductsList(updatedProducts);
    onProductUpdate(updatedProducts);
  };

  const handleAddProductDevolution = (id: number, devolutionProduct: DevolutionProduct[]) => {
    const updatedProducts = productsList.map((product) =>
      product.id === id
        ? { ...product, devolutionProducts: devolutionProduct }
        : product
    );

    setProductsList(updatedProducts);
    onProductUpdate(updatedProducts);
  };


  const updateDamageReason = (id: number, damageReason: string) => {
    const updatedProducts = productsList.map((product) =>
      product.id === id ? { ...product, damagedReason: damageReason } : product
    );

    setProductsList(updatedProducts);
    onProductUpdate(updatedProducts);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Productos ({productsList.length})</h2>
      </div>

      {productsList.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onAddProductDevolution={handleAddProductDevolution}
          onDamageReasonChange={updateDamageReason}
          onDevolutionChange={handleUpdateDevolution}
          onQuantityChange={handleQuantityChange}
        />
      ))}

      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-gray-700 dark:text-gray-300/80 mb-3">Resumen de Producción</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Esperado</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalExpected}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Producido</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalProduced}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm dark:text-gray-300">Total Dañado</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalDamaged}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
