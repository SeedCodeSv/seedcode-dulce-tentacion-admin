import { ThemeContext } from "@/hooks/useTheme";
import useWindowSize from "@/hooks/useWindowSize";
import { salesReportStore } from "@/store/reports/sales_report.store";
import { formatCurrency } from "@/utils/dte";
import { getRandomColorsArray } from "@/utils/filters";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import ApexCharts from "react-apexcharts";
import { GraphicSubCategory } from "../../../types/reports/sales.reports.types";

interface Props {
  startDate: string;
  endDate: string;
  branch: string;
}

function GraphicProductCategory(props: Props) {
  const { context } = useContext(ThemeContext);

  const {
    graphic_for_category_products_for_dates,
    graphic_sub_category_products_for_dates,
    getGraphicSubCategoryProductsForDates,
  } = salesReportStore();

  const { windowSize } = useWindowSize();

  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [subcategorySelected, setSubcategorySelected] = useState(0);

  useEffect(() => {
    if (subcategorySelected > 0) {
      getGraphicSubCategoryProductsForDates(
        subcategorySelected,
        props.startDate,
        props.endDate,
        props.branch
      );
    }
  }, [subcategorySelected]);

  useEffect(() => {
    if (windowSize.width < 600) setItemsPerPage(3);
  }, [windowSize.width]);

  const totalPages = Math.ceil(
    graphic_for_category_products_for_dates.length / itemsPerPage
  );

  const series = useMemo(() => {
    if (windowSize.width < 768) {
      return [
        {
          name: "Total",
          data: graphic_for_category_products_for_dates
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((d) => Number(d.totalItems))
            .sort((a, b) => b - a),
        },
      ];
    }

    return [
      {
        name: "Total",
        data: graphic_for_category_products_for_dates
          .map((d) => Number(d.totalItems))
          .sort((a, b) => b - a),
      },
    ];
  }, [
    windowSize.width,
    graphic_for_category_products_for_dates,
    currentPage,
    itemsPerPage,
  ]);

  const labels = useMemo(() => {
    if (windowSize.width < 768) {
      return graphic_for_category_products_for_dates
        .sort((a, b) => Number(b.totalItems) - Number(a.totalItems))
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((d) => d.categoryName);
    }

    return graphic_for_category_products_for_dates
      .sort((a, b) => Number(b.totalItems) - Number(a.totalItems))
      .map((d) => d.categoryName);
  }, [
    windowSize.width,
    graphic_for_category_products_for_dates,
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
  };

  //SUB CATEGORY
  const series_sub = useMemo(() => {
    return [
      {
        name: "Total",
        data: graphic_sub_category_products_for_dates
          .map((d) => Number(d.totalItems))
          .sort((a, b) => b - a),
      },
    ];
  }, [graphic_sub_category_products_for_dates]);

  const labels_sub = useMemo(() => {
    return graphic_sub_category_products_for_dates
      .sort((a, b) => Number(b.totalItems) - Number(a.totalItems))
      .map((d) => d.subCategoryName);
  }, [graphic_sub_category_products_for_dates]);

  const [selectedSubCategory, setSelectedSubCategory] = useState<
    GraphicSubCategory
  >();

  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <p className="pb-4 text-lg font-semibold dark:text-white">
          Ventas por categoría
        </p>
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
      <ApexCharts
        type="bar"
        height={400}
        series={series}
        options={{
          chart: {
            events: {
              dataPointSelection(_, __, options) {
                const label_selected =
                  options.w.config.labels[options.dataPointIndex];

                const subcategory_selected = graphic_for_category_products_for_dates.find(
                  (d) => d.categoryName === label_selected
                );
                setSubcategorySelected(subcategory_selected?.categoryId || 0);
              },
              xAxisLabelClick(_, __, options) {
                const label_selected =
                  options.config.labels[options.labelIndex];

                const subcategory_selected = graphic_for_category_products_for_dates.find(
                  (d) => d.categoryName === label_selected
                );
                setSubcategorySelected(subcategory_selected?.categoryId || 0);
              },
              legendClick(_, index: number, options) {
                const label_selected = options.config.labels[index];
                const subcategory_selected = graphic_for_category_products_for_dates.find(
                  (d) => d.categoryName === label_selected
                );
                setSubcategorySelected(subcategory_selected?.categoryId || 0);
              },
            },
          },
          labels: labels,
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: "50%",
              distributed: true,

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
          colors: [...getRandomColorsArray()],

          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return formatCurrency(Number(val));
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: [
                ...(context === "light" ? ["#000"] : labels.map(() => "#fff")),
              ],
            },
          },
          xaxis: {
            labels: {
              show: false,
              style: {
                cssClass: "text-white",
                colors: [...(context === "light" ? ["#000"] : ["#fff"])],
              },
            },
          },
          legend: {
            show: true,
            labels:{
              colors: [...(context === "light" ? ["#000"] : [...Array.from({length: labels.length}, () => "#fff")])],
            }
          },
          yaxis: {
            labels: {
              formatter(value) {
                return Number(value).toFixed(0);
              },
              style: {
                cssClass: "text-white",
                colors: [...(context === "light" ? ["#000"] : ["#fff"])],
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
        }}
      />
      {graphic_sub_category_products_for_dates.length > 0 && (
        <div className="w-full p-5 mt-5 bg-white border shadow dark:bg-gray-950 rounded-2xl">
          {windowSize.width < 900 && selectedSubCategory && (
            <div className="flex flex-col items-center justify-center">
              <p className="py-2 text-sm font-semibold text-left dark:text-white">
                Categoria: {selectedSubCategory?.subCategoryName}
              </p>
              <p className="py-2 text-sm font-semibold text-left dark:text-white">
                Total:{" "}
                {formatCurrency(Number(selectedSubCategory?.totalItems) || 0)}
              </p>
            </div>
          )}
          <ApexCharts
            type="donut"
            height={windowSize.width < 900 ? 450 : 500}
            series={series_sub[0].data}
            options={{
              chart: {
                events: {
                  dataPointSelection(_, __, options) {
                    setSelectedSubCategory(
                      graphic_sub_category_products_for_dates[
                        options.dataPointIndex
                      ]
                    );
                  },
                },
              },
              labels: [...labels_sub],
              fill: {
                opacity: 1,
                type: "gradient",
                gradient: {
                  type: "vertical",
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [100, 90],
                },
              },
              colors: [...getRandomColorsArray()],
              plotOptions: {
                pie: {
                  customScale: 1,
                  donut: {
                    size: "55%",
                    labels: {
                      show: windowSize.width < 900 ? false : true,
                      name: {
                        show: true,
                        color: context === "light" ? "#000" : "#fff",
                        fontSize: "12px",
                      },
                      value: {
                        show: true,
                        color: context === "light" ? "#000" : "#fff",
                        fontSize: "16px",
                        formatter(val) {
                          return formatCurrency(Number(val));
                        },
                      },
                    },
                  },

                  offsetY: 0,
                },
              },

              legend: {
                show: true,
                position: windowSize.width < 900 ? "bottom" : "left",
                offsetY: windowSize.width < 900 ? 0 : 80,
                labels: {
                  colors: context === "light" ? "#000" : "#fff",
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
}

export default GraphicProductCategory;
