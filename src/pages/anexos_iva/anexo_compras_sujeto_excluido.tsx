import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';

import { csvmakershopexcludedsubject, exportExcellShoppingExcludedSubject, formatTypeDocument } from './utils';

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
import { useShoppingStore } from '@/store/shopping.store';

export default function AnexoComprasSujetoExcluido() {
  const { user } = useAuthStore();
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { shopping_excluded_subject, onGetShoppingExcludedSubject, loading } = useShoppingStore();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    const transId = (user?.pointOfSale?.branch.transmitter.id ?? 0);

    onGetShoppingExcludedSubject(
      Number(transId),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
  }, [monthSelected, yearSelected]);

  const exportAnnexes = async () => {
    const blob = await exportExcellShoppingExcludedSubject(shopping_excluded_subject);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'anexo_compras_a_sujetos_excluidos.xlsx';
    link.click();
  };

  const exportAnnexesCSV = () => {
    const csv = csvmakershopexcludedsubject(shopping_excluded_subject);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Compras_a_sujetos_excluidos.csv';
    link.click();
  };

  return (
    <Layout title="DETALLE DE DOCUMENTOS ANULADOS">
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
          ) : shopping_excluded_subject.length > 0 ? (
            <>
              {' '}
              <TableComponent headers={[
                'TIPO DE DOCUMENTO',
                'PROVEEDOR',
                'FECHA DE EMISIÓN DEL DOCUMENTO',
                'MONTO DE LA OPERACIÓN',
              ]}>
                <>
                  {shopping_excluded_subject.map((item, index) => (
                    <tr key={index} className="border-b border-slate-200">
                      <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                         {`${formatTypeDocument(item.supplier.tipoDocumento).code} ${formatTypeDocument(item.supplier.tipoDocumento).desc}`}
                      </TdGlobal>
                      <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                        {item.supplier.nombre}
                      </TdGlobal>
                      <TdGlobal className="p-3 text-xs text-slate-500 dark:text-slate-100">
                        {item.fecEmi}
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
            <div className='p-5'>
              <EmptyTable />
            </div>
          )}
        </>
      </DivGlobal>
    </Layout >
  );
}
