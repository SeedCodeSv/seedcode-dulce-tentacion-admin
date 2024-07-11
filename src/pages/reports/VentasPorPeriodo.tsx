import {
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Layout from "../../layout/Layout";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import { useEffect, useState } from "react";
import { formatDate, formatDateShort } from "../../utils/dates";
import { salesReportStore } from "../../store/reports/sales_report.store";
import { formatCurrency } from "../../utils/dte";
import Pagination from "../../components/global/Pagination";
import SalesChartPeriod from "./Period/SalesChartPeriod";
import { global_styles } from "@/styles/global.styles";

function VentasPorPeriodo() {
  const service = new SeedcodeCatalogosMhService();
  const typeSales = service.get017FormaDePago();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState("01");

  const {
    getSalesByPeriod,
    sales_by_period,
    sales_by_period_graph,
    getSalesByPeriodChart,
    loading_sales_period,
  } = salesReportStore();

  useEffect(() => {
    getSalesByPeriod(1, startDate, endDate, typePayment);
    getSalesByPeriodChart(startDate, endDate);
  }, [startDate, endDate, typePayment]);

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
          <div className="grid grid-cols-3"></div>
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
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn style={global_styles().darkStyle}>
                          FECHA
                        </TableColumn>
                        <TableColumn style={global_styles().darkStyle}>
                          TOTAL EN VENTAS
                        </TableColumn>
                        <TableColumn style={global_styles().darkStyle}>
                          NO. DE VENTAS
                        </TableColumn>
                      </TableHeader>
                      <TableBody emptyContent="No hay resultados">
                        {sales_by_period.sales.map((sale, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDateShort(sale.date)}</TableCell>
                            <TableCell>
                              {formatCurrency(Number(sale.totalSales))}
                            </TableCell>
                            <TableCell>{sale.salesCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="w-full mt-4">
                      <Pagination
                        nextPage={sales_by_period.nextPag}
                        previousPage={sales_by_period.prevPag}
                        totalPages={sales_by_period.totalPag}
                        currentPage={sales_by_period.currentPag}
                        onPageChange={(page) =>
                          getSalesByPeriod(page, startDate, endDate)
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
            <div className="w-full p-5 mt-4 overflow-x-hidden bg-white border shadow rounded-2xl">
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
