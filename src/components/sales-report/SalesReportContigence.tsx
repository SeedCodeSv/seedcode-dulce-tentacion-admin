import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import { Button, Switch } from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import { get_user } from "../../storage/localStorage";
import { LogIn, SquareChevronRight } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import ModalGlobal from "../global/ModalGlobal";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";

function SalesReportContigence() {
  const [branchId, setBranchId] = useState(0);
  const {
    sales,
    saless,
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

  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Bienvenido a la terminar de contingencia</TerminalOutput>,
    <TerminalOutput></TerminalOutput>,
    <TerminalOutput>Tienes estos comandos disponibles:</TerminalOutput>,
    <TerminalOutput>
      '1' - Muestra todos los errores de la venta.
    </TerminalOutput>,
    <TerminalOutput>
      '2' - Verificar si la venta ya fue procesada en MH.
    </TerminalOutput>,
    <TerminalOutput>'3' - Envía la venta a MH.</TerminalOutput>,
    <TerminalOutput>'0' - Limpia la consola.</TerminalOutput>,
  ]);

  function onInput(input: string) {
    let ld = [...terminalLineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    if (input.toLocaleLowerCase().trim() === "1") {
      ld.push(<TerminalOutput>Jimmy Gay</TerminalOutput>);
    } else if (input.toLocaleLowerCase().trim() === "2") {
      ld.push(<TerminalOutput>Jimmy Gay 2</TerminalOutput>);
    } else if (input.toLocaleLowerCase().trim() === "3") {
      ld.push(<TerminalOutput>Jimmy Gay 3</TerminalOutput>);
    } else if (input.toLocaleLowerCase().trim() === "0") {
      ld = [];
    } else if (input) {
      ld.push(<TerminalOutput>No se encontró el comando</TerminalOutput>);
    }
    setTerminalLineData(ld);
  }

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
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="totalIva"
                header="Acciones"
                body={
                  <div>
                    <Button
                      style={global_styles().dangerStyles}
                      size="lg"
                      isIconOnly
                    >
                      <SquareChevronRight />
                    </Button>
                  </div>
                }
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
      <ModalGlobal
        title=""
        isOpen={true}
        size="w-full md:w-[700px] lg:w-[800px]"
        onClose={() => {}}
      >
        <div>
          <Terminal
            onInput={onInput}
            name="Contingencia"
            colorMode={ColorMode.Dark}
          >
            {terminalLineData}
          </Terminal>
        </div>
      </ModalGlobal>
    </>
  );
}

export default SalesReportContigence;
