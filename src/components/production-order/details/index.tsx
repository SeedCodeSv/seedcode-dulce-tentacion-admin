import React from 'react';
import { Truck, Calendar, FileText, ArrowRight, ClipboardList } from 'lucide-react';

import { ProductionOrder } from './types';
import InfoField from './info-field';
import TimelineItem from './timeline-item';
import ProductCard from './products-card';
import FooterDetailOrder from './footer-detail-order';

import { formatDateToddLLLyyyy } from '@/utils/dates';

interface ProductionOrderDetailsProps {
  productionOrder: ProductionOrder;
}

const ProductionOrderDetails: React.FC<ProductionOrderDetailsProps> = ({ productionOrder }) => {
  const {
    statusOrder,
    date,
    time,
    endDate,
    endTime,
    observations,
    moreInformation,
    producedQuantity,
    damagedQuantity,
    missingQuantity,
    finalNotes,
    destinationBranch,
    receptionBranch,
    employee,
  } = productionOrder;

  const historyItems = moreInformation ? JSON.parse(moreInformation) : [];

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completada':
        return {
          message: 'Orden completada',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500',
        };
      case 'en proceso':
        return {
          message: 'Orden en producción',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          dotColor: 'bg-blue-500',
        };
      case 'abierta':
        return {
          message: 'Orden pendiente de iniciar',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500',
        };
      case 'cancelada':
        return {
          message: 'Orden cancelada',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500',
        };
      default:
        return {
          message: 'Estado desconocido',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500',
        };
    }
  };

  const statusInfo = getStatusMessage(statusOrder);

  return (
    <div className="dark:text-white">
      {/* Main Content */}
      <div className="lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Order Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-gray-600 dark:text-gray-200/70" size={20} />
              Detalles de la Orden
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Fecha de Creación" value={formatDateToddLLLyyyy(`${date} ${time}`)} />
              <InfoField
                label="Fecha de Finalización"
                value={endDate ? formatDateToddLLLyyyy(`${endDate} ${endTime}`) : 'Pendiente'}
              />
              <div className="col-span-2">
                <InfoField
                  label="Empleado"
                  value={`${employee.firstName} ${employee.secondName} ${employee.firstLastName} ${employee.secondLastName}`}
                />
              </div>
              <div className="col-span-2">
                <InfoField label="Observaciones" value={observations || 'Ninguna'} />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4 flex items-center">
              <Truck className="mr-2 text-gray-600 dark:text-gray-200/70" size={20} />
              Información de Sucursales
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 dark:border border-gray-300">
              <div className="flex items-center mb-4 ">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Sucursal de Recepción</p>
                  <p className="font-medium">{receptionBranch.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{receptionBranch.address}</p>
                </div>
                <ArrowRight className="mx-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-300">Sucursal de Destino</p>
                  <p className="font-medium">{destinationBranch.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{destinationBranch.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Production Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ClipboardList className="mr-2 text-gray-600 dark:text-gray-200/70" size={20} />
              Resumen de Producción
            </h2>
            <div className="bg-green-50 dark:bg-gray-800 dark:border border-gray-300 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="dark:text-gray-100 text-sm text-gray-500">Producidos</p>
                  <p className="text-2xl font-bold text-green-700">{producedQuantity}</p>
                </div>
                <div>
                  <p className="dark:text-gray-100 text-sm text-gray-500">Dañados</p>
                  <p className="text-2xl font-bold text-red-700">{damagedQuantity}</p>
                </div>
                <div>
                  <p className="dark:text-gray-100 text-sm text-gray-500">Faltantes</p>
                  <p className="text-2xl font-bold text-yellow-700">{missingQuantity}</p>
                </div>
              </div>
              <div >
                <p className="dark:text-gray-100 text-sm text-gray-500">Notas Finales</p>
                <p className="text-gray-700 dark:text-gray-100">{finalNotes || 'Sin notas finales'}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-gray-600 dark:text-gray-200/70" size={20} />
              Historial de la Orden
            </h2>
            <div className="border rounded-lg p-4">
              {historyItems.map((item: string, index: number) => (
                <TimelineItem key={index} isLast={index === historyItems.length - 1} text={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Producto</h2>
          <div className={`${statusInfo.bgColor} px-4 py-2 rounded-lg mb-4 flex items-center`}>
            <div className={`w-2 h-2 ${statusInfo.dotColor} rounded-full mr-2`} />
            <p className={statusInfo.textColor}>{statusInfo.message}</p>
          </div>
          <ProductCard productionOrder={productionOrder} />
        </div>
        <FooterDetailOrder order={productionOrder} />
      </div>
    </div>
  );
};

export default ProductionOrderDetails;
