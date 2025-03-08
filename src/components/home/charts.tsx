import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';
import { memo, useMemo } from 'react';
import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import { salesReportStore } from '../../store/reports/sales_report.store.ts';
import { formatCurrency } from '@/utils/dte.ts';
import { Spinner } from '@heroui/react';
import { useBranchProductReportStore } from '@/store/reports/branch_product.store.ts';

function Charts() {
  const {
    sales_branch_month,
    loading_sales_by_branch_and_month,
    sales_month_year,
    sales_table_day,
    loading_sales_by_table_date,
    loading_sales_month_year,
  } = salesReportStore();

  const { most_product_selled, loading_most_selled_product } = useBranchProductReportStore();

  const total = useMemo(() => {
    return sales_branch_month
      .map((sale) => Number(sale.currentMonthSales))
      .reduce((a, b) => a + b, 0);
  }, [sales_branch_month]);

  const monthlyData = useMemo(() => {
    return sales_branch_month.map((item) => ({
      name: item.branch,
      value: Number(item.currentMonthSales),
    }));
  }, [sales_branch_month]);

  const dailyData = useMemo(() => {
    return sales_table_day.map((item) => ({
      name: item.branch,
      value: Number(item.totalSales),
    }));
  }, [sales_table_day]);

  const productData = useMemo(() => {
    return most_product_selled.map((item) => ({
      name: item.branchProduct.name,
      value: Number(item.quantity),
    }));
  }, [most_product_selled]);

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

  const mostProductSealedQuantity = useMemo(() => {
    if (most_product_selled.length > 0) {
      const sorted = [...most_product_selled].sort(
        (a, b) => Number(b.quantity) - Number(a.quantity)
      );
      return sorted[0].quantity;
    } else {
      return 0;
    }
  }, [most_product_selled]);

  const yearlyData = useMemo(() => {
    return sales_month_year.map((item) => ({
      name: item.month,
      value: Number(item.total),
    }));
  }, [sales_month_year]);

  const yearTotal = useMemo(() => {
    return sales_month_year.map((sm) => Number(sm.total)).reduce((a, b) => a + b, 0);
  }, [sales_month_year]);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium opacity-90">Ventas del Mes</h3>
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
          </div>
          <p className="text-xl sm:text-3xl font-bold">
            {loading_sales_by_branch_and_month ? <Spinner /> : formatCurrency(total)}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="value" stroke="#fff" fill="#fff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium opacity-90">Ventas del dia</h3>
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
          </div>
          <p className="text-xl sm:text-3xl font-bold">
            {loading_sales_by_table_date ? <Spinner /> : formatCurrency(total)}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="value" stroke="#fff" fill="#fff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium opacity-90">Producto Más Vendido</h3>
            <Package className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
          </div>
          <p className="text-lg sm:text-sm font-bold truncate ">
            {loading_most_selled_product ? <Spinner /> : mostProductSelled}
          </p>
          <p className="text-sm opacity-75 mt-1">{mostProductSealedQuantity} unidades</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="value" stroke="#fff" fill="#fff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium opacity-90">Ventas por Año</h3>
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {loading_sales_month_year ? <Spinner /> : formatCurrency(yearTotal)}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yearlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="value" stroke="#fff" fill="#fff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default memo(Charts);
