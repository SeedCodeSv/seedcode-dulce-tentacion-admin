import { useCallback, useContext, useEffect } from 'react';
import Layout from '../layout/Layout';
import { salesReportStore } from '../store/reports/sales_report.store';
import { useAuthStore } from '../store/auth.store';
import { useReportExpensesStore } from '../store/reports/expenses_report.store';
import { useBranchProductReportStore } from '../store/reports/branch_product.store';
import { formatCurrency } from '../utils/dte';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ThemeContext } from '../hooks/useTheme';
import '../components/home/style.css';
import { get_theme_by_transmitter } from '@/services/configuration.service';
import Charts from '@/components/home/charts';

function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const {
    getSalesByBranchAndMonth,
    getSalesByYearAndMonth,
    sales_by_day,
    getSalesByDay,
    getSalesTableDay,
    sales_table_day,
    loading_sales_by_table_date,
    getSalesCount,
    sales_count,
  } = salesReportStore();

  const { getExpensesBranchMonth, expenses_by_day, getExpensesByDay } = useReportExpensesStore();

  const { getMostProductMostSelled } = useBranchProductReportStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const branchId =
        user.correlative?.branch?.transmitterId ?? user.pointOfSale?.branch?.transmitterId ?? 0;

      getSalesByBranchAndMonth(branchId);
      getExpensesBranchMonth(branchId);
      getMostProductMostSelled(branchId);
      getSalesByYearAndMonth(branchId);
      getSalesByDay(branchId);
      getExpensesByDay(branchId);
      getSalesTableDay(branchId);
      getSalesCount();
    }
  }, [user]);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const fetchThemeData = useCallback(async () => {
    try {
      const { data } = await get_theme_by_transmitter();
      if (data.ok) {
        const theme = {
          name: data.personalization.name,
          context: data.personalization.context === 'light' ? 'light' : 'dark',
          colors: data.personalization.colors,
        };
        toggleTheme({
          ...theme,
          context: theme.context === 'light' ? 'light' : 'dark',
        });
      } else {
        throw new Error('No tienes tema seleccionado');
      }
    } catch (error) {
      throw new Error('No tienes tema seleccionado');
    }
  }, [toggleTheme]);

  useEffect(() => {
    fetchThemeData();
  }, []);

  return (
    <Layout title="Inicio">
      <div className="w-full h-full p-5 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="grid w-full grid-cols-1 gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Charts />
        </div>
        <div className="grid w-full grid-cols-1 pt-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-10 lg:gap-10 sm:gap-10 mb:gap-10">
          <div className="flex flex-col w-full gap-10">
            <div className="flex flex-col items-center  justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">No. de ventas</p>
              <p className="text-2xl font-semibold dark:text-white animated-count">{sales_count}</p>
            </div>
            <div className="flex flex-col items-center  justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">Ventas del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(sales_by_day)}
              </p>
            </div>
            <div className="flex  flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">Gastos del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(expenses_by_day)}
              </p>
            </div>
          </div>
          <div className="col-span-3 dark:border-white border p-5 mt-10 bg-gray-100 rounded-lg dark:bg-gray-900 xl:mt-0 lg:mt-0 mb:mt-0 sm:mt-0">
            <p className="pb-4 text-lg font-semibold dark:text-white">Ventas del dia</p>

            {loading_sales_by_table_date ? (
              <>
                <div className="flex flex-col items-center justify-center w-full h-64">
                  <div className="loader"></div>
                  <p className="mt-3 text-xl font-semibold">Cargando...</p>
                </div>
              </>
            ) : (
              <>
                <DataTable
                  className="w-full shadow"
                  emptyMessage="No se encontraron resultados"
                  value={sales_table_day}
                  tableStyle={{ minWidth: '50rem' }}
                  scrollable
                  scrollHeight="30rem"
                >
                  <Column
                    headerClassName="text-sm font-semibold"
                    headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                    field="branch"
                    header="Sucursal"
                    bodyClassName={'dark:text-white'}
                  />
                  <Column
                    headerClassName="text-sm font-semibold"
                    headerStyle={style}
                    field="totalSales"
                    bodyClassName={'dark:text-white'}
                    header="Total"
                    body={(rowData) => formatCurrency(Number(rowData.totalSales))}
                  />
                </DataTable>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
