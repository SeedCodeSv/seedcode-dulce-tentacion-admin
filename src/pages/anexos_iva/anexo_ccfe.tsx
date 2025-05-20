import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import { useEffect, useState } from 'react';

import NO_DATA from '../../assets/no.png';

import { csvmaker_ccfe, export_annexes_iva_ccfe } from './utils';

import Layout from '@/layout/Layout';
// import { useBranchesStore } from '@/store/branches.store';
import { useIvaCcfeStore } from '@/store/reports/iva-ccfe.store';
// import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { global_styles } from '@/styles/global.styles';
import { months } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import DivGlobal from "@/themes/ui/div-global";

function AnexoCcfe() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { user } = useAuthStore();
  const { annexes_iva_ccfe, loading_annexes_iva_ccfe, onGetIvaAnnexesCcf } = useIvaCcfeStore();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    onGetIvaAnnexesCcf(
      Number(user?.pointOfSale?.branch.transmitterId),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
  }, [user?.pointOfSale?.branch.transmitterId, monthSelected, yearSelected]);

  const exportAnnexes = async () => {
    const blob = await export_annexes_iva_ccfe(annexes_iva_ccfe);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'anexos-iva-ccfe.xlsx';
    link.click();
  };

  const exportAnnexesCSV = () => {
    const csv = csvmaker_ccfe(annexes_iva_ccfe);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ANEXO_CONTRIBUYENTES.csv';
    link.click();
  };

  return (
    <Layout title="Anexo CCFE">
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
                <SelectItem key={month.value}>
                  {month.name}
                </SelectItem>
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
                <SelectItem key={years.value}>
                  {years.name}
                </SelectItem>
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
              {loading_annexes_iva_ccfe ? (
                <>
                  <div className="w-full flex  mt-20 justify-center items-center flex-col">
                    <Spinner size="lg" />
                    <p className="mt-2 text-xl">Cargando....</p>
                  </div>
                </>
              ) : (
                <>
                  {annexes_iva_ccfe.length > 0 ? (
                    <>
                      <table className=" w-full">
                        <thead className="sticky top-0 z-20 bg-white">
                          <tr>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Fecha
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Cliente
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Numero de control
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Código generación
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              IVA
                            </th>
                            <th className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <>
                            {annexes_iva_ccfe.map((line) => (
                              <tr key={line.id} className="border-b border-slate-200">
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {line.fecEmi}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {line.customer.nombre}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {line.numeroControl}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {line.codigoGeneracion}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {line.totalIva}
                                </td>
                                <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                  {formatCurrency(Number(line.montoTotalOperacion))}
                                </td>
                              </tr>
                            ))}
                          </>
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
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

export default AnexoCcfe;
