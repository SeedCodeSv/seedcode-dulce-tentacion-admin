import { useSalesStore } from '@/store/sales.store';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';

function TableCcfe() {
  const { creditos_by_month } = useSalesStore();

  // Función para calcular Gravada sin IVA
const calculateGravadaWithoutVAT = (gravada: number, total: number) => {
  if (gravada === total) {
    return parseFloat((gravada / 1.13).toFixed(2)); // Eliminar IVA y redondear a 2 decimales
  }

  return gravada;
};

  return (
    <table className="w-full">
      <thead className="sticky top-0 z-20 dark:bg-black bg-white">
        <tr>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Fecha
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            No. Comp.
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            No. Reg.
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Nombre del Cliente
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Exenta
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Gravada
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Iva
          </th>
          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {creditos_by_month.map((factura, index) => (
          <tr key={index} className="border-b border-slate-200">
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatDateToMMDDYYYY(factura.fecEmi)}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {factura.codigoGeneracion}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {factura.customer.nrc !== '0' ? factura.customer.nrc : ''}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {factura.customer.nombre}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number(factura.totalExenta))}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {/* {formatCurrency(Number(factura.totalGravada))} */}
              {formatCurrency(
                calculateGravadaWithoutVAT(
                  Number(factura.totalGravada),
                  Number(factura.montoTotalOperacion)
                )
              )}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number(factura.totalIva))}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number(factura.montoTotalOperacion))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableCcfe;
