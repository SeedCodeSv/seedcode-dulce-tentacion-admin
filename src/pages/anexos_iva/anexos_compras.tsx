import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useShoppingReportsStore } from '@/store/reports/shopping_reports.store';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function AnexosCompras() {
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  const [branchId, setBranchId] = useState(0);

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { annexes_list, onGetAnnexes } = useShoppingReportsStore();

  useEffect(() => {
    onGetAnnexes(branchId, startDate, endDate);
  }, [branchId, startDate, endDate]);

  return (
    <Layout title="Iva - Compras">
      <div className=" w-full h-full p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full flex flex-col h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-5">
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
            <Select
              defaultSelectedKeys={`${branchId}`}
              onSelectionChange={(key) => {
                if (key) {
                  setBranchId(Number(key.currentKey));
                }
              }}
              className="w-full"
              placeholder="Selecciona la sucursal"
              classNames={{ label: 'font-semibold' }}
              label="Sucursal"
              labelPlacement="outside"
              variant="bordered"
            >
              {branch_list.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="max-h-full w-full relative  overflow-x-auto overflow-y-auto custom-scrollbar mt-4">
            <table className=" w-full ov">
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
                    1. IMPRESO POR IMPRENTA O TIQUETES
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {shopping.typeDte === "03" ? "03 - COMPROBANTE DE CREDITO FISCAL" : "01 - FACTURA"}
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
