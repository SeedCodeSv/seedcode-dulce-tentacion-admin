import ApexChart from "react-apexcharts";
import { formatCurrency } from "../../../utils/dte";
import { salesReportStore } from "@/store/reports/sales_report.store";

interface Props {
  startDate: string;
  endDate: string;
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

function SalesChartPeriod(props: Props) {
  const {
    sales_by_point_of_sale_branch,
    getSalePointOfSaleByBranch,
    sales_by_period_graph,
  } = salesReportStore();

  const handleFindIndex = (index_p: string) => {
    const findResult = sales_by_period_graph?.data.find(
      (el) => el.branch === index_p
    );
    if (findResult) {
      getSalePointOfSaleByBranch(findResult.id, props.startDate, props.endDate);
    }
  };

  return (
    <>
      <ApexChart
        type="bar"
        series={props.series}
        options={{
          chart: {
            events: {
              dataPointSelection(_, __, options) {
                const label_selected =
                  options.w.config.labels[options.dataPointIndex];
                handleFindIndex(label_selected);
              },
            },
          },
          labels: props.labels,
          title: {
            text: "Ventas por sucursales",
          },
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
        }}
        //   width="100%
        width={"100%"}
        height="500"
      ></ApexChart>

      <div className="mt-10">
        {sales_by_point_of_sale_branch && (
          <>
            <ApexChart
              height={450}
              type="area"
              series={[
                {
                  name: "Ventas",
                  data: sales_by_point_of_sale_branch.salesMap.map((el) =>
                    Number(el.total)
                  ),
                },
              ]}
              options={{
                labels: sales_by_point_of_sale_branch.salesMap.map(
                  (el) => el.code
                ),
                title:{
                  text:"Ventas por punto de venta"
                }
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default SalesChartPeriod;
