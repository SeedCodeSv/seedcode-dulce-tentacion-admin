import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { checkOrderFulfillment } from '../stockChecker';


import RecipeDetail from './recipe-detail';

import { ProductionOrderDetailsVerify } from '@/types/production-order.types';


interface ProductListProps {
  // details: Detail[];
  order: ProductionOrderDetailsVerify

}

const ProductList: React.FC<ProductListProps> = ({ order }) => {
  const { canFulfillAll, productStatus } = checkOrderFulfillment(order);
    const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Producto</h2>
        <div className={`px-4 py-2 rounded-md inline-flex items-center text-sm font-medium ${
          canFulfillAll 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {canFulfillAll 
            ? "Todos los productos pueden ser producidos" 
            : "Stock insuficiente para algunos insumos"}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 ">
       <div className="bg-white dark:bg-gray-700/50 shadow overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-md">
      <div
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 mr-3">
              {order.branchProduct.product.name}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-300">({order.branchProduct.product.code})</span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
            Cantidad: {order.quantity} {order.branchProduct.product.unidaDeMedida}
          </p>
        </div>
        <div className="flex items-center dark:text-gray-200">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 animate-fadeIn">
          <RecipeDetail
            orderQuantity={Number(order.quantity)}
            recipe={order.details}
            status={productStatus[order.branchProduct.productId]}
          />
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default ProductList;