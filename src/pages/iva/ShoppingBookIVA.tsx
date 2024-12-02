import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useShoppingReportsStore } from '@/store/reports/shopping_reports.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Select, SelectItem } from '@nextui-org/react';
import saveAs from 'file-saver';
import { useEffect, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import { generate_shopping_excel } from '../excel/generate_excel';
import { useViewsStore } from '@/store/views.store';

function ShoppingBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { transmitter, gettransmitter } = useTransmitterStore();

  const { loading, shoppings, onGetShoppingReports } = useShoppingReportsStore();

  const style = useGlobalStyles();

  useEffect(() => {
    gettransmitter();
  }, []);

  useEffect(() => {
    onGetShoppingReports(transmitter.id, monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`);
  }, [transmitter, monthSelected]);

  const handleExportExcel = async () => {
    if (shoppings.length === 0) {
      toast.warning('No se encontraron ventas para el mes seleccionado');
      return;
    }

    const data = shoppings.map((shop, index) => {
      const totalIva = shop.iva.map((i) => Number(i.monto)).reduce((a, b) => a + b, 0);

      return [
        index + 1,
        formatDateToMMDDYYYY(shop.fecEmi),
        shop.generationCode !== 'N/A' ? shop.generationCode : shop.controlNumber,
        shop.supplier.nrc !== '0' ? shop.supplier.nrc : '',
        shop.supplier.tipoDocumento !== 'N/A' ? shop.supplier.numDocumento : shop.supplier.nit,
        shop.supplier.nombre,
        shop.typeSale === 'Interna' ? Number(shop.totalGravada) : 0,
        shop.typeSale === 'Externa' ? Number(shop.totalExenta) : 0,
        Number(totalIva),
        shop.typeSale === 'Interna' ? Number(shop.totalExenta) : 0,
        shop.typeSale === 'Externa' ? Number(shop.totalGravada) : 0,
        Number(shop.montoTotalOperacion),
        Number(shop.ivaPerci1),
        0,
      ];
    });

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await generate_shopping_excel(data, month, transmitter);

    saveAs(blob, `Libro_Compras_${month}.xlsx`);
  };

  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de Compras');
  const actionView = viewName?.actions.name || [];
  return (
    <Layout title="Iva - Compras">
      <div className=" w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
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
                label="Mes"
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
            <div className="flex justify-end items-end mt-3 md:mt-0">
              {actionView.includes('Exportar Excel') && (
                <Button
                  onClick={handleExportExcel}
                  color="success"
                  style={style.thirdStyle}
                  className="text-white font-semibold"
                >
                  Exportar a excel
                  <PiMicrosoftExcelLogoBold size={25} />
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-[400px] md:max-h-[450px] lg:max-h-[500px] xl:max-h-[550px] 2xl:max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Fecha
                  </th>
                  <th className="p-3 text-sm min-w-44 font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    No. doc
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    No. Reg.
                  </th>
                  <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    NIT O DUI
                  </th>
                  <th className="p-3 text-sm min-w-44 font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Nombre del proveedor
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Compras gravadas
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    IVA
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Total compras
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading ? (
                  <>
                    <tr>
                      <td colSpan={8} className="p-3 text-sm text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center w-full h-64">
                          <div className="loader"></div>
                          <p className="mt-3 text-xl font-semibold">Cargando...</p>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {shoppings.map((shopping) => (
                      <tr key={shopping.id} className="border-b border-slate-200">
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {shopping.fecEmi}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {shopping.generationCode}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {shopping.supplier.nrc !== '0' ? shopping.supplier.nrc : ''}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {shopping.supplier.nit === '0'
                            ? ''
                            : shopping.supplier.tipoDocumento !== 'N/A'
                              ? shopping.supplier.numDocumento
                              : shopping.supplier.nit}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {shopping.supplier.nombre}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {formatCurrency(Number(shopping.totalGravada))}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {formatCurrency(Number(shopping.totalIva))}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {formatCurrency(Number(shopping.montoTotalOperacion))}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShoppingBookIVA;
