import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import saveAs from 'file-saver';

import { export_excel_facturacion } from '../excel/generate_excel';

import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatDateMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';

function FEBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  const { facturas_by_month, loading_facturas, getFeMonth } = useSalesStore();

  useEffect(() => {
    getFeMonth(branchId, monthSelected, yearSelected);
  }, [monthSelected, branchId, yearSelected]);

  const styles = useGlobalStyles();

  const handleExportExcel = async () => {
    if (facturas_by_month.length === 0) {
      toast.warning('No se encontraron facturas para el mes seleccionado');

      return;
    }
    const data = facturas_by_month.map((factura) => {
      return [
        formatDateMMDDYYYY(factura.day, monthSelected, yearSelected),
        factura.firstNumeroControl!.replace(/-/g, ''),
        factura.lastNumeroControl!.replace(/-/g, ''),
        Number(factura.totalExenta) + Number(factura.totalNoSuj),
        Number(factura.totalGravado),
        0,
        Number(factura.totalNoSuj) + Number(factura.totalExenta) + Number(factura.totalGravado),
        0,
      ];
    });

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_facturacion({
      branch: branchName,
      transmitter,
      month,
      items: data,
      year: yearSelected,
    });

    saveAs(blob, `Libro_Consumidor_Final_${month}.xlsx`);
  };
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de FE');

  const actionView = viewName?.actions.name || [];

  const total = useMemo(() => {
    return facturas_by_month
      .map((factura) => {
        return Number(factura.totalGravado);
      })
      .reduce((a, b) => a + b, 0);
  }, [facturas_by_month]);

  const iva_total = useMemo(() => {
    return total / 1.13;
  }, [total]);

  const iva_result = useMemo(() => {
    return iva_total * 0.13;
  }, [total]);

  const $calcExenta = useMemo(() => {
    return facturas_by_month.reduce((a, b) => a + Number(b.totalExenta), 0);
  }, [facturas_by_month]);

  const $calcNoSuj = useMemo(() => {
    return facturas_by_month.reduce((a, b) => a + Number(b.totalNoSuj), 0);
  }, [facturas_by_month]);

  return (
    <DivGlobal>
      <div className="w-full flex flex-col lg:flex-row gap-5">
        <div className="w-full">
          <Select
            className="w-full"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={`${monthSelected}`}
            label="Meses"
            labelPlacement="outside"
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
        </div>
        <div className="w-full">
          <Select
            className="w-full"
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
        </div>
        <div className="w-full">
          <Select
            className="w-full"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={`${branchId}`}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const id = Number(new Set(key).values().next().value);

                setBranchId(id);
                const branch = branch_list.find((branch) => branch.id == id);

                if (branch) setBranchName(branch.name);
              }
            }}
          >
            {branch_list.map((branch) => (
              <SelectItem key={branch.id}>{branch.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex justify-end items-end mt-3 md:mt-0">
          {/* <Button onClick={handleExportPDF} color="danger">
                Exportar a PDF
              </Button> */}
          {actionView.includes('Exportar Excel') && (
            <Button
              className="text-white font-semibold"
              color="success"
              style={styles.thirdStyle}
              onClick={handleExportExcel}
            >
              Exportar a excel
              <PiMicrosoftExcelLogoBold size={25} />
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
          {loading_facturas ? (
            <div className="w-full flex justify-center p-20 items-center flex-col">
              <div className="loader" />
              <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
            </div>
          ) : facturas_by_month.length === 0 ? (
            <>
              <div className="p-10">
                <EmptyTable />
              </div>
            </>
          ) : (
            <>
              <TableComponent
                headers={[
                  'Fecha',
                  'Cód. Generación Inicial',
                  'Cód. Generación Final',
                  'Numero Control Inicial',
                  'Numero Control Final',
                  'Total gravado',
                  'Total Exento',
                  'Total no sujeto',
                ]}
              >
                {facturas_by_month.map((factura, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {formatDateMMDDYYYY(factura.day, monthSelected, yearSelected)}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {factura.firstCorrelative!}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {factura.lastCorrelative!}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {factura.firstNumeroControl!}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {factura.lastNumeroControl!}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(factura.totalGravado))}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(factura.totalExenta))}
                    </td>
                    <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(factura.totalNoSuj))}
                    </td>
                  </tr>
                ))}
              </TableComponent>
              <div className="grid grid-cols-2">
                <div>
                  <p className="mt-5">/1.13 = VENTAS NETAS GRAVADAS: {formatCurrency(iva_total)}</p>
                  <p className="mt-2">
                    POR 13% IMPUESTO (DEBITO FISCAL): {formatCurrency(iva_result)}
                  </p>
                  <p className="mt-2">TOTAL VENTAS GRAVADAS: {formatCurrency(total)}</p>
                </div>
                <div>
                  <p className="mt-5">VENTA NO SUJETA: {formatCurrency($calcExenta)}</p>
                  <p className="mt-2">VENTA EXENTA: {formatCurrency($calcNoSuj)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DivGlobal>
  );
}

export default FEBookIVA;
