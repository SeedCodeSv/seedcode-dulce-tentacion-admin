import React from 'react';

import OrderHeader from './order-header';
import ProductList from './product-list';

import { ProductionOrderDetailsVerify } from '@/types/production-order.types';

interface ProductionOrderViewProps {
  productionOrder: ProductionOrderDetailsVerify;
}

const ProductionOrderView: React.FC<ProductionOrderViewProps> = ({ productionOrder }) => {
  return (
    <div className="space-y-6 animate-fadeIn ">
      <OrderHeader order={productionOrder} />
      <ProductList details={productionOrder.details} />
    </div>
  );
};

export default ProductionOrderView;