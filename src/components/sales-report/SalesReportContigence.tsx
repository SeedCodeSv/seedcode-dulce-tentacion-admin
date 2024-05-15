import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import { Button, Input, Switch, useDisclosure } from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import { get_user } from "../../storage/localStorage";
import { SquareChevronRight } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import ModalGlobal from "../global/ModalGlobal";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";
import { fechaActualString, formatDate } from "../../utils/dates";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { useLogsStore } from "../../store/logs.store";

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
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [dateEnd, setDateEnd] = useState(formatDate());
  const searchSalesContigence = () => {
    OnGetSalesContigence(branchId, 1, 5, dateInitial, dateEnd);
  };
  const searchSalesNotContigence = () => {
    searchSalesContigence()
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

  const { logs, getLogs } = useLogsStore();

  const handleSelectLogs = (code: string) => {
    getLogs(code);
    modalContingencia.onOpen();
  };

  const modalContingencia = useDisclosure();

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

  async function onInput(input: string) {
    let ld = [...terminalLineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    if (input.toLocaleLowerCase().trim() === "1") {
      logs.forEach((log) => {
        ld.push(<TerminalOutput>{log.message}</TerminalOutput>);
      });
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
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="w-full grid grid-cols-3 gap-5 mb-5">
            <Input
              onChange={(e) => setDateInitial(e.target.value)}
              value={dateInitial}
              defaultValue={formatDate()}
              placeholder="Buscar por nombre..."
              size="lg"
              type="date"
              variant="bordered"
              label="Fecha inicial"
              labelPlacement="outside"
              classNames={{
                input: "dark:text-white dark:border-gray-600",
                label: "text-sm font-semibold dark:text-white",
              }}
            />
            <Input
              onChange={(e) => setDateEnd(e.target.value)}
              value={dateEnd}
              placeholder="Buscar por nombre..."
              size="lg"
              variant="bordered"
              label="Fecha final"
              type="date"
              labelPlacement="outside"
              classNames={{
                input: "dark:text-white dark:border-gray-600",
                label: "text-sm font-semibold dark:text-white",
              }}
            />
            <Button
              onClick={searchSalesNotContigence}
              className="bg-gray-900 text-white mt-7 dark:bg-gray-700 dark:text-gray-200"
            >
              Buscar
            </Button>
          </div>

          <div className="flex overflow-hidden justify-end  mb-2 mr-3">
            <Switch onChange={() => setIsActive(!isActive)} defaultSelected>
              {isActive ? "No Contigencia" : "Contigencia"}
            </Switch>
          </div>
          {isActive === true ? (
            <>
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
            </>
          ) : (
            <>
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
                  body={(rowData) => (
                    <div>
                      <Button
                        style={global_styles().dangerStyles}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          handleSelectLogs(rowData.codigoGeneracion);
                        }}
                      >
                        <SquareChevronRight />
                      </Button>
                    </div>
                  )}
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
                          dateInitial,
                          dateEnd
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
            </>
          )}
        </div>
      </div>
      <ModalGlobal
        title=""
        isOpen={modalContingencia.isOpen}
        size="w-full
        
        "
        onClose={modalContingencia.onClose}
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
