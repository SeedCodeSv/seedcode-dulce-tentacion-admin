import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import EmptyTable from '@/components/global/EmptyTable';
import LoadingTable from '@/components/global/LoadingTable';
import { DataKardex } from '@/types/reports/reportKardex.types';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { TableComponent } from '@/themes/ui/table-ui';


export default function KardexTable({ setSorted }: { setSorted: (sorted: string) => void }) {
  const { loading, kardexGeneral } = useReportKardex();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataKardex | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });


  const sortedProducts = useMemo(() => {
    return [...kardexGeneral].sort((a, b) => {
      if (sortConfig.key) {
        setSorted(String(sortConfig.key))
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        const numericKeys: (keyof DataKardex)[] = ['unitCost'];

        if (numericKeys.includes(sortConfig.key)) {
          aValue = Number(String(aValue).replace(/[^0-9.-]+/g, ''));
          bValue = Number(String(bValue).replace(/[^0-9.-]+/g, ''));
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }

      return 0;
    });
  }, [kardexGeneral, sortConfig]);

  const handleSort = (key: keyof DataKardex) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  return (
        <>
          <TableComponent
            headers={[
              'No.',
              'Fecha/Hora',
              'Movimiento/Tipo',
              'Código',
              'Descripción',
              'Cantidad',
              'Stock inicial',
              'Costo Unitario',
              'Total Movimiento',
            ]}

            renderHeader={(header) => (
              <div className="flex items-center">
                <span>{header}</span>
                {(header === 'Cantidad' || header === 'Costo Unitario') && (
                  <span className="ml-1 flex items-center">
                    {sortConfig.key === (header === 'Cantidad' ? 'quantity' : 'unitCost') &&
                      (sortConfig.direction === 'asc' ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      ))}
                  </span>
                )}
              </div>
            )}

            onThClick={(header) => {
              if (header === 'Cantidad') {
                handleSort('quantity');
              } else if (header === 'Costo Unitario') {
                handleSort('unitCost');
              } else {
                setSortConfig({ key: null, direction: 'asc' });
              }
            }}
          >

            {loading ? (
              <tr>
                <td className="p-3 text-sm text-center text-slate-500" colSpan={9}>
                  <LoadingTable />
                </td>
              </tr>
            ) : (
              <>
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product, index) => (
                    <tr key={index} className="border-b dark:border-slate-600 border-slate-200">
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {' '}
                        {index + 1}
                      </td>
                       <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.date}  - {product.time}
                      </td>
                       <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.movementType}  - {product.inventoryType}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                        {product.productCode}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                        {product.productName}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.quantity}
                      </td>
                       <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.initialStock}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.unitCost}
                      </td>
                      
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        ${product.totalMovement}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
        </>
  );
}
