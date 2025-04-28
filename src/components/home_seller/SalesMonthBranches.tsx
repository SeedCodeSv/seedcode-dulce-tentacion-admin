import ApexChart from 'react-apexcharts';
interface Props {
  sales: {
    title: string;
    labels: string[];
    total: string[];
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
          backgroundImage: `linear-gradient(to right, #00509d, #003f88)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          {sales.title}
        </p>
        <p className="text-sm tracking-wide px-[10px] font-bold text-white uppercase">
        {sales.total}
        </p>
        <ApexChart
          height={150}
          options={{
            labels: sales.labels,
            yaxis: {
              labels: {
                show: false,
              },
            },
            xaxis: {
              type: 'category',
              crosshairs: {
                width: 1,
              },
            },
            colors: ['#ffffff'],
            chart: {
              id: 'sales_month',
              type: 'area',
              group: 'sales_month',
              sparkline: {
                enabled: true,
              },
            },
            stroke: {
              curve: 'smooth',
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
          series={sales.series}
          type="line"
          width={'100%'}
        />
      </div>
    </>
  );
}

export default SalesMonthBranches;
