import { useContext, useEffect, useState, useCallback } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ThemeContext } from "../../hooks/useTheme";
import { fechaActualString, formatDateShort } from "../../utils/dates";
import { useBranchesStore } from "../../store/branches.store";
import { useReportsByBranch } from "../../store/reports/report_store";
import { useAuthStore } from "../../store/auth.store";
import { salesReportStore } from "../../store/reports/sales_report.store";
import { formatCurrency } from "../../utils/dte";
import { global_styles } from "../../styles/global.styles";

function ReportSalesByBranch() {
  const { theme } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);
  const { branch_list, getBranchesList } = useBranchesStore();
  const { sales, OnGetReportByBranchSales } = useReportsByBranch();
  const { data, getSalesByTransmitter } = salesReportStore();
  const [branchId, setBranchId] = useState(0);
  const { user } = useAuthStore();

  const fetchInitialData = useCallback(() => {
    getBranchesList();
    OnGetReportByBranchSales(branchId, startDate, endDate);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = () => {
    OnGetReportByBranchSales(branchId, startDate, endDate);
    getSalesByTransmitter(
      user?.correlative.branch.transmitterId || 0,
      startDate,
      endDate
    );
  };

  const series = [
    {
      name: "Total",
      data: data.map((d) => Number(d.total)),
    },
  ];

  const chartOptions: ApexOptions = {
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#D8E3F0",

      strokeDashArray: 5,
    },
    colors: ["#219ebc"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatCurrency(Number(val));
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    yaxis: {
      crosshairs: {
        show: true,
        stroke: {
          width: 1,
          color: "#fb6f92",
          dashArray: 3,
        },
      },
    },
    xaxis: {
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
    },
  };
  return (
    <>
      <div className="col-span-3 p-5 bg-gray-100 rounded-lg dark:bg-gray-900">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
          <div className="grid grid-cols-3 gap-2 py-2">
            <Input
              variant="bordered"
              onChange={(e) => setStartDate(e.target.value)}
              defaultValue={startDate}
              className="w-full"
              type="date"
            />
            <Input
              variant="bordered"
              onChange={(e) => setEndDate(e.target.value)}
              defaultValue={endDate}
              className="w-full"
              type="date"
            />
            <div className="">
              <Autocomplete
                placeholder="Selecciona la sucursal"
                variant="bordered"
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    onClick={() => setBranchId(branch.id)}
                    className="dark:text-white"
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
              className="font-semibold"
              color="primary"
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </div>
          <div className="w-full">
            <Table
              classNames={{
                base: "max-h-[520px]",
                table: "min-h-[400px] overflow-y-scroll",
              }}
              isHeaderSticky
              border={1}
            >
              <TableHeader>
                <TableColumn width={200} style={global_styles().darkStyle}>
                  FECHA
                </TableColumn>
                <TableColumn width={200} style={global_styles().darkStyle}>
                  HORA
                </TableColumn>
                <TableColumn  style={global_styles().darkStyle}>
                  CAJERO
                </TableColumn>
                <TableColumn width={200} style={global_styles().darkStyle}>
                  DESCUENTO
                </TableColumn>
                <TableColumn width={200} style={global_styles().darkStyle}>
                  TOTAL EN VENTAS
                </TableColumn>
                <TableColumn width={200} style={global_styles().darkStyle}>
                  NO. DE CONTROL
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="No se encontraron resultados">
                {sales.map((sale, index) => (
                  <TableRow key={index} className="border">
                    <TableCell>{formatDateShort(sale.fecEmi)}</TableCell>
                    <TableCell>{sale.horEmi}</TableCell>
                    <TableCell>{sale.employee.firstLastName + " " + sale.employee.secondLastName}</TableCell>
                    <TableCell>{formatCurrency(Number(sale.totalDescu))}</TableCell>
                    <TableCell>
                      {formatCurrency(Number(sale.montoTotalOperacion))}
                    </TableCell>
                    <TableCell>{sale.numeroControl}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <DataTable
            className="w-full shadow"
            emptyMessage="No se encontraron resultados"
            tableStyle={{ minWidth: "50rem" }}
            scrollable
            value={sales}
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
              field="box.branch.name"
              header="Sucursal"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="totalDescu"
              header="Descuento"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="montoTotalOperacion"
              header="Total"
            />
          </DataTable> */}
          <div className="col-span-3 p-5 mt-3 bg-white border shadow rounded-2xl">
            <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
            <Chart
              options={chartOptions}
              series={series}
              type="bar"
              height={450}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportSalesByBranch;
