import { Button, Select, SelectItem, Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';

import NO_DATA from '../../assets/no.png';

import { annexes_iva_fe, csvmaker_fe } from './utils';

import Layout from '@/layout/Layout';
import { useIvaFeStore } from '@/store/reports/iva-fe.store';
import { formatCurrency } from '@/utils/dte';
import { global_styles } from '@/styles/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { months } from '@/utils/constants';
import DivGlobal from '@/themes/ui/div-global';

function AnexoFe() {
  const { user } = useAuthStore();
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { annexes_iva, onGetAnnexesIva, loading_annexes_fe } = useIvaFeStore();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    const transId = (user?.pointOfSale?.branch.transmitter.id ?? 0);

    onGetAnnexesIva(
      Number(transId),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
  }, [monthSelected, yearSelected]);

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
     <DivGlobal>
          <div className="w-full flex justify-between gap-5">
            <Select
              className="w-44"
              classNames={{ label: 'font-semibold' }}
              label="Meses"
              labelPlacement="outside"
              selectedKeys={[`${monthSelected}`]}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  setMonthSelected(Number(new Set(key).values().next().value));
                }
              }}
            >
              {months.map((month) => (
                <SelectItem key={month.value}>{month.name}</SelectItem>
              ))}
            </Select>
            <Select
              className="w-44"
              classNames={{ label: 'font-semibold' }}
              label="Año"
              labelPlacement="outside"
              selectedKeys={[`${yearSelected}`]}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  setYearSelected(Number(new Set(key).values().next().value));
                }
              }}
            >
              {years.map((years) => (
                <SelectItem key={years.value}>{years.name}</SelectItem>
              ))}
            </Select>

            <div className="w-full flex justify-end gap-5 mt-4">
              <Button style={global_styles().thirdStyle} onClick={exportAnnexes}>
                Exportar anexo
              </Button>
              <Button style={global_styles().secondaryStyle} onClick={exportAnnexesCSV}>
                Exportar a CSV
              </Button>
            </div>
          </div>

          <div className="max-h-full w-full  overflow-x-auto overflow-y-auto custom-scrollbar mt-4">
            <>
              {loading_annexes_fe ? (
                <>
                  <div className="w-full flex justify-center items-center mt-20 flex-col">
                    <Spinner size="lg" />
                    <p className="mt-2 text-xl">Cargando....</p>
                  </div>
                </>
              ) : (
                <>
                  {annexes_iva.length > 0 ? (
                    <>
                      {' '}
                      <table className=" w-full">
                        <thead className="sticky top-0 z-20 bg-white">
                          <tr>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Fecha
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Numero control del
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Numero control al
                            </th>
                             <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Cod. Generación Inicial
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Cod. Generación Final
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
                                {/* <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.resolution}
                              </td> */}
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {shopping.typeVoucher === 'FE'
                                    ? shopping.firstNumeroControl
                                    : shopping.resolution}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {shopping.typeVoucher === 'FE'
                                    ? shopping.lastNumeroControl
                                    : shopping.series}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {shopping.typeVoucher === 'FE'
                                    ? shopping.firstCorrelativ
                                    : shopping.firstNumeroControl}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {shopping.typeVoucher === 'FE'
                                    ? shopping.lastCorrelative
                                    : shopping.lastNumeroControl}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {formatCurrency(shopping.totalSales)}
                                </td>
                              </tr>
                            ))}
                          </>
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex p-10 flex-col justify-center items-center">
                        <img alt="" className="w-44 mt-10" src={NO_DATA} />
                        <p className="mt-5 dark:text-white text-gray-600 text-xl">
                          No se encontraron resultados
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </DivGlobal>
    </Layout>
  );
}

export default AnexoFe;
