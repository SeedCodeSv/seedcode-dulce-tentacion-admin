import { useMemo } from 'react';

import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { useSalesStore } from '@/store/sales.store';
import { TableComponent } from '@/themes/ui/table-ui';
import { SalesCcf } from '@/types/sales_cff.types';
import TdGlobal from '@/themes/ui/td-global';


function FacturacionCcfeItem() {
  const { creditos_by_month, notas_credito_by_month, factura_totals } = useSalesStore()
  const totalIva = useMemo(() => {

    if (creditos_by_month.length > 0) {
      const ivaCcfe = creditos_by_month.map((cre) => Number(cre.totalIva)).reduce((a, b) => a + b, 0)
      // const ivaNotas = notas_credito_by_month
      //   .map((nota: CreditNote) => Number(nota.totalGravada))
      //   .reduce((a, b) => a + b, 0) * 0.13

      // return parseFloat((ivaCcfe - ivaNotas).toFixed(2))
      return parseFloat((ivaCcfe).toFixed(2))
    } else {
      return 0
    }
  }, [creditos_by_month, notas_credito_by_month])

  const totalExenta = useMemo(() => {
    const creditosExentas = creditos_by_month
      .map((cre) => Number(cre.totalExenta) + Number(cre.totalNoSuj))
      .reduce((a, b) => a + b, 0)

    // const notasExentas = notas_credito_by_month
    //   .map((nota: CreditNote) => Number(nota.totalExenta) + Number(nota.totalNoSuj))
    //   .reduce((a, b) => a + b, 0)

    // return parseFloat((creditosExentas - notasExentas).toFixed(2))
    return parseFloat((creditosExentas).toFixed(2))

  }, [creditos_by_month, notas_credito_by_month])

  const totalGravada = useMemo(() => {
    const creditosGravados = creditos_by_month
      .map((cre) => Number(cre.totalGravada))
      .reduce((a, b) => a + b, 0)

    // const notasGravadas = notas_credito_by_month
    //   .map((nota: CreditNote) => Number(nota.totalGravada))
    //   .reduce((a, b) => a + b, 0)

    // return parseFloat((creditosGravados - notasGravadas).toFixed(2))
    return parseFloat((creditosGravados).toFixed(2))
  }, [creditos_by_month, notas_credito_by_month])

  const total = useMemo(() => {
    const totalCfe = creditos_by_month
      .map((cre) => Number(cre.montoTotalOperacion))
      .reduce((a, b) => a + b, 0)

    // const totalNotas = notas_credito_by_month
    //   .map((nota) => Number(nota.montoTotalOperacion))
    //   .reduce((a, b) => a + b, 0)

    // return parseFloat((totalCfe - totalNotas).toFixed(2))
    return parseFloat((totalCfe).toFixed(2))

  }, [creditos_by_month, notas_credito_by_month])

  const facturasIva = useMemo(() => {
    const sinIva = factura_totals.sales_gravadas / 1.13
    const iva = factura_totals.sales_gravadas - sinIva

    return iva
  }, [factura_totals])

  return (
    <>
      <p className="py-3 text-lg font-semibold">
        CRÉDITOS FISCALES ELECTRÓNICOS
      </p>
      <TableComponent headers={['Fecha', 'No. Comp', 'Tipo Comp.', 'No. Reg.', 'Nombre del Cliente', 'Exenta', 'Gravada', 'Iva', 'Total']}>
        {creditos_by_month.map((factura, index) => (
          <tr key={index} className="border-b border-slate-200">
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatDateToMMDDYYYY(factura.fecEmi)}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {factura.codigoGeneracion}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
               Comprobante de Crédito Fiscal
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
             {factura.customer.nrc}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {factura.customer.nombre}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(
                Number(factura.totalExenta) + Number(factura.totalNoSuj)
              )}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number(factura.totalGravada))}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number((factura as SalesCcf).totalIva))}
            </TdGlobal>
            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(Number(factura.montoTotalOperacion))}
            </TdGlobal>
          </tr>
        ))}
      </TableComponent>
      <div className="w-full overflow-x-auto custom-scrollbar mt-10 p-5 dark:bg-gray-800 bg-white border">
        <table className="min-w-[950px] w-full border border-collapse text-sm">
          <thead>
            <tr className="font-semibold text-center">
              {['', 'Ventas Exentas', 'Ventas Gravadas', '', 'Exportaciones', 'IVA', 'Retención', 'Total'].map((header) =>
                <th key={header} className="border p-1" >{header}</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">Consumidores finales</td>
              <td className="border p-1">
                {formatCurrency(factura_totals.sales_exentas + factura_totals.sales_no_sujetas)}
              </td>
              <td className="border p-1">
                {formatCurrency(factura_totals.sales_gravadas / 1.13)}
              </td>
              <td className="border p-1 w-20" />
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1">
                {formatCurrency(
                  factura_totals.sales_gravadas - factura_totals.sales_gravadas / 1.13
                )}
              </td>
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1 font-semibold">
                {formatCurrency(
                  factura_totals.sales_exentas +
                  factura_totals.sales_gravadas +
                  factura_totals.sales_no_sujetas
                )}
              </td>
            </tr>

            <tr>
              <td className="border p-1">Contribuyentes</td>
              <td className="border p-1">{formatCurrency(totalExenta)}</td>
              <td className="border p-1">{formatCurrency(totalGravada)}</td>
              <td className="border p-1" />
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1">{formatCurrency(totalIva)}</td>
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1 font-semibold">{formatCurrency(total)}</td>
            </tr>

            <tr>
              <td className="border p-1">Totales</td>
              <td className="border p-1">
                {formatCurrency(
                  totalExenta + (factura_totals.sales_exentas + factura_totals.sales_no_sujetas)
                )}
              </td>
              <td className="border p-1">
                {formatCurrency(totalGravada + factura_totals.sales_gravadas / 1.13)}
              </td>
              <td className="border p-1" />
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1">{formatCurrency(totalIva + facturasIva)}</td>
              <td className="border p-1">{formatCurrency(0)}</td>
              <td className="border p-1 font-semibold">
                {formatCurrency(
                  total +
                  factura_totals.sales_exentas +
                  factura_totals.sales_no_sujetas +
                  factura_totals.sales_gravadas
                )}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </>
  );
}

export default FacturacionCcfeItem;
