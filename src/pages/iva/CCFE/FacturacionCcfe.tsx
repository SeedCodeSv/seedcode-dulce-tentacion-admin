import { useMemo } from 'react';

import { FacturacionCcfe } from '@/types/sales_cff.types';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';

interface Props {
  facturacionCcfe: FacturacionCcfe;
}

function FacturacionCcfeItem({ facturacionCcfe }: Props) {
  const totalIva = useMemo(() => {
    return facturacionCcfe.sales.map((cre) => Number(cre.totalIva)).reduce((a, b) => a + b, 0);
  }, [facturacionCcfe]);
  const totalExenta = useMemo(() => {
    return facturacionCcfe.sales.map((cre) => Number(cre.totalExenta)).reduce((a, b) => a + b, 0);
  }, [facturacionCcfe]);

  const totalGravada = useMemo(() => {
    return facturacionCcfe.sales.map((cre) => Number(cre.totalGravada)).reduce((a, b) => a + b, 0);
  }, [facturacionCcfe]);

  const total = useMemo(() => {
    return facturacionCcfe.sales
      .map((cre) => Number(cre.montoTotalOperacion))
      .reduce((a, b) => a + b, 0);
  }, [facturacionCcfe]);

  return (
    <>
      <p className="py-3 text-lg font-semibold">
        CRÉDITOS FISCALES ELECTRÓNICOS ({facturacionCcfe.code})
      </p>
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
          {facturacionCcfe.sales.map((factura, index) => (
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
                {formatCurrency(Number(factura.totalGravada))}
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
      <div className="w-full overflow-x-auto custom-scrollbar mt-10 p-5 dark:bg-gray-800 bg-white border">
        <div className="min-w-[950px]">
          <div className="grid grid-cols-8 w-full">
            <span className="border p-1 font-semibold" />
            <span className="border p-1 text-sm md:font-semibold font-semibold">
              Ventas Exentas
            </span>
            <span className="border p-1 text-sm md:font-semibold font-semibold">
              Ventas Gravadas
            </span>
            <span className="border p-1 text-sm md:font-semibold font-semibold" />
            <span className="border p-1 text-sm md:font-semibold font-semibold">Exportaciones</span>
            <span className="border p-1 text-sm md:font-semibold font-semibold">IVA</span>
            <span className="border p-1 text-sm md:font-semibold font-semibold">Retención</span>
            <span className="border p-1 font-semibold">Total</span>
          </div>
          <div className="grid grid-cols-8 w-full">
            <span className="border p-1">Consumidores finales</span>
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1">{formatCurrency(facturacionCcfe.sales_facturacion)}</span>
            <span className="border p-1" />
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1 font-semibold">
              {formatCurrency(facturacionCcfe.sales_facturacion)}
            </span>
          </div>
          <div className="grid grid-cols-8 w-full">
            <span className="border p-1">Contribuyentes</span>
            <span className="border p-1">{formatCurrency(totalExenta)}</span>
            <span className="border p-1">{formatCurrency(totalGravada)}</span>
            <span className="border p-1" />
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1">{formatCurrency(totalIva)}</span>
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1 font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="grid grid-cols-8 w-full">
            <span className="border p-1">Totales</span>
            <span className="border p-1">{formatCurrency(totalExenta)}</span>
            <span className="border p-1">
              {formatCurrency(totalGravada + facturacionCcfe.sales_facturacion)}
            </span>
            <span className="border p-1" />
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1">{formatCurrency(totalIva)}</span>
            <span className="border p-1">{formatCurrency(0)}</span>
            <span className="border p-1 font-semibold">
              {formatCurrency(total + facturacionCcfe.sales_facturacion)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default FacturacionCcfeItem;
