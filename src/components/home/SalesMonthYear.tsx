import ApexChart from "react-apexcharts";

interface Props {
  sales: {
    title: string;
    labels: string[];
    total: number;
    series: {
      name: string;
      data: number[];
    }[];
  };
}

function SalesMonthBranches({ sales }: Props) {
  return (
    <>
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #f7934c, #f08080)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          {sales.title}
        </p>
        <p className="text-sm tracking-wide px-[10px] font-bold text-white uppercase">
          {sales.total}
        </p>
        <ApexChart
          type="line"
          series={sales.series}
          height={150}
          width={"100%"}
          options={{
            labels: sales.labels,
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
              id: "sales_month_year",
              type: "area",
              group: "sales_month_year",
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
