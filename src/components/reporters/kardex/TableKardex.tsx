import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { global_styles } from '@/styles/global.styles';
import EmptyTable from '@/components/global/EmptyTable';
import LoadingTable from '@/components/global/LoadingTable';
import { Kardex } from '@/types/reports/reportKardex.types';
import { useReportKardex } from '@/store/reports/reportKardex.store';


export default function KardexTable({ data }: { data: (data: Kardex[]) => void }) {
  const { kardex, loading } = useReportKardex();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Kardex | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });


  const sortedProducts = useMemo(() => {
    return [...kardex].sort((a, b) => {
      if (sortConfig.key) {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        const numericKeys: (keyof Kardex)[] = ['price'];
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
  }, [kardex, sortConfig]);

  const handleSort = (key: keyof Kardex) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    data(sortedProducts);
  }, [sortedProducts]);

  return (
    <>
      <div className="w-full h-full overflow-y-auto custom-scrollbar xl:pr-4 mt-2" >
        <>
          <div className="h-full min-h-32 overflow-y-auto overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  {[
                    'No.',
                    'Descripción',
                    'Entrada',
                    'Salida',
                    'Existencia',
                    'Precio',
                    'Costo unitario',
                    'Utilidad',
                    'Rentabilidad',
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 select-none cursor-pointer"
                      style={global_styles().darkStyle}
                      onClick={() => {
                        if (header === 'Existencia') {
                          handleSort('quantity');
                        } else if (header === 'Precio') {
                          handleSort('price');
                        }else {
                          setSortConfig({key: null, direction: 'asc'});
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span>{header}</span>
                        {(header === 'Existencia' || header === 'Precio') && (
                          <span className="ml-1 flex flex-row items-center">
                            {sortConfig.key === (header === 'Existencia' ? 'quantity' : 'price') &&
                              (sortConfig.direction === 'asc' ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              ))}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-3 text-sm text-center text-slate-500">
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
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                            {product.productName}
                          </td>
                          {/* <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{product.lastUpdated}</td> */}
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {product.entries}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {product.exits}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {product.quantity}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            ${product.price}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            ${product.cost}
                          </td>
                          {/* <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{product.avgCost}</td> */}
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            ${product.utility.toFixed(2)}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {Number(product.profitability).toFixed(2)}%
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
              </tbody>
            </table>
          </div>
        </>
      </div>
    </>
  );
}
