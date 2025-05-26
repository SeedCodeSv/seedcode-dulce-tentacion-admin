// import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// import RecipeDetail from './recipe-detail';

import { Detail, ProductStatus } from '@/types/production-order.types';

interface ProductCardProps {
  detail: Detail;
  status: ProductStatus;
}

const ProductCard: React.FC<ProductCardProps> = () => {
  // const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-700/50 shadow overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-md">
      {/* <div
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 mr-3">
              {detail.branchProduct.product.name}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-300">({detail.branchProduct.product.code})</span>
            {status.canFulfill ? (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="mr-1" size={14} />
                Se puede producir
              </span>
            ) : (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="mr-1" size={14} />
                Stock Insuficiente
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
            Cantidad: {detail.quantity} {detail.branchProduct.product.unidaDeMedida}
          </p>
        </div>
        <div className="flex items-center dark:text-gray-200">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 animate-fadeIn">
          <RecipeDetail
            orderQuantity={Number(detail.quantity)}
            recipe={detail}
            status={status}
          />
        </div>
      )} */}
    </div>
  );
};

export default ProductCard;
