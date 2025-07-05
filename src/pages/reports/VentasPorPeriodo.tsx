import { Autocomplete, AutocompleteItem, Input, Select, SelectItem } from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';

import { formatDate } from '../../utils/dates';
import { salesReportStore } from '../../store/reports/sales_report.store';
import Pagination from '../../components/global/Pagination';

import SalesChartPeriod from './Period/SalesChartPeriod';

import { formatCurrency } from '@/utils/dte';
import { limit_options } from '@/utils/constants';
import { useBranchesStore } from '@/store/branches.store';
import { Branches } from '@/types/branches.types';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { usePointOfSales } from '@/store/point-of-sales.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import { exportSalesExcel } from '@/components/export-reports/SalesByPeriods';
import { reporst_details_sales } from '@/services/reports/reports-by-periods.services';
import { useViewsStore } from '@/store/views.store';

function VentasPorPeriodo() {
  const { actions } = useViewsStore();
  const reportSale = actions.find((view) => view.view.name === 'Ventas por Periodo');

  // const reportSales = actions.find((view) => view.name === "Ventas por Periodo")
  const actionsView = reportSale?.actions?.name || [];

  const [filter, setFilter] = useState({
    typeVoucher: '',
    correlativeType: '',
  });
  const service = new SeedcodeCatalogosMhService();
  const typeSales = service.get017FormaDePago();
  const { getBranchesList, branch_list } = useBranchesStore();
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState('');
  const [pointOfSale, setPointOfSale] = useState('');

  const [limit, setLimit] = useState(Number(limit_options[0]));

  const [selectedBranch, setSelectedBranch] = useState<Branches>();

  const { point_of_sales, getPointOfSales } = usePointOfSales();

  const handleData = async (searchParam: string | undefined) => {
    await reporst_details_sales(
      1,
      99999,
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment,
      searchParam ?? selectedBranch?.name ?? '',
      '',
      searchParam ?? filter.typeVoucher,
      pointOfSale ?? ''
    )
      .then(({ data }) => {
        if (data) {
          exportSalesExcel(data.sales, startDate, endDate);
        }
      })
      .catch(() => {
        toast.error('No se proceso la solicitud');
      });
  };

  useEffect(() => {
    if (selectedBranch) {
      getPointOfSales(Number(selectedBranch?.id));
    }
  }, [selectedBranch]);

  const {
    getSalesByPeriod,
    sales_by_period,
    sales_by_period_graph,
    getSalesByPeriodChart,
    loading_sales_period,
  } = salesReportStore();

  useEffect(() => {
    // getSalesByPeriod(1, limit, startDate, endDate, typePayment, selectedBranch?.name, code);
    getSalesByPeriodChart(startDate, endDate);
    getBranchesList();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getSalesByPeriod(
      1,
      limit,
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? typePayment,
      searchParam ?? selectedBranch?.name,
      '',
      searchParam ?? filter.typeVoucher,
      pointOfSale ?? ''
    );
    getSalesByPeriodChart(startDate, endDate);
    getBranchesList();
  };

  return (
    <DivGlobal>
      <ResponsiveFilterWrapper
        showSearchButton={false}
        onApply={() => {
          handleSearch(undefined);
        }}
      >
        <div className="lg:grid w-full flex flex-col grid-cols-1 gap-2 lg:gap-4 lg:grid-cols-4 items-end">
          <Input
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Fecha inicial"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Fecha final"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={typePayment}
            label="Tipo de pago"
            labelPlacement="outside"
            placeholder="Selecciona el tipo de pago"
            value={typePayment}
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const payment = new Set(key);

                setTypePayment(payment.values().next().value as string);
              }
            }}
          >
            {typeSales.map((type) => (
              <SelectItem key={type.codigo} className="dark:text-white">
                {type.valores}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const branch_id = new Set(key).values().next().value;

                const filterBranch = branch_list.find((branch) => branch.id === Number(branch_id));

                setSelectedBranch(filterBranch);
              }
            }}
          >
            {branch_list.map((branch) => (
              <SelectItem key={branch.id} className="dark:text-white">
                {branch.name}
              </SelectItem>
            ))}
          </Select>

          <Autocomplete
            className="dark:text-white font-semibold text-sm"
            classNames={{
              base: 'text-gray-500 text-sm',
            }}
            label="Tipo de Voucher"
            labelPlacement="outside"
            placeholder="Selecciona el Tipo de Factura"
            variant="bordered"
            onSelectionChange={(e) => {
              const selectCorrelativeType = correlativesTypes.find(
                (dep) => dep.value === new Set([e]).values().next().value
              );

              setFilter({ ...filter, typeVoucher: selectCorrelativeType?.value || '' });
            }}
          >
            {correlativesTypes
              .filter((dep) => ['F', 'CCF', 'T'].includes(dep.value)) // Filtra solo "F", "CCF", "T"
              .map((dep) => (
                <AutocompleteItem key={dep.value} className="dark:text-white">
                  {dep.value + ' - ' + dep.label}
                </AutocompleteItem>
              ))}
          </Autocomplete>
          <Select
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={limit_options[0]}
            label="Punto de venta"
            labelPlacement="outside"
            placeholder="Selecciona un punto de venta"
            value={limit_options[0]}
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const point_of_sale = new Set(key).values().next().value;

                setPointOfSale(point_of_sale as string);
              }
            }}
          >
            {point_of_sales
              .filter((point) => point.typeVoucher === 'FE')
              .map((point) => (
                <SelectItem
                  key={point.code}
                  className="dark:text-white"
                  textValue={point.typeVoucher + ' - ' + point.code}
                >
                  {point.typeVoucher + ' - ' + point.code}
                </SelectItem>
              ))}
          </Select>
          <Select
            className="w-full dark:text-white"
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={limit_options[0]}
            label="Límite"
            labelPlacement="outside"
            value={limit_options[0]}
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const limit = new Set(key).values().next().value;

                setLimit(limit as number);
              }
            }}
          >
            {limit_options.map((limit) => (
              <SelectItem key={limit} className="dark:text-white" textValue={limit}>
                {limit}
              </SelectItem>
            ))}
          </Select>
          <ButtonUi
            className="hidden font-semibold lg:flex"
            color="primary"
            endContent={<SearchIcon size={15} />}
            theme={Colors.Info}
            onPress={() => {
              handleSearch(undefined);
            }}
          >
            Buscar
          </ButtonUi>
          {actionsView?.includes('Exportar Excel') && (
            <>
              {(sales_by_period?.totalSales ?? 0) > 0 ? (
                <ButtonUi
                  className="mt-4 font-semibold flex-row gap-10"
                  color="success"
                  theme={Colors.Success}
                  onPress={() => {
                    handleData(undefined);
                  }}
                >
                  <p>Exportar Excel</p> <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
                </ButtonUi>
              ) : (
                <ButtonUi
                  className="mt-4 opacity-70 font-semibold flex-row gap-10"
                  color="success"
                  theme={Colors.Success}
                >
                  <p>Exportar Excel</p>
                  <PiMicrosoftExcelLogoBold className="text-white" size={24} />
                </ButtonUi>
              )}
            </>
          )}
        </div>
      </ResponsiveFilterWrapper>
      <div className="flex flex-col w-full gap-10 pt-10 md:flex-row">
        <div className="flex flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-950 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-700 md:text-2xl dark:text-white animated-count">
            No. de ventas
          </p>

          {loading_sales_period ? (
            <div className="flex flex-col items-center justify-center w-full mt-2">
              <div className="loader2" />
              {/* <p className="mt-3 text-xl font-semibold">Cargando...</p> */}
            </div>
          ) : (
            <p className="text-lg font-semibold text-gray-700 md:text-2xl dark:text-white animated-count">
              {sales_by_period?.countSales || 0}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-950 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-700 md:text-2xl dark:text-white animated-count">
            Total en ventas
          </p>
          <div className="text-lg font-semibold text-gray-700 md:text-2xl dark:text-white animated-count">
            {loading_sales_period ? (
              <div className="flex flex-col items-center justify-center w-full mt-2">
                <div className="loader2" />
                {/* <p className="mt-3 text-xl font-semibold">Cargando...</p> */}
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-700 md:text-2xl dark:text-white animated-count">
                {formatCurrency(sales_by_period?.totalSales || 0)}
              </p>
            )}
          </div>
        </div>
      </div>

      <TableComponent headers={['No.Fecha', 'Total en Ventas', 'No. de ventas']}>
        {sales_by_period?.sales.map((sale, index) => (
          <tr key={index} className="border-b border-slate-200">
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.date}</td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
              {formatCurrency(+sale.totalSales)}
            </td>
            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.salesCount}</td>
          </tr>
        ))}
      </TableComponent>

      {sales_by_period && (
        <>
          <div className="w-full mt-4">
            <Pagination
              currentPage={sales_by_period.currentPag}
              nextPage={sales_by_period.nextPag}
              previousPage={sales_by_period.prevPag}
              totalPages={sales_by_period.totalPag}
              onPageChange={(page) => getSalesByPeriod(page, limit, startDate, endDate)}
            />
          </div>

          <div className="w-full p-5 mt-4 overflow-x-hidden bg-white border shadow dark:text-white dark:bg-gray-950 rounded-2xl">
            <div className="w-full">
              {sales_by_period_graph?.data && (
                <SalesChartPeriod
                  endDate={endDate}
                  labels={sales_by_period_graph.data
                    .sort((a, b) => Number(b.total) - Number(a.total))
                    .map((sale) => sale.branch)}
                  startDate={startDate}
                />
              )}
            </div>
          </div>
        </>
      )}
    </DivGlobal>
  );
}

export default VentasPorPeriodo;
