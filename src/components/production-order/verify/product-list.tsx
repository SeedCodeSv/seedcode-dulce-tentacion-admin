import { checkOrderFulfillment } from '../stockChecker';

import ProductCard from './product-card';

import { Detail } from '@/types/production-order.types';

interface ProductListProps {
  details: Detail[];
}

const ProductList: React.FC<ProductListProps> = ({ details }) => {
  const { canFulfillAll, productStatus } = checkOrderFulfillment(details);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Productos ({details.length})</h2>
        <div className={`px-4 py-2 rounded-md inline-flex items-center text-sm font-medium ${
          canFulfillAll 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {canFulfillAll 
            ? "Todos los productos pueden ser producidos" 
            : "Stock insuficiente para algunos productos"}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {details.map((detail) => (
          <ProductCard
            key={detail.id} 
            detail={detail} 
            status={productStatus[detail.productId]}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;