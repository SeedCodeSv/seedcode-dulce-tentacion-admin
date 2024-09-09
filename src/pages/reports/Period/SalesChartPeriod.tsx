import ApexChart from 'react-apexcharts';
import { formatCurrency } from '@/utils/dte';
import { salesReportStore } from '@/store/reports/sales_report.store';
import useWindowSize from '@/hooks/useWindowSize';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeContext } from '@/hooks/useTheme';
import { ApexTooltip } from '@/types/Apex';
import { SalesGraph } from '@/types/reports/sales_by_period.report';
import { getRandomColorsArray } from '@/utils/filters';

interface Props {
  startDate: string;
  endDate: string;
  labels: string[];
}

function SalesChartPeriod(props: Props) {
  const { context } = useContext(ThemeContext);

  const {
    sales_by_point_of_sale_branch,
    loading_sales_by_point_of_sale_branch,
    getSalePointOfSaleByBranch,
    sales_by_period_graph,
  } = salesReportStore();
  const [branchSelected, setBranchSelected] = useState<SalesGraph>();

  const handleFindIndex = (index_p: string) => {
    const findResult = sales_by_period_graph?.data.find((el) => el.branch === index_p);
    if (findResult) {
      getSalePointOfSaleByBranch(findResult.id, props.startDate, props.endDate);
      setBranchSelected(findResult);
    }
  };

  const { windowSize } = useWindowSize();

  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (windowSize.width < 600) setItemsPerPage(3);
  }, [windowSize.width]);

  const totalPages = Math.ceil(sales_by_period_graph!.data.length / itemsPerPage);

  const series = useMemo(() => {
    if (windowSize.width < 768) {
      return [
        {
          name: 'Total',
          data: sales_by_period_graph!.data
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((d) => Number(d.total))
            .sort((a, b) => b - a),
        },
      ];
    }

    return [
      {
        name: 'Total',
        data: sales_by_period_graph!.data.map((d) => Number(d.total)).sort((a, b) => b - a),
      },
    ];
  }, [windowSize.width, sales_by_period_graph!.data, currentPage, itemsPerPage]);

  const labels = useMemo(() => {
    if (windowSize.width < 768) {
      return sales_by_period_graph!.data
        .sort((a, b) => Number(b.total) - Number(a.total))
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((d) => d.branch);
    }

    return sales_by_period_graph!.data
      .sort((a, b) => Number(b.total) - Number(a.total))
      .map((d) => d.branch);
  }, [windowSize.width, sales_by_period_graph!.data, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const itemTooltip = (label: string) => {
    const findResult = sales_by_period_graph?.data.find((el) => el.branch === label);
    if (findResult) {
      return `<p class="bg-gray-200 dark:bg-gray-800 p-2 px-4 font-semibold">${
        findResult.branch
      }</p>
      <p class="px-4 py-2 flex gap-2"><span class="h-4 w-4 rounded-full bg-blue-500"></span> Total: ${formatCurrency(
        findResult.total
      )}</p>
       <p class="px-4 py-2 flex gap-2"><span class="h-4 w-4 rounded-full bg-blue-500"></span> No de ventas: ${
         findResult.quantity
       }</p>
      `;
    }

    return '';
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="pb-4 text-lg font-semibold dark:text-white">Gráfico de Ventas</p>
        {windowSize.width < 768 && (
          <>
            <div className="flex gap-3">
              <Button isIconOnly onClick={handlePrevPage}>
                <ChevronLeft />
              </Button>
              <Button isIconOnly onClick={handleNextPage}>
                <ChevronRight />
              </Button>
            </div>
          </>
        )}
      </div>
      <ApexChart
        type="bar"
        series={series}
        options={{
          chart: {
            events: {
              dataPointSelection(_, __, options) {
                const label_selected = options.w.config.labels[options.dataPointIndex];
                handleFindIndex(label_selected);
              },
            },
          },
          labels: labels,
          title: {
            text: 'Ventas por sucursales',
            style: {
              color: context === 'light' ? '#000' : '#fff',
            },
          },
          tooltip: {
            custom(options: ApexTooltip) {
              return `<div class="shadow-2xl dark:bg-black dark:text-white rounded-md text-xs">
                ${itemTooltip(options.w.globals.labels[options.dataPointIndex])}
                </div>`;
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            },
          },
          grid: {
            show: true,
            borderColor: '#D8E3F0',

            strokeDashArray: 5,
          },
          colors: ['#219ebc'],
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return formatCurrency(Number(val));
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: [...(context === 'light' ? ['#000'] : labels.map(() => '#fff'))],
            },
          },
          yaxis: {
            labels: {
              formatter(value) {
                return Number(value).toFixed(0);
              },
              style: {
                cssClass: 'text-white',
                colors: [...(context === 'light' ? ['#000'] : ['#fff'])],
              },
            },
            crosshairs: {
              show: true,
              stroke: {
                width: 1,
                color: '#fb6f92',
                dashArray: 3,
              },
            },
          },
          xaxis: {
            labels: {
              style: {
                cssClass: 'text-white',
                colors: [...(context === 'light' ? ['#000'] : labels.map(() => '#fff'))],
              },
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
          },
        }}
        //   width="100%
        width={'100%'}
        height="500"
      ></ApexChart>

      {/* <div className="mt-10">
        {sales_by_point_of_sale_branch && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="w-full p-4 border shadow dark:border-gray-600 rounded-2xl">
              <ApexChart
                height={windowSize.width < 600 ? 300 : 300}
                type="donut"
                series={[...sales_by_point_of_sale_branch.salesMap.map((el) => el.total)]}
                options={{
                  labels: [...sales_by_point_of_sale_branch.salesMap.map((el) => el.code)],
                  title: {
                    text: 'Ventas por punto de venta',
                    style: {
                      color: context === 'light' ? '#000' : '#fff',
                    },
                  },
                  fill: {
                    opacity: 1,
                    type: 'gradient',
                    gradient: {
                      type: 'vertical',
                      shadeIntensity: 1,
                      inverseColors: false,
                      opacityFrom: 1,
                      opacityTo: 1,
                      stops: [100, 100],
                    },
                  },
                  colors: [...getRandomColorsArray()],
                  plotOptions: {
                    pie: {
                      customScale: 1,
                      donut: {
                        size: '55%',
                        labels: {
                          show: true,
                          name: {
                            show: true,
                            color: context === 'light' ? '#000' : '#fff',
                            fontSize: '16px',
                          },
                          value: {
                            show: true,
                            color: context === 'light' ? '#000' : '#fff',
                            fontSize: '14px',
                            formatter(val) {
                              return formatCurrency(Number(val));
                            },
                          },
                        },
                      },
                      offsetY: 20,
                    },
                  },
                  legend: {
                    show: true,
                    position: windowSize.width < 600 ? 'bottom' : 'left',
                    offsetY: windowSize.width < 600 ? 0 : 80,
                    labels: {
                      colors: context === 'light' ? '#000' : '#fff',
                    },
                  },
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-center w-full p-4 border shadow dark:border-gray-600 rounded-2xl">
              <p className="py-2 text-xl font-semibold md:text-2xl">{branchSelected?.branch}</p>
              <p className="py-2 text-xl font-semibold md:text-2xl ">
                No de ventas: {branchSelected?.quantity}
              </p>
              <p className="py-2 text-xl font-semibold md:text-2xl ">
                Total:{' '}
                <span className="font-bold text-green-500">
                  {formatCurrency(Number(branchSelected?.total ?? 0))}
                </span>
              </p>
            </div>
          </div>
        )}
      </div> */}

      {loading_sales_by_point_of_sale_branch ? (
        <div className="flex flex-col items-center justify-center w-full h-64">
          <div className="loader"></div>
          <p className="mt-3 text-xl font-semibold">Cargando...</p>
        </div>
      ) : (
        <>
          {sales_by_point_of_sale_branch && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="w-full p-4 border shadow dark:border-gray-600 rounded-2xl">
                <ApexChart
                  height={windowSize.width < 600 ? 300 : 300}
                  type="donut"
                  series={[...sales_by_point_of_sale_branch.salesMap.map((el) => el.total)]}
                  options={{
                    labels: [...sales_by_point_of_sale_branch.salesMap.map((el) => el.code)],
                    title: {
                      text: 'Ventas por punto de venta',
                      style: {
                        color: context === 'light' ? '#000' : '#fff',
                      },
                    },
                    fill: {
                      opacity: 1,
                      type: 'gradient',
                      gradient: {
                        type: 'vertical',
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [100, 100],
                      },
                    },
                    colors: [...getRandomColorsArray()],
                    plotOptions: {
                      pie: {
                        customScale: 1,
                        donut: {
                          size: '55%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              color: context === 'light' ? '#000' : '#fff',
                              fontSize: '16px',
                            },
                            value: {
                              show: true,
                              color: context === 'light' ? '#000' : '#fff',
                              fontSize: '14px',
                              formatter(val) {
                                return formatCurrency(Number(val));
                              },
                            },
                          },
                        },
                        offsetY: 20,
                      },
                    },
                    legend: {
                      show: true,
                      position: windowSize.width < 600 ? 'bottom' : 'left',
                      offsetY: windowSize.width < 600 ? 0 : 80,
                      labels: {
                        colors: context === 'light' ? '#000' : '#fff',
                      },
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center w-full p-4 border shadow dark:border-gray-600 rounded-2xl">
                <p className="py-2 text-xl font-semibold md:text-2xl">{branchSelected?.branch}</p>
                <p className="py-2 text-xl font-semibold md:text-2xl ">
                  No de ventas: {branchSelected?.quantity}
                </p>
                <p className="py-2 text-xl font-semibold md:text-2xl ">
                  Total:{' '}
                  <span className="font-bold text-green-500">
                    {formatCurrency(Number(branchSelected?.total ?? 0))}
                  </span>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SalesChartPeriod;
