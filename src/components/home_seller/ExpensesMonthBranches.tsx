
import { useEffect } from "react";
import ApexChart from "react-apexcharts";
import { salesReportStore } from "../../store/reports_seller/sales_report_seller.store";
import { useAuthStore } from "../../store/auth.store";


function SalesMonthBranches() {
  const { user } = useAuthStore();
  const { getSalesByDays, sales_by_day } = salesReportStore();
  useEffect(() => {
    getSalesByDays(user?.employee.branch.id ?? 0);
  }, []);
  const sales = {
    series: [
      {
        name: "Ventas",
        data: sales_by_day.map((item) => item.total),
      },
    ],
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
  };
  return (
    <>
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #028090, #086375)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          {/* {sales.title} */}
          Ventas de la semana
        </p>

        <ApexChart
          type="line"
          series={sales.series}
          height={150}
          width={"100%"}
          options={{
            yaxis: {
              labels: {
                show: false,
              },
            },
            xaxis: {
              type: "category",
              crosshairs: {
                width: 1,
              },
            },
            colors: ["#ffffff"],
            chart: {
              id: "expenses_month",
              type: "area",
              group: "expenses_month",
              sparkline: {
                enabled: true,
              },
            },
            stroke: {
              curve: "smooth",
            },
            grid: {
              padding: {
                bottom: 15,
                left: 15,
                right: 15,
              },
            },
            dataLabels: {
              enabled: false,
            },
          }}
        />
      </div>
    </>
  );
}

export default SalesMonthBranches;
