import Layout from '@/layout/Layout';
// import { useBranchesStore } from '@/store/branches.store';
import { useIvaFeStore } from '@/store/reports/iva-fe.store';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Input, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { annexes_iva_fe, csvmaker_fe } from './utils';
import { global_styles } from '@/styles/global.styles';
import NO_DATA from "../../assets/no.png"
import { useAuthStore } from '@/store/auth.store';

function AnexoFe() {
  // const { branch_list, getBranchesList } = useBranchesStore();
  const { user } = useAuthStore();

  // useEffect(() => {
  //   getBranchesList();
  // }, []);
  // const [branchId, setBranchId] = useState(0);

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const { annexes_iva, onGetAnnexesIva, loading_annexes_fe } = useIvaFeStore();

  useEffect(() => {
    onGetAnnexesIva(Number(user?.correlative?.branch.transmitterId), startDate, endDate);
  }, [user?.correlative?.branch.transmitterId, startDate, endDate]);

  const exportAnnexes = async () => {
    const blob = await annexes_iva_fe(annexes_iva);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'anexos-iva-fe.xlsx';
    link.click();
  };

  const exportAnnexesCSV = () => {
    const csv = csvmaker_fe(annexes_iva);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CONSUMIDOR_FINAL.csv';
    link.click();
  };

  return (
    <Layout title="Anexo FE">
      <div className=" w-full h-full flex flex-col p-6 bg-gray-50 dark:bg-gray-900">
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
            {/* <Select
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
            </Select> */}
          </div>
          <div className="w-full flex justify-end gap-5 mt-4">
            <Button style={global_styles().thirdStyle} onClick={exportAnnexes}>
              Exportar anexo
            </Button>
            <Button style={global_styles().secondaryStyle} onClick={exportAnnexesCSV}>
              Exportar a CSV
            </Button>
          </div>
          <div className="max-h-full w-full  overflow-x-auto overflow-y-auto custom-scrollbar mt-4">

            <>
              {loading_annexes_fe ? (
                <>
                  <div className='w-full flex justify-center items-center flex-col'>
                    <Spinner size='lg' />
                    <p className='mt-2 text-xl'>Cargando....</p>
                  </div>
                </>
              ) : (
                <>
                  {annexes_iva.length > 0 ? (
                    <> <table className=" w-full">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Fecha
                          </th>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Resolución
                          </th>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Series
                          </th>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Numero control del
                          </th>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Numero control al
                          </th>
                          <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <>
                          {annexes_iva.map((shopping) => (
                            <tr key={shopping.day} className="border-b border-slate-200">
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.currentDay}
                              </td>
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.resolution}
                              </td>
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.series}
                              </td>
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.firstNumeroControl}
                              </td>
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.lastNumeroControl}
                              </td>
                              <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {formatCurrency(shopping.totalSales)}
                              </td>
                            </tr>
                          ))}
                        </>
                      </tbody>
                    </table></>
                  ) : (
                    <>
                      <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                        <img className="w-44 mt-10" src={NO_DATA} alt="" />
                        <p className="mt-5 dark:text-white text-gray-600 text-xl">
                          No se encontraron resultados
                        </p>
                      </div></>
                  )}
                </>
              )}
            </>



          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AnexoFe;
