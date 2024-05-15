import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import { Button, Input, Switch } from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import { get_user } from "../../storage/localStorage";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { fechaActualString } from "../../utils/dates";
function SalesReportContigence() {
  const [branchId, setBranchId] = useState(0);
  const {
    sales,
    saless,
    pagination_sales,
    pagination_saless,
    OnGetSalesContigence,
    OnGetSalesNotContigence,
  } = useReportContigenceStore();
  useEffect(() => {
    const getSalesContigence = async () => {
      const data = get_user();
      setBranchId(data?.employee.branch.id || 0);
    };
    getSalesContigence();
    {
      if (branchId !== 0) {
        OnGetSalesContigence(
          branchId,
          1,
          5,
          fechaActualString,
          fechaActualString
        );
        OnGetSalesNotContigence(
          branchId,
          1,
          5,
          fechaActualString,
          fechaActualString
        );
      }
    }
  }, [branchId]);
  const [dateInitial, setDateInitial] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const searchSalesContigence = () => {
    OnGetSalesContigence(branchId, 1, 5, dateInitial, dateEnd);
  };
  const searchSalesNotContigence = () => {
    OnGetSalesNotContigence(branchId, 1, 5, dateInitial, dateEnd);
  };
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [isActive, setIsActive] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <>
      {isActive === true ? (
        <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <div className="w-full grid grid-cols-3 gap-5 mb-5">
              <Input
                onChange={(e) => setDateInitial(e.target.value)}
                placeholder="Buscar por nombre..."
                size="lg"
                type="date"
                variant="bordered"
                label="Fecha inicial"
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-semibold",
                }}
              />
              <Input
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Buscar por nombre..."
                size="lg"
                variant="bordered"
                label="Fecha final"
                type="date"
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-semibold",
                }}
              />
              <Button
                onClick={searchSalesContigence}
                className="bg-gray-900 text-white mt-7"
              >
                Buscar
              </Button>
            </div>
            <div className="flex overflow-hidden justify-end  mb-2 mr-3">
              <Switch onChange={() => setIsActive(!isActive)} defaultSelected>
                {isActive ? "No Contigencia" : "Contigencia"}
              </Switch>
            </div>
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={sales}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="fecEmi"
                header="Fecha de Emisión"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="horEmi"
                header="Hora de Emisión"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="subTotal"
                header="Subtotal"
                body={(rowData) => formatCurrency(Number(rowData.subTotal))}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="totalIva"
                header="Total IVA"
                body={(rowData) => formatCurrency(Number(rowData.totalIva))}
              />
            </DataTable>
            {pagination_sales.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={pagination_sales.prevPag}
                    nextPage={pagination_sales.nextPag}
                    currentPage={pagination_sales.currentPag}
                    totalPages={pagination_sales.totalPag}
                    onPageChange={(pageNumber: number) =>
                      OnGetSalesContigence(
                        branchId,
                        pageNumber,
                        5,
                        fechaActualString,
                        fechaActualString
                      )
                    }
                  />
                </div>
                <div className="flex w-full mt-5 md:hidden">
                  <Paginator
                    className="flex justify-between w-full"
                    first={pagination_sales.currentPag}
                    totalRecords={pagination_sales.total}
                    template={{
                      layout: "PrevPageLink CurrentPageReport NextPageLink",
                    }}
                    currentPageReportTemplate="{currentPage} de {totalPages}"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <div className="w-full grid grid-cols-3 gap-5 mb-5">
              <Input
                onChange={(e) => setDateInitial(e.target.value)}
                placeholder="Buscar por nombre..."
                size="lg"
                type="date"
                variant="bordered"
                label="Fecha inicial"
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-semibold",
                }}
              />
              <Input
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Buscar por nombre..."
                size="lg"
                variant="bordered"
                label="Fecha final"
                type="date"
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-semibold",
                }}
              />
              <Button
                onClick={searchSalesNotContigence}
                className="bg-gray-900 text-white mt-7"
              >
                Buscar
              </Button>
            </div>
            <div className="flex overflow-hidden justify-end  mb-2 mr-3">
              <Switch onChange={() => setIsActive(!isActive)} defaultSelected>
                {isActive ? "No Contigencia" : "Contigencia"}
              </Switch>
            </div>
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={saless}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="fecEmi"
                header="Fecha de Emisión"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="horEmi"
                header="Hora de Emisión"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="subTotal"
                header="Subtotal"
                body={(rowData) => formatCurrency(Number(rowData.subTotal))}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="totalIva"
                header="Total IVA"
                body={(rowData) => formatCurrency(Number(rowData.totalIva))}
              />
            </DataTable>
            {pagination_saless.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={pagination_saless.prevPag}
                    nextPage={pagination_saless.nextPag}
                    currentPage={pagination_saless.currentPag}
                    totalPages={pagination_saless.totalPag}
                    onPageChange={(pageNumber: number) =>
                      OnGetSalesNotContigence(
                        branchId,
                        pageNumber,
                        5,
                        fechaActualString,
                        fechaActualString
                      )
                    }
                  />
                </div>
                <div className="flex w-full mt-5 md:hidden">
                  <Paginator
                    className="flex justify-between w-full"
                    first={pagination_saless.currentPag}
                    totalRecords={pagination_saless.total}
                    template={{
                      layout: "PrevPageLink CurrentPageReport NextPageLink",
                    }}
                    currentPageReportTemplate="{currentPage} de {totalPages}"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default SalesReportContigence;
