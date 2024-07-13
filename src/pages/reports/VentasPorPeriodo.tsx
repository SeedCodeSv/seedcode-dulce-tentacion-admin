import { Input, Select, SelectItem } from "@nextui-org/react";
import Layout from "../../layout/Layout";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dates";
import { salesReportStore } from "../../store/reports/sales_report.store";
import Pagination from "../../components/global/Pagination";
import SalesChartPeriod from "./Period/SalesChartPeriod";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatCurrency } from "@/utils/dte";
import { global_styles } from "@/styles/global.styles";
import { limit_options } from "@/utils/constants";
import { useBranchesStore } from "@/store/branches.store";
import { useCorrelativesStore } from "@/store/correlatives.store";
import { Branches } from "@/types/branches.types";

function VentasPorPeriodo() {
  const service = new SeedcodeCatalogosMhService();
  const typeSales = service.get017FormaDePago();
  const { getBranchesList, branch_list } = useBranchesStore();
  const {
    get_correlativesByBranch,
    list_correlatives,
  } = useCorrelativesStore();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState("01");
  const [limit, setLimit] = useState(Number(limit_options[0]));
  const [code , setCode] = useState('')

  const [selectedBranch, setSelectedBranch] = useState<Branches>();

  useEffect(() => {
    if (selectedBranch) {
      get_correlativesByBranch(Number(selectedBranch?.id));
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
    getSalesByPeriod(1, limit, startDate, endDate, typePayment, selectedBranch?.name,code);
    getSalesByPeriodChart(startDate, endDate);
    getBranchesList();
  }, [startDate, endDate, typePayment, limit, selectedBranch, code]);

  return (
    <Layout title="Ventas por Periodo">
      <div className="w-full h-full p-5 overflow-x-hidden overflow-y-hidden bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-x-hidden overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
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
              label="Tipo de pago"
              placeholder="Selecciona el tipo de pago"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              className="w-full"
              value={typePayment}
              defaultSelectedKeys={typePayment}
              onSelectionChange={(key) => {
                if (key) {
                  const payment = new Set(key);
                  setTypePayment(payment.values().next().value);
                }
              }}
            >
              {typeSales.map((type) => (
                <SelectItem
                  key={type.codigo}
                  value={type.codigo}
                  className="dark:text-white"
                >
                  {type.valores}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-5 mt-2 md:grid-cols-3">
            <div>
              <Select
                classNames={{ label: "font-semibold" }}
                label="Sucursal"
                labelPlacement="outside"
                onSelectionChange={(key) => {
                  if (key) {
                    const branch_id = new Set(key).values().next().value;

                    const filterBranch = branch_list.find(
                      (branch) => branch.id === Number(branch_id)
                    );
                    setSelectedBranch(filterBranch);
                  }
                }}
                variant="bordered"
                placeholder="Selecciona la sucursal"
              >
                {branch_list.map((branch) => (
                  <SelectItem
                    key={branch.id}
                    value={branch.id}
                    className="dark:text-white"
                  >
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Select
                classNames={{ label: "font-semibold" }}
                label="Punto de venta"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona la sucursal"
                onSelectionChange={(key) => {
                  if (key) {
                    const corr = new Set(key).values().next().value;
                    setCode(corr)
                  }
                }}
              >
                {list_correlatives.map((corr) => (
                  <SelectItem
                    key={corr.code}
                    value={corr.code}
                    className="dark:text-white"
                  >
                    {corr.code}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex justify-end">
              <Select
                label="Limite"
                variant="bordered"
                labelPlacement="outside"
                classNames={{ label: "font-semibold" }}
                className="w-full"
                value={limit_options[0]}
                defaultSelectedKeys={limit_options[0]}
                onSelectionChange={(key) => {
                  if (key) {
                    const limit = new Set(key).values().next().value;
                    setLimit(limit);
                  }
                }}
              >
                {limit_options.map((limit) => (
                  <SelectItem
                    key={limit}
                    value={limit}
                    className="dark:text-white"
                    textValue={limit}
                  >
                    {limit}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-full mt-5">
            {loading_sales_period ? (
              <div className="flex flex-col items-center justify-center w-full h-64">
                <div className="loader"></div>
                <p className="mt-3 text-xl font-semibold">Cargando...</p>
              </div>
            ) : (
              <>
                {sales_by_period ? (
                  <div className="w-full">
                    <DataTable
                      value={sales_by_period.sales}
                      className="shadow dark:text-white"
                      emptyMessage="No se encontraron resultados"
                    >
                      <Column
                        headerClassName="text-sm font-semibold"
                        bodyClassName={"dark:text-white"}
                        headerStyle={{
                          ...global_styles().darkStyle,
                          borderTopLeftRadius: "10px",
                        }}
                        body={(field) => field.date}
                        header="Fecha"
                      />
                      <Column
                        headerClassName="text-sm font-semibold"
                        bodyClassName={"dark:text-white"}
                        headerStyle={{ ...global_styles().darkStyle }}
                        body={(field) =>
                          formatCurrency(Number(field.totalSales))
                        }
                        header="Total en ventas"
                      />
                      <Column
                        headerClassName="text-sm font-semibold"
                        bodyClassName={"dark:text-white"}
                        headerStyle={{
                          ...global_styles().darkStyle,
                          borderTopRightRadius: "10px",
                        }}
                        body={(field) => field.salesCount}
                        header="No. de ventas"
                      />
                    </DataTable>
                    <div className="w-full mt-4">
                      <Pagination
                        nextPage={sales_by_period.nextPag}
                        previousPage={sales_by_period.prevPag}
                        totalPages={sales_by_period.totalPag}
                        currentPage={sales_by_period.currentPag}
                        onPageChange={(page) =>
                          getSalesByPeriod(page, limit, startDate, endDate)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-64 text-center">
                    <p>No hay resultados</p>
                  </div>
                )}
              </>
            )}
            <div className="w-full p-5 mt-4 overflow-x-hidden bg-white border shadow dark:text-white dark:bg-gray-900 rounded-2xl">
              <div className="w-full">
                {sales_by_period_graph?.data && (
                  <SalesChartPeriod
                    startDate={startDate}
                    endDate={endDate}
                    labels={sales_by_period_graph.data
                      .sort((a, b) => Number(b.total) - Number(a.total))
                      .map((sale) => sale.branch)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VentasPorPeriodo;
