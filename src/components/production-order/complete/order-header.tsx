import React from 'react';

import { Tag } from './ui/tag';

interface OrderHeaderProps {
  orderNumber: string;
  category?: string;
  status: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderNumber, category, status }) => {
  return (
    <div className="px-4 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Orden de Producción #{orderNumber}</h2>
        <p className="text-gray-500 dark:text-gray-300 uppercase text-sm">{category}</p>
      </div>
      <Tag
        text={status}
        type={status === 'Completada' ? 'success' : status === 'En Proceso' ? 'warning' : 'info'}
      />
    </div>
  );
};

export default OrderHeader;
