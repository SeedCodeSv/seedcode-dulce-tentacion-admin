import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';

import { annexes_iva_fe, csvmaker_fe } from './utils';

import Layout from '@/layout/Layout';
import { useIvaFeStore } from '@/store/reports/iva-fe.store';
import { formatCurrency } from '@/utils/dte';
import { global_styles } from '@/styles/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { months } from '@/utils/constants';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import LoadingTable from '@/components/global/LoadingTable';

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
    const transId = user?.pointOfSale?.branch.transmitter.id ?? 0;

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
          <Button style={global_styles().thirdStyle} onPress={exportAnnexes}>
            Exportar anexo
          </Button>
          <Button style={global_styles().secondaryStyle} onPress={exportAnnexesCSV}>
            Exportar a CSV
          </Button>
        </div>
      </div>
      <>
        {loading_annexes_fe ? (
          <>
            <LoadingTable />
          </>
        ) : (
          <>
            {annexes_iva.length > 0 ? (
              <>
                {' '}
                <TableComponent
                  headers={[
                    'Fecha',
                    'Numero control del',
                    'Numero control al',
                    ' Cod. Generación Inicial',
                    ' Cod. Generación Final',
                    'Total',
                  ]}
                >
                  <>
                    {annexes_iva.map((shopping) => (
                      <tr key={shopping.day} className="border-b border-slate-200">
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {shopping.currentDay}
                        </TdGlobal>
                        {/* <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                {shopping.resolution}
                              </TdGlobal> */}
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {shopping.typeVoucher === 'FE'
                            ? shopping.firstNumeroControl
                            : shopping.resolution}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {shopping.typeVoucher === 'FE'
                            ? shopping.lastNumeroControl
                            : shopping.series}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {shopping.typeVoucher === 'FE'
                            ? shopping.firstCorrelativ
                            : shopping.firstNumeroControl}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {shopping.typeVoucher === 'FE'
                            ? shopping.lastCorrelative
                            : shopping.lastNumeroControl}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                          {formatCurrency(shopping.totalSales)}
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

export default AnexoFe;
