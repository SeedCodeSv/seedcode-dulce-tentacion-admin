import ApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/dte";
import { salesReportStore } from "@/store/reports/sales_report.store";
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  startDate: string;
  endDate: string;
  labels: string[];
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

  const { windowSize } = useWindowSize();

  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (windowSize.width < 600) setItemsPerPage(3);
  }, [windowSize.width]);

  const totalPages = Math.ceil(
    sales_by_period_graph!.data.length / itemsPerPage
  );

  const series = useMemo(() => {
    if (windowSize.width < 768) {
      return [
        {
          name: "Total",
          data: sales_by_period_graph!.data
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((d) => Number(d.total))
            .sort((a, b) => b - a),
        },
      ];
    }

    return [
      {
        name: "Total",
        data: sales_by_period_graph!.data
          .map((d) => Number(d.total))
          .sort((a, b) => b - a),
      },
    ];
  }, [
    windowSize.width,
    sales_by_period_graph!.data,
    currentPage,
    itemsPerPage,
  ]);

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
  }, [
    windowSize.width,
    sales_by_period_graph!.data,
    currentPage,
    itemsPerPage,
  ]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
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
                const label_selected =
                  options.w.config.labels[options.dataPointIndex];
                handleFindIndex(label_selected);
              },
            },
          },
          labels: labels,
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
            labels: {
              formatter(value) {
                return Number(value).toFixed(0);
              },
            },
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
                title: {
                  text: "Ventas por punto de venta",
                },
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default SalesChartPeriod;
