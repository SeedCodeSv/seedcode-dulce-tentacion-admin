import { useReportKardex } from '@/store/reports/reportKardex.store';
import { TypeOfMovements } from '@/types/reports/reportKardex.types';
import LoadingTable from '@/components/global/LoadingTable';
import { formatSimpleDate } from '@/utils/dates';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';

export default function TableKardexProduct() {
  const { KardexProduct: kardex, isLoadinKarProd } = useReportKardex();

  return (
    <TableComponent
      className='overflow-auto'
      headers={[
        'No.',
        'Fecha',
        'Descripción',
        'Entrada',
        'Salida',
        'Costo Unitario',
        'Total Movimiento',
      ]}
    >
      {isLoadinKarProd ? (
        <tr>
          <td className="p-3 text-sm text-center text-slate-500" colSpan={7}>
            <LoadingTable />
          </td>
        </tr>
      ) : (
        <>
          {kardex.length > 0 ? (
            kardex.map((product, index) => (
              <tr key={product.id} className="border-b dark:border-slate-600 border-slate-200">
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {' '}
                  {index + 1}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {formatSimpleDate(`${product.date}|${product.time}`)}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                  {product.typeOfInventory}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {product.typeOfMovement === TypeOfMovements.Entries
                    ? product.quantity
                    : 0}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {product.typeOfMovement === TypeOfMovements.Exits
                    ? product.quantity
                    : 0}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  ${Number(product.branchProduct.costoUnitario).toFixed(3)}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  ${product.totalMovement}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>
                <EmptyTable />
              </td>
            </tr>
          )}
        </>
      )}
    </TableComponent>
  );
}
