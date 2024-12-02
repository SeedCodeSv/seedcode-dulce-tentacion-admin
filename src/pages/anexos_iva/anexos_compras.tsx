import Layout from '@/layout/Layout';
import { useShoppingReportsStore } from '@/store/reports/shopping_reports.store';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { annexes_iva_shopping, csvmaker } from './utils';
import { global_styles } from '@/styles/global.styles';
import { useAuthStore } from '@/store/auth.store';

function AnexosCompras() {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { annexes_list, onGetAnnexes } = useShoppingReportsStore();

  const { transmitter } = useAuthStore();

  useEffect(() => {
    onGetAnnexes(transmitter?.id ?? 0, startDate, endDate);
  }, [transmitter, startDate, endDate]);

  const exportAnnexes = async () => {
    const blob = await annexes_iva_shopping(annexes_list);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'anexos-iva-compras.xlsx';
    link.click();
  };

  const exportAnnexesCSV = async () => {
    const csv = csvmaker(annexes_list);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iva-compras.csv';
    link.click();
  };

  return (
    <Layout title="Iva - Compras">
      <div className=" w-full h-full p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full flex flex-col h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-5">
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-end gap-5 mt-4">
            <Button style={global_styles().thirdStyle} onClick={exportAnnexes}>
              Exportar anexo
            </Button>
            <Button style={global_styles().secondaryStyle} onClick={exportAnnexesCSV}>
              Exportar a CSV
            </Button>
          </div>
          <div className="max-h-full w-full relative  overflow-x-auto overflow-y-auto custom-scrollbar mt-4">
            <table className=" w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Fecha de emisión del documento
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Clase de documento
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Tipo de comprobante
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Número de documento
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    NIT o NRC del proveedor
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Nombre del proveedor
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Iva
                  </th>
                  <th
                    style={{ width: '200px' }}
                    className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {annexes_list.map((shopping) => (
                  <tr key={shopping.id} className="border-b border-slate-200">
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.fecEmi}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.classDocumentCode}. {shopping.classDocumentValue}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.typeDte === '03'
                        ? '03 - COMPROBANTE DE CREDITO FISCAL'
                        : '01 - FACTURA'}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.supplier.numDocumento}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.supplier.nrc}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.supplier.nombre}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(shopping.totalIva))}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(shopping.montoTotalOperacion))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AnexosCompras;
