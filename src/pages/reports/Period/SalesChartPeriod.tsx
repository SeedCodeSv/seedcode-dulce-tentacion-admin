import ApexChart from "react-apexcharts";
import { formatCurrency } from "../../../utils/dte";

interface Props {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

function SalesChartPeriod(props: Props) {
  return (
    <ApexChart
      type="bar"
      series={props.series}
      options={{
        labels: props.labels,
        title: {
          text: "Ventas por mes",
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
  );
}

export default SalesChartPeriod;
