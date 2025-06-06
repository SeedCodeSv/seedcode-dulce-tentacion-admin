import { Input, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';

import Layout from '../../layout/Layout';
import { formatDate } from '../../utils/dates';

import GraphicProductCategory from './Product/GraphicProductCategory';

import { salesReportStore } from '@/store/reports/sales_report.store';
import { formatCurrency } from '@/utils/dte';
import { useBranchesStore } from '@/store/branches.store';
import { useAuthStore } from '@/store/auth.store';
import DivGlobal from '@/themes/ui/div-global';
import LoadingTable from '@/components/global/LoadingTable';
import { TableComponent } from '@/themes/ui/table-ui';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import { report_sales_by_products } from '@/services/reports/reports-by-periods.services';
import { salesByProductsExports } from '@/components/export-reports/SalesByProduct';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useViewsStore } from '@/store/views.store';

function VentasPorProducto() {
  const { actions } = useViewsStore()

  const salesByProduct = actions.find((view) => view.view.name === 'Ventas por Productos')
  const actionsViews = salesByProduct?.actions?.name || []
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState('');
  const { getBranchesList, branch_list } = useBranchesStore();
  const { user } = useAuthStore();

  const {
    getGraphicForCategoryProductsForDates,
    getSalesProducts,
    sales_products,
    loading_sales_products,
    total_sales_product,
  } = salesReportStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getGraphicForCategoryProductsForDates(
      Number(
        user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment
    );
    getSalesProducts(
      Number(user?.pointOfSale?.branch.transmitterId ?? 0),
      startDate,
      endDate,
      typePayment
    );

  };

  const handleExportData = async (searchParam: string | undefined) => {
    await report_sales_by_products(
      Number(user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment
    ).then(({ data }) => {
      if (data) {
        salesByProductsExports(data.sales, startDate, endDate)
      }
    }).catch(() => {
      toast.error('No se proceso la solicitud')
    })
  }

  return (
    <Layout title="Ventas por Producto">
      <DivGlobal>
        <ResponsiveFilterWrapper onApply={() => {
          handleSearch(undefined);
        }}>
          <Input
            className="w-full"
            classNames={{ label: 'font-semibold' }}
            label="Fecha inicial"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            className="w-full"
            classNames={{ label: 'font-semibold' }}
            label="Fecha final"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            className="w-full"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={typePayment}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona una sucursal"
            value={typePayment}
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const payment = new Set(key);

                setTypePayment(payment.values().next().value as string);
              } else {
                setTypePayment('');
              }
            }}
          >
            {branch_list.map((type) => (
              <SelectItem key={type.name} className="dark:text-white">
                {type.name}
              </SelectItem>
            ))}
          </Select>

        </ResponsiveFilterWrapper>
        {actionsViews.includes('Exportar Excel') && (
          <>
            {sales_products.length > 0 ? <ButtonUi
              className="mt-4 font-semibold w-48 "
              color="success"
              theme={Colors.Success}
              onPress={() => {
                handleExportData(undefined)
              }}
            >
              <p>Exportar Excel</p> <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
            </ButtonUi>
              :
              <ButtonUi
                className="mt-4 opacity-70 font-semibold flex-row gap-10 w-48"
                color="success"
                theme={Colors.Success}
              >
                <p>Exportar Excel</p>
                <PiMicrosoftExcelLogoBold className="text-white" size={24} />
              </ButtonUi>

            }

          </>

        )}

        <div className="w-full h-full overflow-y-auto py-1 border-b dark:border-gray-700">
          <div className="w-full mt-5">
            {loading_sales_products ? (
              <LoadingTable />
            ) : (
              <>
                <div className="w-full p-5 my-10 border shadow dark:border-gray-500">
                  <p className="text-lg font-semibold dark:text-white">
                    Venta total : {formatCurrency(Number(total_sales_product))}
                  </p>
                </div>
                <TableComponent
                  headers={['Producto', 'Total en ventas']}>
                  {sales_products.map((product, index) => (
                    <tr key={index} className="border-b border-slate-200">
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {product.productName}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {formatCurrency(Number(product.totalItemSum))}
                      </td>
                    </tr>
                  ))}
                </TableComponent>
              </>
            )}
          </div>
          <GraphicProductCategory branch="" endDate={endDate} startDate={startDate} />
        </div>
      </DivGlobal>
    </Layout>
  );
}

export default VentasPorProducto;
