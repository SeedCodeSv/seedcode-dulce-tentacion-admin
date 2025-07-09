import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';

import { csvmaker_ccfe, export_annexes_iva_ccfe } from './utils';

import { useIvaCcfeStore } from '@/store/reports/iva-ccfe.store';
import { formatCurrency } from '@/utils/dte';
import { global_styles } from '@/styles/global.styles';
import { months } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import LoadingTable from '@/components/global/LoadingTable';
import useWindowSize from '@/hooks/useWindowSize';

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
  const { windowSize } = useWindowSize()

  return (
    <DivGlobal>
      {windowSize.width < 768 ? (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] flex items-end gap-4">
            <Select
              className="w-44 min-w-[11rem]"
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
              className="w-44 min-w-[11rem]"
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

            <Button
              className="min-w-[160px] px-6"
              style={global_styles().thirdStyle}
              onPress={exportAnnexes}
            >
              Exportar anexo
            </Button>

            <Button
              className="min-w-[160px] px-6"
              style={global_styles().secondaryStyle}
              onPress={exportAnnexesCSV}
            >
              Exportar a CSV
            </Button>
          </div>
        </div>
      ) : (<div className="w-full flex justify-between gap-5">
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
          <Button style={global_styles().thirdStyle} onPress={exportAnnexes}>
            Exportar anexo
          </Button>
          <Button style={global_styles().secondaryStyle} onPress={exportAnnexesCSV}>
            Exportar a CSV
          </Button>
        </div>
      </div>)}


      <>
        {loading_annexes_iva_ccfe ? (
          <>
            <LoadingTable />
          </>
        ) : (
          <>
            {annexes_iva_ccfe.length > 0 ? (
              <>
                <TableComponent
                  className='overflow-auto'
                  headers={[
                    'Fecha',
                    'Cliente',
                    'Numero de control',
                    'Código generación',
                    'IVA',
                    'Total',
                  ]}
                >
                  <>
                    {annexes_iva_ccfe.map((line) => (
                      <tr key={line.id} className="border-b border-slate-200">
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {line.fecEmi}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {line.customer.nombre}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {line.numeroControl}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {line.codigoGeneracion}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {line.totalIva}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {formatCurrency(Number(line.montoTotalOperacion))}
                        </TdGlobal>
                      </tr>
                    ))}
                  </>
                </TableComponent>
              </>
            ) : (
              <div className="p-5">
                <EmptyTable />
              </div>
            )}
          </>
        )}
      </>
    </DivGlobal>
  );
}

export default AnexoCcfe;
