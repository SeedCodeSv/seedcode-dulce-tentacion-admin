import { useEffect } from 'react';
import { useSalesInvalidation } from '../store/sales_invalidations.store';

function DetailSale({ id }: { id: number }) {
  const { OnGetDetails, sale } = useSalesInvalidation();

  useEffect(() => {
    OnGetDetails(id);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
      {/* Renderizado de detalles de la venta */}
      <div className="text-center border-b pb-2 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-300">Fecha: {sale.fecEmi}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">Ticket #: {sale.numeroControl}</p>
      </div>

      <div className="mb-4">
        {sale.details?.map?.((detail) => (
          <div
            key={detail.id}
            className="flex justify-between py-2 border-b text-sm border-gray-300 dark:border-gray-700"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {detail.branchProduct.product.name}
              </p>
              <p className="text-gray-500 dark:text-gray-300">Cantidad: {detail.cantidadItem}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-gray-100">${detail.totalItem}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de la Venta */}
      <div className="mt-4 text-sm">
        <div className="flex justify-between py-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">Subtotal:</span>
          <span className="text-gray-900 dark:text-gray-100">${sale.subTotal}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">IVA:</span>
          <span className="text-gray-900 dark:text-gray-100">${sale.totalIva}</span>
        </div>
        <div className="flex justify-between py-2 font-bold text-lg">
          <span className="text-gray-900 dark:text-gray-100">Total:</span>
          <span className="text-gray-900 dark:text-gray-100">${sale.totalPagar}</span>
        </div>
      </div>

      {/* Pie de Página */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-300">Gracias por su compra</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">Visítenos nuevamente</p>
      </div>
    </div>
  );
}

export default DetailSale;
