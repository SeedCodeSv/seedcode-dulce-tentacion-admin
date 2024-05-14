import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import { get_user } from "../../storage/localStorage";
function SalesReportContigence() {
  const [branchId, setBranchId] = useState(0);
  const { sales, saless, OnGetSalesContigence, OnGetSalesNotContigence } =
    useReportContigenceStore();
  useEffect(() => {
    const getSalesContigence = async () => {
      const data = get_user();
      setBranchId(data?.employee.branch.id || 0);
    };
    getSalesContigence();
    {
      if (branchId !== 0) {
        OnGetSalesContigence(branchId, 1, 5);
        OnGetSalesNotContigence(branchId, 1, 5);
      }
    }
  }, [branchId]);
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
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
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
          </div>
        </div>
      )}
    </>
  );
}

export default SalesReportContigence;
