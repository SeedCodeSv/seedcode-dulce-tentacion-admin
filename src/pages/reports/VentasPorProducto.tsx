import Layout from '../../layout/Layout';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { formatDate } from '../../utils/dates';
import GraphicProductCategory from './Product/GraphicProductCategory';
import { salesReportStore } from '@/store/reports/sales_report.store';
import { DataTable } from 'primereact/datatable';
import { global_styles } from '@/styles/global.styles';
import { Column } from 'primereact/column';
import { formatCurrency } from '@/utils/dte';
import { useBranchesStore } from '@/store/branches.store';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { Filter, SearchIcon } from 'lucide-react';
import BottomDrawer from '@/components/global/BottomDrawer';
import { ThemeContext } from '@/hooks/useTheme';

function VentasPorProducto() {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [openVaul, setOpenVaul] = useState(false);
  const [typePayment, setTypePayment] = useState('');
  const { theme } = useContext(ThemeContext);
  const { getBranchesList, branch_list } = useBranchesStore();

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

  // useEffect(() => {
  //   getGraphicForCategoryProductsForDates(startDate, endDate, typePayment);
  //   getSalesProducts(startDate, endDate, typePayment);
  // }, [startDate, endDate, typePayment]);

  useEffect(() => {
    // getGraphicForCategoryProductsForDates(startDate, endDate, typePayment);
    // getSalesProducts(startDate, endDate, typePayment);
  }, [startDate, endDate, typePayment]);

  const handleSearch = (searchParam: string | undefined) => {
    getGraphicForCategoryProductsForDates(
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment
    );
    getSalesProducts(startDate, endDate, typePayment);
  };
  return (
    <Layout title="Ventas por Producto">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
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
                  setTypePayment(payment.values().next().value);
                } else {
                  setTypePayment('');
                }
              }}
            >
              {branch_list.map((type) => (
                <SelectItem key={type.name} value={type.name} className="dark:text-white">
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
                        setTypePayment(payment.values().next().value);
                      } else {
                        setTypePayment('');
                      }
                    }}
                  >
                    {branch_list.map((type) => (
                      <SelectItem key={type.name} value={type.name} className="dark:text-white">
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

          <div className="w-full py-1 border-b dark:border-gray-700">
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
                  <DataTable
                    value={sales_products}
                    className="shadow dark:text-white dark:bg-gray-950"
                    emptyMessage="No se encontraron resultados"
                    scrollHeight="flex"
                    scrollable
                    style={{ maxHeight: '500px' }}
                  >
                    <Column
                      headerClassName="text-sm font-semibold"
                      bodyClassName={'dark:text-white dark:bg-gray-950'}
                      headerStyle={{
                        ...global_styles().darkStyle,
                        borderTopLeftRadius: '10px',
                      }}
                      body={(field) => field.productName}
                      header="Fecha"
                    />
                    <Column
                      headerClassName="text-sm font-semibold"
                      bodyClassName={'dark:text-white dark:bg-gray-950'}
                      headerStyle={{ ...global_styles().darkStyle }}
                      body={(field) => formatCurrency(Number(field.totalItemSum))}
                      header="Total en ventas"
                    />
                  </DataTable>
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
