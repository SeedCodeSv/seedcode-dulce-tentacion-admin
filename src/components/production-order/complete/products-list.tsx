import React, { useState } from 'react';

import ProductItem from './product-item';

import { Detail } from '@/types/production-order.types';

type Product = Detail & {
  producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
};

interface ProductsListProps {
  products: Product[];
  onProductUpdate: (updatedProducts: Product[]) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const [productsList] = useState<Product[]>(products);

  const totalExpected = productsList.reduce((sum, product) => sum + product.expectedQuantity, 0);
  const totalProduced = productsList.reduce((sum, product) => sum + (product.producedQuantity || 0), 0);
  const totalDamaged = productsList.reduce((sum, product) => sum + (product.damagedQuantity || 0), 0);
  const totalEfficiency = totalExpected > 0 ? Math.round((totalProduced / totalExpected) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Productos ({productsList.length})</h2>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="text-green-800 font-medium">Eficiencia Total: {totalEfficiency}%</span>
        </div>
      </div>

      {productsList.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onQuantityChange={()=>{}}
        />
      ))}

      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-gray-700 mb-3">Resumen de Producción</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm">Total Esperado</p>
            <p className="text-xl font-bold text-gray-800">{totalExpected}</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm">Total Producido</p>
            <p className="text-xl font-bold text-gray-800">{totalProduced}</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-gray-500 text-sm">Total Dañado</p>
            <p className="text-xl font-bold text-gray-800">{totalDamaged}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;