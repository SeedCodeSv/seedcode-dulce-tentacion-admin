import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { export_excel_credito } from '../excel/generate_excel';
import saveAs from 'file-saver';
import { useViewsStore } from '@/store/views.store';

function CFFBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const { loading_creditos, getCffMonth, creditos_by_month, factura_totals } = useSalesStore();

  useEffect(() => {
    getCffMonth(branchId, monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`);
  }, [monthSelected, branchId]);

  const styles = useGlobalStyles();

  const handleExportExcel = async () => {
    const data = creditos_by_month.map((cre, index) => [
      index + 1,
      cre.fecEmi,
      cre.codigoGeneracion,
      cre.customer.nrc !== '0' ? cre.customer.nrc : '',
      cre.customer.nombre,
      Number(cre.totalExenta),
      Number(cre.totalGravada),
      Number(cre.totalIva),
      0,
      0,
      0,
      Number(cre.montoTotalOperacion),
    ]);

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_credito(
      month,
      data,
      {
        total: factura_totals,
        iva: 0,
        exenta: 0,
        gravada: factura_totals,
        retencion: 0,
      },
      transmitter
    );

    saveAs(blob, `Libro_Ventas_CCF_${month}.xlsx`);
  };

  const totalIva = useMemo(() => {
    return creditos_by_month.map((cre) => Number(cre.totalIva)).reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);
  const totalExenta = useMemo(() => {
    return creditos_by_month.map((cre) => Number(cre.totalExenta)).reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const totalGravada = useMemo(() => {
    return creditos_by_month.map((cre) => Number(cre.totalGravada)).reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const total = useMemo(() => {
    return creditos_by_month
      .map((cre) => Number(cre.montoTotalOperacion))
      .reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de CCF');
  const actionView = viewName?.actions.name || [];
  return (
    <Layout title="IVA - CFF">
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
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
          <div>
            <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              {loading_creditos ? (
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader"></div>
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {creditos_by_month.length > 0 ? (
                    <>
                      <table className="w-full">
                        <thead className="sticky top-0 z-20 dark:bg-black bg-white">
                          <tr>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Fecha
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              No. Comp.
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              No. Reg.
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Nombre del Cliente
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Exenta
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Gravada
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Iva
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditos_by_month.map((factura, index) => (
                            <tr key={index} className="border-b border-slate-200">
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatDateToMMDDYYYY(factura.fecEmi)}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {factura.codigoGeneracion}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {factura.customer.nrc !== '0' ? factura.customer.nrc : ''}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {factura.customer.nombre}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatCurrency(Number(factura.totalExenta))}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatCurrency(Number(factura.totalGravada))}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatCurrency(Number(factura.totalIva))}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatCurrency(Number(factura.montoTotalOperacion))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                      <p className="mt-5 dark:text-white text-gray-600 text-xl">
                        No se encontraron resultados
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar mt-10 p-5 dark:bg-gray-800 bg-white border">
              <div className="min-w-[950px]">
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1 font-semibold"></span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Exentas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Gravadas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold"></span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Exportaciones
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">IVA</span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Retención
                  </span>
                  <span className="border p-1 font-semibold">Total</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Consumidores finales</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(factura_totals)}</span>
                  <span className="border p-1"></span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">{formatCurrency(factura_totals)}</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Contribuyentes</span>
                  <span className="border p-1">{formatCurrency(totalExenta)}</span>
                  <span className="border p-1">{formatCurrency(totalGravada)}</span>
                  <span className="border p-1"></span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(totalIva)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Totales</span>
                  <span className="border p-1">{formatCurrency(totalExenta)}</span>
                  <span className="border p-1">
                    {formatCurrency(totalGravada + factura_totals)}
                  </span>
                  <span className="border p-1"></span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(totalIva)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">
                    {formatCurrency(total + factura_totals)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CFFBookIVA;
