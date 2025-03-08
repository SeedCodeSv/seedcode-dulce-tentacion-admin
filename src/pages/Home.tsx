import { useCallback, useContext, useEffect } from 'react';
import Layout from '../layout/Layout';
import { salesReportStore } from '../store/reports/sales_report.store';
import { useAuthStore } from '../store/auth.store';
import { useBranchProductReportStore } from '../store/reports/branch_product.store';
import { formatCurrency } from '../utils/dte';
import { ThemeContext } from '../hooks/useTheme';
import '../components/home/style.css';
import { get_theme_by_transmitter } from '@/services/configuration.service';
import Charts from '@/components/home/charts';

function Home() {
  const { toggleTheme } = useContext(ThemeContext);

  const {
    getSalesByBranchAndMonth,
    getSalesByYearAndMonth,
    getSalesByDay,
    getSalesTableDay,
    sales_table_day,
    loading_sales_by_table_date,
  } = salesReportStore();

  const { getMostProductMostSelled } = useBranchProductReportStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const branchId =
        user.correlative?.branch?.transmitterId ?? user.pointOfSale?.branch?.transmitterId ?? 0;

      getSalesByBranchAndMonth(branchId);
      getMostProductMostSelled(branchId);
      getSalesByYearAndMonth(branchId);
      getSalesByDay(branchId);
      getSalesTableDay(branchId);
    }
  }, [user]);

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
      <div className="w-full h-full flex flex-col p-5 bg-white dark:bg-gray-800">
        <div className="grid w-full gap-5 mt-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Charts />
        </div>
        <p className="my-3 text-lg font-semibold dark:text-white">Ventas del dia</p>
        <div className="w-full mt-5 max-h-[400px] md:max-h-full overflow-y-auto">
          <div className="col-span-3 dark:border-gray-600 border p-5 rounded-lg dark:bg-gray-900 xl:mt-0 lg:mt-0 mb:mt-0 sm:mt-0">
            {loading_sales_by_table_date ? (
              <>
                <div className="flex flex-col items-center justify-center w-full h-64">
                  <div className="loader"></div>
                  <p className="mt-3 text-xl font-semibold">Cargando...</p>
                </div>
              </>
            ) : (
              <div>
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        No.
                      </th>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Nombre
                      </th>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Total
                      </th>
                    </tr>
                  </thead>
                  {sales_table_day.map((sl, index) => (
                    <tr className="border-b border-slate-200 dark:border-slate-500" key={index}>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {index + 1}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {sl.branch}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {formatCurrency(+sl.totalSales)}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
