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
import { formatDate } from "../../utils/dates";
import { salesReportStore } from "../../store/reports/sales_report.store";
import { formatCurrency } from "../../utils/dte";
import Pagination from "../../components/global/Pagination";
import SalesChartPeriod from "./Period/SalesChartPeriod";

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
  } = salesReportStore();

  useEffect(() => {
    getSalesByPeriod(1, startDate, endDate);
    getSalesByPeriodChart(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <Layout title="Ventas por Periodo">
      <div className="w-full h-full p-5 overflow-x-hidden overflow-y-hidden bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-x-hidden overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="grid w-full grid-cols-3 gap-5">
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
            {sales_by_period ? (
              <div className="w-full">
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>TOTAL EN VENTAS</TableColumn>
                    <TableColumn>NO. DE VENTAS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {sales_by_period.sales.map((sale, index) => (
                      <TableRow key={index}>
                        <TableCell>{sale.date}</TableCell>
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
              <>
                <p>No hay resultados</p>
              </>
            )}
            <div className="w-full p-5 mt-4 overflow-x-hidden bg-white border shadow rounded-2xl">
              <div className="w-full">
                {sales_by_period_graph?.data && (
                  <SalesChartPeriod
                    labels={sales_by_period_graph.data.map(
                      (sale) => sale.branch
                    )}
                    series={[
                      {
                        name: "Ventas",
                        data: sales_by_period_graph.data.map((sale) =>
                          Number(sale.total.toFixed(2))
                        ),
                      },
                    ]}
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
