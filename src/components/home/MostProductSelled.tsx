import ApexChart from 'react-apexcharts';

interface Props {
  sales: {
    title: string;
    labels: string[];
    total: string;
    branch: string[];
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
          backgroundImage: `linear-gradient(to right, #4361ee, #7678ed)`,
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
          width={'100%'}
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
              id: 'product_most_selled',
              type: 'area',
              group: 'product_most_selled',
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

            
            // tooltip: {
            //   shared: false,
            //   y: {
            //     formatter: (value) => {
            //       return `${value}`;
            //     },
            //   },
            //   custom: ({ dataPointIndex }) => {
            //     const producto = sales.labels[dataPointIndex];
            //     const branch = sales.branch[dataPointIndex];
            //     const total = sales.series[0].data[dataPointIndex];
            //     return `
            //     <div class="w-auto text-left">
            //       <div class="px-4 py-2 flex text-left justify-center items-center bg-gray-100">
            //        <p class="text-sm font-semiboldn ">${branch}</p>
            //       </div>
            //      <div class="w-full px-6 pb-4 text-left">
            //           <span class="ml-2 font-semibold text-left">Producto: </span><span>${producto}</span>
            //           </p>
            //           <span class="ml-2 font-semibold">Total: </span><span>$${total}</span>
            //           </p>
                     
            //       </div>
            //     </div>
            //   `;
            //   },
            // },
            tooltip: {
              shared: false,
              y: {
                formatter: (value) => {
                  return `${value}`;
                },
              },
      
              custom: ({ dataPointIndex }) => {
                const producto = sales.labels[dataPointIndex];
                const branch = sales.branch[dataPointIndex];
                const total = sales.series[0].data[dataPointIndex];
                return `
                  <div style="width: auto; text-align: left; background-color: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
                    <div style="padding: 8px 16px; background-color: #f7fafc; border-bottom: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 14px; font-weight: 600;">${branch}</p>
                    </div>
                    <div style="padding: 8px 16px;">
                      <p style="margin: 0; font-size: 14px;"><span style="font-weight: 600;">Producto: </span>${producto}</p>
                      <p style="margin: 0; font-size: 14px;"><span style="font-weight: 600;">Total: </span>$${total}</p>
                    </div>
                  </div>
                `;
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
