import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import { export_excel_facturacion } from '../excel/generate_excel';
import saveAs from 'file-saver';
import { formatDateMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { useViewsStore } from '@/store/views.store';
// import { jsPDF } from "jspdf"
// import autoTable from "jspdf-autotable"

function FEBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

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
    const vouchers: Array<{ name: string; items: Array<Array<string | number>> }> = [];
    facturas_by_month.forEach((voucher) => {
      const formatName = (type: string) => {
        switch (type) {
          case 'T':
            return 'Tickets';
          case 'F':
            return 'Facturas';
          case 'FE':
            return 'Facturas Electrónicas';
        }
      };

      vouchers.push({
        name: formatName(voucher.typeVoucher) + ' ' + `(${voucher.code})`,
        items: voucher.sales.map((venta) => {
          return [
            formatDateMMDDYYYY(venta.day, monthSelected),
            venta.firstCorrelativ!,
            venta.lastCorrelative!,
            venta.firstNumeroControl!,
            venta.lastNumeroControl!,
            venta.firstSelloRecibido,
            venta.lastSelloRecibido,
            '',
            Number(venta.totalSales),
            '',
            Number(venta.totalSales),
            '',
          ];
        }),
      });
    });

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_facturacion({
      transmitter,
      month,
      items: vouchers,
      year: yearSelected,
    });

    saveAs(blob, `Libro_Consumidor_Final_${month}.xlsx`);
  };
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de FE');

  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="IVA - FE">
      <div className=" w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <Select
                defaultSelectedKeys={`${monthSelected}`}
                onSelectionChange={(key) => {
                  if (key) {
                    setMonthSelected(Number(new Set(key).values().next().value));
                  }
                }}
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                label="Meses"
                labelPlacement="outside"
                variant="bordered"
              >
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <Select
                selectedKeys={[`${yearSelected}`]}
                onSelectionChange={(key) => {
                  if (key) {
                    setYearSelected(Number(new Set(key).values().next().value));
                  }
                }}
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                label="Año"
                labelPlacement="outside"
                variant="bordered"
              >
                {years.map((years) => (
                  <SelectItem key={years.value} value={years.value}>
                    {years.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <Select
                defaultSelectedKeys={`${branchId}`}
                onSelectionChange={(key) => {
                  if (key) {
                    setBranchId(Number(new Set(key).values().next().value));
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
            <div className="flex justify-end items-end mt-3 md:mt-0">
              {/* <Button onClick={handleExportPDF} color="danger">
                Exportar a PDF
              </Button> */}
              {actionView.includes('Exportar Excel') && (
                <Button
                  onClick={handleExportExcel}
                  color="success"
                  style={styles.thirdStyle}
                  className="text-white font-semibold"
                >
                  Exportar a excel
                  <PiMicrosoftExcelLogoBold size={25} />
                </Button>
              )}
            </div>
          </div>

          <div className='max-w-full overflow-x-auto'>
            <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              {loading_facturas ? (
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader"></div>
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {facturas_by_month.map((facturas, index) => (
                    <Fragment>
                      {facturas.sales.length > 0 ? (
                        <>
                          <div className="w-full py-10">
                            <p>
                              {facturas.typeVoucher === 'F' && `Facturas (${facturas.resolution})`}
                              {facturas.typeVoucher === 'FE' &&
                                `Facturas Electrónicas (${facturas.code})`}
                              {facturas.typeVoucher === 'T' && `Tickets (${facturas.code})`}
                            </p>
                          </div>
                          <table className="w-full">
                            <thead className="sticky top-0 z-20 bg-white">
                              <tr>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Fecha
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Correlativo Inicial
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Correlativo Final
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Numero Control Inicial
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Numero Control Final
                                </th>
                                {/* <th className="p-3 w-32 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Sello Recibido Inicial
                                </th> */}
                                {/* <th className="p-3 w-32 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Sello Recibido Final
                                </th> */}
                                <th className="p-3 text-xs font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {facturas.sales.map((factura, index) => (
                                <tr key={index} className="border-b border-slate-200">
                                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {formatDateMMDDYYYY(factura.day, monthSelected)}
                                  </td>
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {factura.firstCorrelativ!}
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
                                  {/* <td className="p-3 w-32 text-xs text-slate-500 dark:text-slate-100">
                                    <p className="truncate w-44">{factura.firstSelloRecibido!}</p>
                                  </td>
                                  <td className="p-3 w-32 text-xs text-slate-500 dark:text-slate-100">
                                  <p className="truncate w-44">{factura.lastSelloRecibido!}</p>
                                  </td> */}
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {formatCurrency(Number(factura.totalSales))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div>
                            <p className="mt-5">
                              /1.13 = VENTAS NETAS GRAVADAS:{' '}
                              {formatCurrency(
                                facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0) / 1.13
                              )}
                            </p>
                            <p className="mt-2">
                              POR 13% IMPUESTO (DEBITO FISCAL):{' '}
                              {formatCurrency(
                                (facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0) /
                                  1.13) *
                                0.13
                              )}
                            </p>
                            <p className="mt-2">
                              TOTAL VENTAS GRAVADAS:{' '}
                              {formatCurrency(
                                facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0)
                              )}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                            <p>
                              {index === 0
                                ? 'FACTURAS(' + facturas.resolution + ')'
                                : 'Punto de Venta(' + facturas.code + ')'}
                            </p>
                            <p className="mt-5 dark:text-white text-gray-600 text-xl">
                              No se encontraron resultados
                            </p>
                          </div>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FEBookIVA;
