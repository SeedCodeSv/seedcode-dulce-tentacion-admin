import { useContext, useEffect, useMemo } from 'react';
import Layout from '../layout/Layout';
import { salesReportStore } from '../store/reports/sales_report.store';
import { useAuthStore } from '../store/auth.store';
import SalesMonthBranches from '../components/home/SalesMonthBranches';
import { useReportExpensesStore } from '../store/reports/expenses_report.store';
import ExpensesMonthBranches from '../components/home/ExpensesMonthBranches';
import { useBranchProductReportStore } from '../store/reports/branch_product.store';
import MostProductSelled from '../components/home/MostProductSelled';
import SalesMonthYear from '../components/home/SalesMonthYear';
import { shortMonth } from '../utils/dates';
import { formatCurrency } from '../utils/dte';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ThemeContext } from '../hooks/useTheme';
// import { Skeleton } from '@nextui-org/react';
import '../components/home/style.css';
import { Skeleton } from '@/components/ui/skeleton';

function Home() {
  const { theme } = useContext(ThemeContext);

  const {
    getSalesByBranchAndMonth,
    sales_branch_month,
    loading_sales_by_branch_and_month,
    getSalesByYearAndMonth,
    sales_month_year,
    sales_by_day,
    getSalesByDay,
    getSalesTableDay,
    sales_table_day,
    loading_sales_by_table_date,
    getSalesCount,
    loading_sales_month_year,
    sales_count,
  } = salesReportStore();

  const {
    getExpensesBranchMonth,
    loading_expenses_branchMonth,
    expenses_branch_month,
    expenses_by_day,
    getExpensesByDay,
  } = useReportExpensesStore();

  const { most_product_selled, loading_most_selled_product, getMostProductMostSelled } =
    useBranchProductReportStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const branchId = user.correlative.branch.transmitterId;
      getSalesByBranchAndMonth(branchId);
      getExpensesBranchMonth(branchId);
      getMostProductMostSelled(branchId);
      getSalesByYearAndMonth(branchId);
      getSalesByDay(branchId);
      getExpensesByDay(branchId);
      getSalesTableDay(branchId);
      getSalesCount();
    }
  }, [user, theme]);

  const total = useMemo(() => {
    return sales_branch_month.map((sale) => Number(sale.total)).reduce((a, b) => a + b, 0);
  }, [sales_branch_month]);

  const totalExpenses = useMemo(() => {
    return expenses_branch_month.map((sale) => Number(sale.total)).reduce((a, b) => a + b, 0);
  }, [sales_branch_month]);

  const mostProductSelled = useMemo(() => {
    if (most_product_selled.length > 0) {
      const sorted = [...most_product_selled].sort(
        (a, b) => Number(b.quantity) - Number(a.quantity)
      );
      return sorted[0].branchProduct.name.length > 35
        ? sorted[0].branchProduct.name.slice(0, 35) + '...'
        : sorted[0].branchProduct.name;
    } else {
      return '';
    }
  }, [most_product_selled]);

  const yearTotal = useMemo(() => {
    return sales_month_year.map((sm) => Number(sm.total)).reduce((a, b) => a + b, 0);
  }, [sales_month_year]);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  return (
    <Layout title="Inicio">
      <div className="w-full h-full p-5 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="grid w-full grid-cols-1 gap-5 pt-10 md:grid-cols-2 xl:grid-cols-4 2xl:gap-10">
          <div>
            {loading_sales_by_branch_and_month ? (
              <>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[150px] w-[280px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <SalesMonthBranches
                  sales={{
                    title: 'Ventas del mes',
                    labels: sales_branch_month.map((sl) => sl.branch),
                    total,
                    series: [
                      {
                        name: 'Total',
                        data: sales_branch_month.map((sl) => sl.total),
                      },
                    ],
                  }}
                />
              </>
            )}
          </div>

          <div>
            {loading_expenses_branchMonth ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[150px] w-[280px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <>
                <ExpensesMonthBranches
                  sales={{
                    title: 'Gastos del mes',
                    labels: expenses_branch_month.map((sl) => sl.branch),
                    total: totalExpenses,
                    series: [
                      {
                        name: 'Total',
                        data: expenses_branch_month.map((sl) => sl.total),
                      },
                    ],
                  }}
                />
              </>
            )}
          </div>

          <div>
            {loading_most_selled_product ? (
              <>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[150px] w-[280px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <MostProductSelled
                  sales={{
                    title: 'Producto mas vendido',
                    labels: most_product_selled.map((sl) => sl.branchProduct.name),
                    total: mostProductSelled,
                    branch: most_product_selled.map((ld) => ld.branch),
                    series: [
                      {
                        name: 'Total',
                        data: most_product_selled.map((sl) => Number(sl.total)),
                      },
                      {
                        name: 'Sucursal',
                        data: most_product_selled.map((sl) => Number(sl.branch)),
                      },
                    ],
                  }}
                />
              </>
            )}
          </div>

          <div>
            {loading_sales_month_year ? (
              <>
      
                <div className="flex flex-col space-y-3 ">
                  <Skeleton className="h-[150px] w-full  rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <SalesMonthYear
                  sales={{
                    title: 'Ventas por año',
                    labels: sales_month_year.map((sl) => shortMonth(sl.month)),
                    total: yearTotal,
                    series: [
                      {
                        name: 'Total',
                        data: sales_month_year.map((sl) => Number(sl.total)),
                      },
                    ],
                  }}
                  // loading={loading_sales_month_year}
                />
              </>
            )}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 pt-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-10 lg:gap-10 sm:gap-10 mb:gap-10">
          <div className="flex flex-col w-full gap-10">
            <div className="flex flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">No. de ventas</p>
              <p className="text-2xl font-semibold dark:text-white animated-count">{sales_count}</p>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">Ventas del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(sales_by_day)}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-32 border rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
              <p className="text-2xl font-semibold dark:text-white">Gastos del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(expenses_by_day)}
              </p>
            </div>
          </div>
          <div className="col-span-3 p-5 mt-10 bg-gray-100 rounded-lg dark:bg-gray-900 xl:mt-0 lg:mt-0 mb:mt-0 sm:mt-0">
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
