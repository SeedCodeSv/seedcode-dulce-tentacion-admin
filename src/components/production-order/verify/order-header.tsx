import { ProductionOrderDetailsVerify } from '@/types/production-order.types';
import { formatDate } from '@/utils/formatters';

interface OrderHeaderProps {
  order: ProductionOrderDetailsVerify;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Orden de Producción #{order.id}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{order.productionOrderType.name}</p>
        </div>
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.statusOrder === 'Abierta'
                ? 'bg-blue-100 text-blue-800'
                : order.statusOrder === 'Completada'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800' 
            }`}
          >
            {order.statusOrder}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(order.date)} {order.time}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Empleado</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order.employee.firstName} {order.employee.secondName} {order.employee.firstLastName}{' '}
              {order.employee.secondLastName}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Sucursal de Destino</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order.destinationBranch.name}, {order.destinationBranch.address}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Sucursal de Recepción</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order.receptionBranch.name}, {order.receptionBranch.address}
            </dd>
          </div>
          {order.observations && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.observations || 'Sin observaciones'}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default OrderHeader;
