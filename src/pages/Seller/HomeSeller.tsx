import { DataTable } from "primereact/datatable";
import Layout from "../../layout/Layout";
import { salesReportStore } from "../../store/reports_seller/sales_report_seller.store";
import { Column } from "primereact/column";
import SalesMonthBranches from "../../components/home_seller/SalesMonthBranches";
import ExpensesMonthBranches from "../../components/home_seller/ExpensesMonthBranches";
import MostProductSelled from "../../components/home_seller/MostProductSelled";
import SalesMonthYear from "../../components/home_seller/SalesMonthYear";
import { useContext, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useBranchProductReportStore } from "../../store/reports_seller/branch_product_seller.store";
import { ThemeContext } from "../../hooks/useTheme";
import { shortMonth } from "../../utils/dates";
import { formatCurrency } from "../../utils/dte";

function HomeSeller() {
  const { theme } = useContext(ThemeContext)
  const {
    getProductSelledByBranch,
    getSalesByCategory,
    sales_by_category,
    getSalesByDays,
    getSalesByYear,
    sales_by_year,
    getSalesTableDay,
    sales_table_day,
    total_sales,
    total_expenses,
  } = salesReportStore();

  const { most_product_selled, getMostProductMostSelled } =
    useBranchProductReportStore();

  const { user } = useAuthStore();

  useEffect(() => {
    getSalesByYear(user?.employee.branchId ?? 0);
    getSalesByDays(user?.employee.branchId ?? 0);
    getSalesByCategory(user?.employee.branchId ?? 0);
    getProductSelledByBranch(user?.employee.branchId ?? 0);
    getMostProductMostSelled(user?.employee.branchId ?? 0);
    getSalesTableDay(user?.employee.branchId ?? 0);
  }, []);

  const mostProductSelled = useMemo(() => {
    if (most_product_selled.length > 0) {
      const sorted = [...most_product_selled].sort(
        (a, b) => Number(b.quantity) - Number(a.quantity)
      )
      return sorted[0].branchProduct.name.length > 40
        ? sorted[0].branchProduct.name.slice(0, 40) + '...'
        : sorted[0].branchProduct.name
    } else {
      return ''
    }
  }, [most_product_selled])

  const mostByCaterogy = useMemo(() => {
    if (sales_by_category.length > 0) {
      const sorted = [...sales_by_category].sort((a, b) => Number(b.quantity) - Number(a.quantity))
      return sorted[0].category.length > 40
        ? sorted[0].category.slice(0, 40) + '...'
        : sorted[0].category
    } else {
      return ''
    }
  }, [sales_by_category])

  const yearTotal = useMemo(() => {
    return sales_by_year.map((sm) => Number(sm.total)).reduce((a, b) => a + b, 0)
  }, [sales_by_year])

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary
  }
  return (
    <Layout title="Inicio">
      <div className="w-full h-full overflow-y-auto p-5 bg-white dark:bg-gray-800">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 2xl:gap-10 pt-10">
          <div>
            <SalesMonthBranches
              sales={{
                title: "Categoria mas vendida",
                labels: sales_by_category.map((sl) => sl.category),
                total: Number(mostByCaterogy),
                series: [
                  {
                    name: "Total",
                    data: sales_by_category.map((sl) => Number(sl.total)),
                  },
                ],
              }}
            />
          </div>
          <div>
            <ExpensesMonthBranches />
          </div>
          <div>
            <MostProductSelled
              sales={{
                title: "Producto mas vendido",
                labels: most_product_selled.map((sl) => sl.branchProduct.name),
                total: mostProductSelled,
                series: [
                  {
                    name: "Total",
                    data: most_product_selled.map((sl) => Number(sl.total)),
                  },
                ],
              }}
            />
          </div>
          <div>
            <SalesMonthYear
              sales={{
                title: "Ventas por año",
                labels: sales_by_year.map((sl) => shortMonth(sl.month)),
                total: yearTotal,
                series: [
                  {
                    name: "Total",
                    data: sales_by_year.map((sl) => Number(sl.total)),
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 pt-10">
          <div className="w-full flex flex-col gap-10">
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">
                No. de ventas
              </p>
              <p className="text-lg font-semibold dark:text-white">
                {sales_table_day.length}
              </p>
            </div>
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">
                Total de Ventas{" "}
              </p>
              <p className="text-lg font-semibold dark:text-white">
                ${total_sales ? total_sales.toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="dark:bg-gray-900 dark:border-gray-700 w-full border h-32 rounded-lg shadow flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold dark:text-white">
                Total de Gastos
              </p>
              ${total_expenses ? total_expenses.toFixed(2) : "0.00"}
            </div>
          </div>
          <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
            <p className="pb-4 text-lg font-semibold dark:text-white">
              Ventas del dia
            </p>
            <DataTable
              className="w-full shadow"
              emptyMessage="No se encontraron resultados"
              value={sales_table_day}
              tableStyle={{ minWidth: "50rem" }}
              scrollable
              scrollHeight="30rem"
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="numeroControl"
                header="Numero de control"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="fecEmi"
                header="Fecha"
                body={(rowData) => rowData.fecEmi}
              />

              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="horEmi"
                header="Hora"
                body={(rowData) => rowData.horEmi}
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
                body={(rowData) =>
                  formatCurrency(Number(rowData.montoTotalOperacion))
                }
              />
              {/* <Column
                headerClassName="text-sm font-semibold cursor-pointer"
                headerStyle={style}
                bodyStyle={{ textAlign: 'center' }}
                field="file"
                header="Archivo"
                body={<FileText onClick={() => setPdfViewerOpen(true)} />}
              /> */}
            </DataTable>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomeSeller;
