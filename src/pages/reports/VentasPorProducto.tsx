import Layout from '../../layout/Layout';
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { formatDate } from '../../utils/dates';
import GraphicProductCategory from './Product/GraphicProductCategory';
import { salesReportStore } from '@/store/reports/sales_report.store';
import { global_styles } from '@/styles/global.styles';
import { formatCurrency } from '@/utils/dte';
import { useBranchesStore } from '@/store/branches.store';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { Filter, SearchIcon } from 'lucide-react';
import BottomDrawer from '@/components/global/BottomDrawer';
import { ThemeContext } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import useGlobalStyles from '@/components/global/global.styles';

function VentasPorProducto() {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [openVaul, setOpenVaul] = useState(false);
  const [typePayment, setTypePayment] = useState('');
  const { theme } = useContext(ThemeContext);
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
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment
    );
    getSalesProducts(
      Number(
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      startDate,
      endDate,
      typePayment
    );
  };

  const styles = useGlobalStyles();

  return (
    <Layout title="Ventas por Producto">
      <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto  bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="hidden md:grid w-full grid-cols-1 gap-5 md:grid-cols-4">
            <Input
              label="Fecha inicial"
              labelPlacement="outside"
              classNames={{ label: 'font-semibold' }}
              variant="bordered"
              className="w-full"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Fecha final"
              labelPlacement="outside"
              classNames={{ label: 'font-semibold' }}
              variant="bordered"
              className="w-full"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Select
              variant="bordered"
              label="Sucursal"
              placeholder="Selecciona una sucursal"
              labelPlacement="outside"
              classNames={{ label: 'font-semibold' }}
              className="w-full"
              value={typePayment}
              defaultSelectedKeys={typePayment}
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

            <div className="flex flex-col w-full mt-6">
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="hidden font-semibold md:flex"
                color="primary"
                endContent={<SearchIcon size={15} />}
                onClick={() => {
                  handleSearch(undefined);
                  setOpenVaul(false);
                }}
              >
                Buscar
              </Button>
            </div>
          </div>

          {/* Parte responsiva para movil */}
          <div className="flex items-center gap-5">
            <div className="flex-1 block md:hidden">
              <TooltipGlobal text="Filtros disponibles" color="primary">
                <Button
                  style={global_styles().thirdStyle}
                  isIconOnly
                  type="button"
                  onClick={() => setOpenVaul(true)}
                >
                  <Filter />
                </Button>
              </TooltipGlobal>
              <BottomDrawer
                title="Filtros disponibles"
                open={openVaul}
                onClose={() => setOpenVaul(false)}
              >
                <Input
                  label="Fecha inicial"
                  labelPlacement="outside"
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  className="w-full"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="pt-4">
                  <Input
                    label="Fecha final"
                    labelPlacement="outside"
                    classNames={{ label: 'font-semibold' }}
                    variant="bordered"
                    className="w-full mt-4"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="pt-4">
                  <Select
                    variant="bordered"
                    label="Sucursal"
                    placeholder="Selecciona una sucursal"
                    labelPlacement="outside"
                    classNames={{ label: 'font-semibold' }}
                    className="w-full"
                    value={typePayment}
                    defaultSelectedKeys={typePayment}
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
                </div>

                <Button
                  onClick={() => {
                    handleSearch(undefined);
                    setOpenVaul(false);
                  }}
                  className="w-full mt-5"
                >
                  Aplicar filtros
                </Button>
              </BottomDrawer>
            </div>
          </div>

          <div className="w-full h-full overflow-y-auto py-1 border-b dark:border-gray-700">
            <div className="w-full mt-5">
              {loading_sales_products ? (
                <div className="flex flex-col items-center justify-center w-full h-64">
                  <div className="loader"></div>
                  <p className="mt-3 text-xl font-semibold">Cargando...</p>
                </div>
              ) : (
                <>
                  <div className="w-full p-5 my-10 border shadow dark:border-gray-500">
                    <p className="text-lg font-semibold dark:text-white">
                      Venta total : {formatCurrency(Number(total_sales_product))}
                    </p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                    <table className="w-full">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                          <th
                            style={styles.darkStyle}
                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Producto
                          </th>
                          <th
                            style={styles.darkStyle}
                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Total en ventas
                          </th>
                        </tr>
                      </thead>
                      {sales_products.map((product) => (
                        <tr className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {product.productName}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {formatCurrency(Number(product.totalItemSum))}
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </>
              )}
            </div>
            <GraphicProductCategory startDate={startDate} endDate={endDate} branch="" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VentasPorProducto;
