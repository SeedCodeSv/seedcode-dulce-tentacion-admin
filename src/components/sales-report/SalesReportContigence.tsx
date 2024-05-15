import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  modal,
  useDisclosure,
} from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import { get_user, return_mh_token } from "../../storage/localStorage";
import {
  EditIcon,
  LoaderCircle,
  ScanEye,
  Send,
  SquareChevronRight,
} from "lucide-react";
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
import { useTransmitterStore } from "../../store/transmitter.store";
import { Sale } from "../../types/report_contigence";
import { check_dte } from "../../services/DTE.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ICheckResponse } from "../../types/DTE/check.types";
import { useBillingStore } from "../../store/facturation/billing.store";
import SalesUpdate from "./SalesUpdate";
import SalesEdit from "./SalesUpdate";

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
    searchSalesContigence();
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
  const modalLoading = useDisclosure();

  const baseData = [
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
    <TerminalOutput>'4' - Reiniciar.</TerminalOutput>,
    <TerminalOutput>'0' - Limpia la consola.</TerminalOutput>,
  ];

  const [terminalLineData, setTerminalLineData] = useState(baseData);

  const [selectedSale, setSelectedSale] = useState<Sale>();

  async function onInput(input: string) {
    let ld = [...terminalLineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    if (input.toLocaleLowerCase().trim() === "1") {
      ld.push(<TerminalOutput>Errores encontrados: </TerminalOutput>);
      logs.forEach((log) => {
        ld.push(<TerminalOutput>{log.title}</TerminalOutput>);
        ld.push(<TerminalOutput>{log.message}</TerminalOutput>);
      });
    } else if (input.toLocaleLowerCase().trim() === "2") {
      handleVerifyConsole();
      return;
    } else if (input.toLocaleLowerCase().trim() === "3") {
      ld.push(<TerminalOutput>Jimmy Gay 3</TerminalOutput>);
    } else if (input.toLocaleLowerCase().trim() === "4") {
      setTerminalLineData(baseData);
      return;
    } else if (input.toLocaleLowerCase().trim() === "0") {
      ld = [];
    } else if (input) {
      ld.push(<TerminalOutput>No se encontró el comando</TerminalOutput>);
    }
    setTerminalLineData(ld);
  }

  const [loading, setLoading] = useState(false);

  const { gettransmitter, transmitter } = useTransmitterStore();
  const { cat_005_tipo_de_contingencia, getCat005TipoDeContingencia } =
    useBillingStore();
  useEffect(() => {
    gettransmitter();
    getCat005TipoDeContingencia();
  }, []);

  const handleVerifyConsole = () => {
    if (selectedSale) {
      const payload = {
        nitEmisor: transmitter.nit,
        tdte: selectedSale.tipoDte,
        codigoGeneracion: selectedSale.codigoGeneracion,
      };

      const newLd = <TerminalOutput>Se envió a hacienda</TerminalOutput>;

      const newLd2 = (
        <TerminalOutput>Procesando por favor espere...</TerminalOutput>
      );

      setTerminalLineData((prev) => [...prev, newLd, newLd2]);

      const token_mh = return_mh_token();
      check_dte(payload, token_mh ?? "")
        .then((res) => {
          const newLd = (
            <TerminalOutput>{`Respuesta: DTE ya fue procesado - Sello recepción ${res.data.selloRecibido}`}</TerminalOutput>
          );

          setTerminalLineData((prev) => [...prev, newLd]);
        })
        .catch((error: AxiosError<ICheckResponse>) => {
          if (error.response?.status === 500) {
            const newLd = (
              <TerminalOutput>{`Respuesta: DTE no encontrado en hacienda`}</TerminalOutput>
            );

            setTerminalLineData((prev) => [...prev, newLd]);
            return;
          }

          if (error.response?.data) {
            const newLd = (
              <TerminalOutput>{`Respuesta: ${
                error.response?.data.descripcionMsg ?? "RECHAZADO"
              }`}</TerminalOutput>
            );

            setTerminalLineData((prev) => [...prev, newLd]);
          }
        })
        .finally(() => {
          const newLd2 = (
            <TerminalOutput>{`Petición finalizada`}</TerminalOutput>
          );

          setTerminalLineData((prev) => [...prev, newLd2]);
        });
    }
  };

  const handleEdit = () => {
    <SalesEdit />;
  };

  const handleVerify = (sale: Sale) => {
    setLoading(true);
    modalLoading.onOpen();
    const payload = {
      nitEmisor: transmitter.nit,
      tdte: sale.tipoDte,
      codigoGeneracion: sale.codigoGeneracion,
    };

    const token_mh = return_mh_token();

    check_dte(payload, token_mh ?? "")
      .then((response) => {
        toast.success(response.data.estado, {
          description: `Sello recibido: ${response.data.selloRecibido}`,
        });
        setLoading(false);
        modalLoading.onClose();
      })
      .catch((error: AxiosError<ICheckResponse>) => {
        if (error.status === 500) {
          toast.error("NO ENCONTRADO", {
            description: "DTE no encontrado en hacienda",
          });
          setLoading(false);
          modalLoading.onClose();
          return;
        }

        toast.error("ERROR", {
          description: `Error: ${
            error.response?.data.descripcionMsg ??
            "DTE no encontrado en hacienda"
          }`,
        });
        modalLoading.onClose();
        setLoading(false);
      });
  };

  const handleSendToContingenci = (sale: Sale) => {};

  const modalEdit = useDisclosure();

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
                    <div className="flex gap-5">
                      <Button
                        style={global_styles().dangerStyles}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          setSelectedSale(rowData);
                          handleSelectLogs(rowData.codigoGeneracion);
                        }}
                      >
                        <SquareChevronRight />
                      </Button>
                      <Button
                        style={global_styles().warningStyles}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          handleVerify(rowData);
                        }}
                      >
                        <ScanEye size={20} />
                      </Button>
                      <Button
                        style={global_styles().thirdStyle}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          handleSelectLogs(rowData.codigoGeneracion);
                        }}
                      >
                        <Send size={20} />
                      </Button>

                      <Button
                        style={global_styles().secondaryStyle}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          setSelectedSale(rowData.id);
                          modalEdit.onOpen();
                        }}
                      >
                        <EditIcon size={20} />
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
        title="Enviar a Contingencia"
        isOpen={false}
        size="w-full lg:w-[600px]"
        onClose={() => {
          modalContingencia.onClose();
          setTerminalLineData(baseData);
        }}
      >
        <div>
          <Select
            size="lg"
            label="Motivo contingencia"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Selecciona el motivo"
          >
            {cat_005_tipo_de_contingencia.map((tCon) => (
              <SelectItem key={tCon.codigo} value={tCon.codigo}>
                {tCon.valores}
              </SelectItem>
            ))}
          </Select>

          <div className="mt-5">
            <Textarea
              size="lg"
              label="Información adicional"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Ingresa tus observaciones y comentarios"
            ></Textarea>
          </div>
        </div>
      </ModalGlobal>
      <ModalGlobal
        title=""
        isOpen={modalContingencia.isOpen}
        size="w-full lg:w-[700px] xl:w-[800px] 2xl:w-[900px]"
        onClose={() => {
          modalContingencia.onClose();
          setTerminalLineData(baseData);
        }}
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
      <ModalGlobal
        title={"Procesando"}
        size="w-full md:w-[600px]"
        isOpen={modalLoading.isOpen}
        onClose={modalLoading.onClose}
      >
        <div className="flex flex-col justify-center items-center">
          <LoaderCircle className=" animate-spin" size={75} color="red" />
          <p className="text-lg font-semibold">Cargando por favor espere...</p>
        </div>
      </ModalGlobal>

      <ModalGlobal
        onClose={modalEdit.onClose}
        size="w-full  md:w-[500px]"
        isOpen={modalEdit.isOpen}
      >
        <SalesUpdate onCloseModal={modalEdit.onClose}>

        </SalesUpdate>
      </ModalGlobal>
    </>
  );
}
export default SalesReportContigence;
