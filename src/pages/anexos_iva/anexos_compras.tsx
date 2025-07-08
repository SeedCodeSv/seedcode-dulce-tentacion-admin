import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { PiFileCsv, PiMicrosoftExcelLogoBold } from 'react-icons/pi';

import { annexes_iva_shopping, csvmaker } from './utils';

import { formatCurrency } from '@/utils/dte';
import { months } from '@/utils/constants';
import { useShoppingStore } from '@/store/shopping.store';
import { get_user } from '@/storage/localStorage';
import DivGlobal from '@/themes/ui/div-global';
import LoadingTable from '@/components/global/LoadingTable';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';

function AnexosCompras() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { annexes_list, onGetAnnexesShoppingByMonth, loading_shopping } = useShoppingStore();

  const transmiter = get_user();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    onGetAnnexesShoppingByMonth(
      Number(transmiter?.pointOfSale?.branch.transmitter.id),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
  }, [monthSelected, yearSelected]);

  const exportAnnexes = async () => {
    const month = months.find((month) => month.value === monthSelected)?.name || '';
    const blob = await annexes_iva_shopping(annexes_list);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `anexos-iva-compras_${month}_${yearSelected}.xlsx`;
    link.click();
  };

  const exportAnnexesCSV = () => {
    const month = months.find((month) => month.value === monthSelected)?.name || '';
    const csv = csvmaker(annexes_list);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `iva-compras_${month}_${yearSelected}.csv`;
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
          <Button
            className="px-10 "
            color="secondary"
            endContent={<PiMicrosoftExcelLogoBold size={20} />}
            onPress={() => exportAnnexes()}
          >
            Exportar anexo
          </Button>
          <Button
            className="px-10"
            color="primary"
            endContent={<PiFileCsv size={20} />}
            onPress={() => exportAnnexesCSV()}
          >
            Exportar CSV
          </Button>
        </div>
      </div>
      {loading_shopping ? (
        <LoadingTable />
      ) : annexes_list.length > 0 ? (
        <>
          <TableComponent
            headers={[
              'Fecha de emisión del documento',
              'Clase de documento',
              'Tipo de comprobante',
              'Número de documento',
              'NIT o NRC del proveedor',
              'Nombre del proveedor',
              'Iva',
              'Total',
            ]}
          >
            {annexes_list.map((shopping, index) => (
              <tr key={index} className="border-b border-slate-200">
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
          </TableComponent>
        </>
      ) : (
        <>
          <div className="p-5">
            <EmptyTable />
          </div>
        </>
      )}
    </DivGlobal>
  );
}

export default AnexosCompras;
