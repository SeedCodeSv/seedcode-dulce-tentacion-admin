import Layout from "../../layout/Layout";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dates";
import GraphicProductCategory from "./Product/GraphicProductCategory";
import { salesReportStore } from "@/store/reports/sales_report.store";
import { DataTable } from "primereact/datatable";
import { global_styles } from "@/styles/global.styles";
import { Column } from "primereact/column";
import { formatCurrency } from "@/utils/dte";
import { useBranchesStore } from "@/store/branches.store";

function VentasPorProducto() {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState("");
  const { getBranchesList, branch_list } = useBranchesStore();

  const {
    getGraphicForCategoryProductsForDates,
    getSalesProducts,
    sales_products,
    loading_sales_products,
    total_sales_product
  } = salesReportStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    getGraphicForCategoryProductsForDates(startDate, endDate, typePayment);
    getSalesProducts(startDate, endDate, typePayment);
  }, [startDate, endDate, typePayment]);

  return (
    <Layout title="Ventas por Producto">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
            <Input
              label="Fecha inicial"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              variant="bordered"
              className="w-full"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Fecha final"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
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
              classNames={{ label: "font-semibold" }}
              className="w-full"
              value={typePayment}
              defaultSelectedKeys={typePayment}
              onSelectionChange={(key) => {
                if (key) {
                  const payment = new Set(key);
                  setTypePayment(payment.values().next().value);
                } else {
                  setTypePayment("");
                }
              }}
            >
              {branch_list.map((type) => (
                <SelectItem
                  key={type.name}
                  value={type.name}
                  className="dark:text-white"
                >
                  {type.name}
                </SelectItem>
              ))}
            </Select>
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
                <p className="text-lg font-semibold dark:text-white">Venta total : {formatCurrency(Number(total_sales_product))}</p>
                </div>
                  <DataTable
                    value={sales_products}
                    className="shadow dark:text-white dark:bg-gray-950"
                    emptyMessage="No se encontraron resultados"
                    scrollHeight="flex"
                    scrollable
                    style={{ maxHeight: "500px" }}
                  >
                    <Column
                      headerClassName="text-sm font-semibold"
                      bodyClassName={"dark:text-white dark:bg-gray-950"}
                      headerStyle={{
                        ...global_styles().darkStyle,
                        borderTopLeftRadius: "10px",
                      }}
                      body={(field) => field.productName}
                      header="Fecha"
                    />
                    <Column
                      headerClassName="text-sm font-semibold"
                      bodyClassName={"dark:text-white dark:bg-gray-950"}
                      headerStyle={{ ...global_styles().darkStyle }}
                      body={(field) =>
                        formatCurrency(Number(field.totalItemSum))
                      }
                      header="Total en ventas"
                    />
                  </DataTable>
                </>
              )}
            </div>
            <GraphicProductCategory
              startDate={startDate}
              endDate={endDate}
              branch=""
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VentasPorProducto;
