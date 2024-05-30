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
function Home() {
  const { theme } = useContext(ThemeContext);

  const {
    getSalesByBranchAndMonth,
    sales_branch_month,
    getSalesByYearAndMonth,
    sales_month_year,
    sales_by_day,
    getSalesByDay,
    getSalesTableDay,
    sales_table_day,
  } = salesReportStore();

  const { getExpensesBranchMonth, expenses_branch_month, expenses_by_day, getExpensesByDay } =
    useReportExpensesStore();

  const { most_product_selled, getMostProductMostSelled } = useBranchProductReportStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const branchId = user.employee.branch.transmitterId;
      getSalesByBranchAndMonth(branchId);
      getExpensesBranchMonth(branchId);
      getMostProductMostSelled(branchId);
      getSalesByYearAndMonth(branchId);
      getSalesByDay(branchId);
      getExpensesByDay(branchId);
      getSalesTableDay(branchId);
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
      return sorted[0].branchProduct.name.length > 40
        ? sorted[0].branchProduct.name.slice(0, 40) + '...'
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
    <Layout title="Home">
      <div className="w-full h-full overflow-y-auto p-5 bg-white dark:bg-gray-800">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 2xl:gap-10 pt-10">
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
            <MostProductSelled
              sales={{
                title: 'Producto mas vendido',
                labels: most_product_selled.map((sl) => sl.branchProduct.name),
                total: mostProductSelled,
                series: [
                  {
                    name: 'Total',
                    data: most_product_selled.map((sl) => Number(sl.total)),
                  },
                ],
              }}
            />
          </div>

          <div>
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
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:gap-10 lg:gap-10 sm:gap-10 mb:gap-10 pt-10">
          <div className="w-full flex flex-col gap-10">
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">No. de ventas</p>
              <p className="text-lg font-semibold dark:text-white">{sales_table_day.length}</p>
            </div>
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">Ventas del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(sales_by_day)}
              </p>
            </div>
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">Gastos del dia</p>
              <p className="text-lg font-semibold dark:text-white">
                {formatCurrency(expenses_by_day)}
              </p>
            </div>
          </div>
          <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg mt-10 xl:mt-0 lg:mt-0 mb:mt-0 sm:mt-0">
            <p className="pb-4 text-lg font-semibold dark:text-white">Ventas del dia</p>
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
                field="numeroControl"
                header="Numero de control"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="box.branch.name"
                header="Sucursal"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="totalDescu"
                header="Descuento"
                body={(rowData) => formatCurrency(Number(rowData.totalDescu))}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="montoTotalOperacion"
                header="Total"
                body={(rowData) => formatCurrency(Number(rowData.montoTotalOperacion))}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
