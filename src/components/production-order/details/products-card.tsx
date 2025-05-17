import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertTriangle, Clock, XCircle } from 'lucide-react';

import { convertToShortNames } from '../utils';

import { ProductionOrderDetail } from './types';

interface ProductCardProps {
  detail: ProductionOrderDetail;
  orderStatus: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ detail, orderStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const { products, quantity, producedQuantity, damagedQuantity, productRecipe } = detail;
  const recipeDetails = productRecipe?.recipe?.recipeDetails || [];

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completada':
        return {
          icon: <Check className="mr-1" size={16} />,
          text: 'Producción completada',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      case 'en proceso':
        return {
          icon: <Clock className="mr-1" size={16} />,
          text: 'En producción',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'abierta':
        return {
          icon: <AlertTriangle className="mr-1" size={16} />,
          text: 'Pendiente de iniciar',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'cancelada':
        return {
          icon: <XCircle className="mr-1" size={16} />,
          text: 'Cancelado',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      default:
        return {
          icon: <AlertTriangle className="mr-1" size={16} />,
          text: 'Estado desconocido',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);

  return (
    <div className="border rounded-lg mb-4 overflow-hidden transition-all duration-300">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        role="button"
        tabIndex={0}
        onClick={toggleExpand}
        onKeyDown={toggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-1 ">
              <h3 className="text-lg font-medium">{products.name}</h3>
              <div className="text-sm text-gray-500 flex items-center gap-2 dark:text-gray-200/70">
                <span className="text-gray-600 dark:text-gray-300">{products.code}</span>
                <span>•</span>
                <span>{products.unidaDeMedida}</span>
              </div>
            </div>
            <div
              className={`px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full flex items-center text-sm mr-4`}
            >
              {statusInfo.icon}
              <span className="hidden md:inline">{statusInfo.text}</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Cantidad</p>
              <p className="font-medium">
                {quantity} {products.unidaDeMedida}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Producidos</p>
              <p className="font-medium">
                {producedQuantity} {products.unidaDeMedida}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Dañados</p>
              <p className="font-medium text-red-600">
                {damagedQuantity} {products.unidaDeMedida}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Estado</p>
              <p className={`font-medium ${statusInfo.textColor}`}>{orderStatus}</p>
            </div>
          </div>
        </div>
        <div>{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t bg-gray-50 transition-all duration-300 ease-in-out dark:bg-gray-800/50">
          <h4 className="font-medium text-gray-700 mb-2 mt-4 dark:text-gray-300">Receta</h4>
          <div className="bg-white rounded-lg border">
            {recipeDetails.length > 0 ? (
              <div className="divide-y">
                {recipeDetails.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between dark:bg-gray-900">
                    <div>
                      <p className="font-medium">{item.branchProduct.product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-200/70">{item.branchProduct.product.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} {convertToShortNames(item.extraUniMedida)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-200/70">
                        Stock: {item.branchProduct.stock}{' '}
                        {convertToShortNames(item.branchProduct.product.uniMedida)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-gray-500 italic">No hay información de receta disponible</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
