import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';

import { csvmakeranulateds, exportExcellAnulated, formatTypeDte } from './utils';

import Layout from '@/layout/Layout';
import { formatCurrency } from '@/utils/dte';
import { global_styles } from '@/styles/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { months } from '@/utils/constants';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import LoadingTable from '@/components/global/LoadingTable';
import { useIvaAnulatedStore } from '@/store/reports/iva-anulados.store';

export default function AnexoAnulados() {
  const { user } = useAuthStore();
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { annexes_anulated, onGetAnnexesIvaAnulated, loading } = useIvaAnulatedStore();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    const transId = user?.pointOfSale?.branch.transmitter.id ?? 0;

    onGetAnnexesIvaAnulated(
      Number(transId),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
  }, [monthSelected, yearSelected]);

  const exportAnnexes = async () => {
    const blob = await exportExcellAnulated(annexes_anulated);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'anexo_detalle_anulados.xlsx';
    link.click();
  };

  const exportAnnexesCSV = () => {
    const csv = csvmakeranulateds(annexes_anulated);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Detalle_Anulados.csv';
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
        {loading ? (
          <>
            <LoadingTable />
          </>
        ) : annexes_anulated.length > 0 ? (
          <>
            {' '}
            <TableComponent
              headers={[
                'NÚMERO DE RESOLUCIÓN',
                'TIPO DE DOCUMENTO',
                'NÚMERO DE SERIE',
                'CÓDIGO DE GENERACIÓN',
                'TOTAL',
              ]}
            >
              <>
                {annexes_anulated.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {item.numeroControl}
                    </TdGlobal>
                    <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {`${formatTypeDte(item.tipoDte).code} ${formatTypeDte(item.tipoDte).desc}`}
                    </TdGlobal>
                    <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {item.selloRecibido}
                    </TdGlobal>
                    <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {item.codigoGeneracion}
                    </TdGlobal>
                    <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(item.montoTotalOperacion ?? 0))}
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
    </DivGlobal>
  );
}
