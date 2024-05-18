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
  useDisclosure,
} from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { useReportContigenceStore } from "../../store/report_contigence.store";
import {
  get_token,
  get_user,
  return_mh_token,
} from "../../storage/localStorage";
import {
  EditIcon,
  Filter,
  LoaderCircle,
  RefreshCwOff,
  ScanEye,
  Send,
  ShieldAlert,
  SquareChevronRight,
  Trash2Icon,
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
import { Customer, Sale } from "../../types/report_contigence";
import {
  check_dte,
  firmarDocumentoContingencia,
  firmarDocumentoFactura,
  firmarDocumentoFiscal,
  send_to_mh,
  send_to_mh_contingencia,
} from "../../services/DTE.service";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ICheckResponse } from "../../types/DTE/check.types";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useContingenciaStore } from "../../plugins/dexie/store/contigencia.store";
import { useContingenciaCreditoStore } from "../../plugins/dexie/store/contingencia_credito.store";
import { generate_uuid } from "../../utils/random/random";
import { IContingencia } from "../../types/DTE/contingencia.types";
import { ambiente, API_URL, MH_QUERY } from "../../utils/constants";
import { generate_contingencia } from "../../utils/DTE/contigencia";
import { generateFactura } from "./generate";
import { generateCredit } from "./credito_generate";
import { PayloadMH } from "../../types/DTE/DTE.types";
import { SendMHFailed } from "../../types/transmitter.types";
import { save_logs } from "../../services/logs.service";
import { pdf } from "@react-pdf/renderer";
import { Invoice } from "../../pages/Invoice";
import { CreditoInvoice } from "../../pages/CreditInvoice";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../../plugins/s3";
import { delete_credito_venta } from "../../plugins/dexie/services/credito_venta.service";
import { delete_venta } from "../../plugins/dexie/services/venta.service";
import { SaleInvalidation } from "./SaleInvalidation";
import UpdateCustomerSales from "./UpdateCustomerSale";
import { Drawer } from "vaul";
import classNames from "classnames";

function SalesReportContigence() {
  const [openVaul, setOpenVaul] = useState(false);
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
  const { theme, context } = useContext(ThemeContext);
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
  const modalError = useDisclosure();
  const modalContingencia = useDisclosure();
  const modalLoading = useDisclosure();
  const modalAnulation = useDisclosure();

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
      logs.forEach((log, index) => {
        ld.push(
          <TerminalOutput>{`${index + 1}: ${log.title}`}</TerminalOutput>
        );
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

  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");
  const [loadingContingencia, setLoadingContingencia] = useState(false);
  const modalErrorContingencia = useDisclosure();

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

  const handleVerifyEdit = (sale: Sale) => {
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
        modalEdit.onOpen()
      });
  };

  const { getVentaByCodigo } = useContingenciaStore();
  const { getCreditoVentaByCodigo } = useContingenciaCreditoStore();
  const [contingencia, setContingencia] = useState("2");
  const [motivoContigencia, setMotivoContigencia] = useState("");

  const handleSendToContingencia = async (sale: Sale) => {
    console.log("Sales ya en el metodo",sale)
    const result_generation = await getVentaByCodigo(sale.codigoGeneracion);
    const result_credito_generate = await getCreditoVentaByCodigo(
      sale.codigoGeneracion
    );
    const token_mh = return_mh_token();

    const correlatives = [
      {
        noItem: 1,
        codigoGeneracion: generate_uuid().toUpperCase(),
        tipoDoc: sale.tipoDte,
      },
    ];

    const contingencia_send: IContingencia = generate_contingencia(
      transmitter,
      correlatives,
      contingencia,
      motivoContigencia
    );

    setLoadingContingencia(true);
    modalLoading.onOpen();

    firmarDocumentoContingencia(contingencia_send)
      .then((result) => {
        const send = {
          nit: transmitter.nit,
          documento: result.data.body,
        };

        send_to_mh_contingencia(send, token_mh ?? "")
          .then((contingencia) => {
            if (contingencia.data.estado === "RECIBIDO") {
              toast.success("Contingencia exitosa");
              console.log(sale.tipoDte);
              if (sale.tipoDte === "01") {
                if (result_generation) {
                  const data = generateFactura(
                    result_generation,
                    transmitter,
                    sale
                  );
                  firmarDocumentoFactura(data).then((firmador) => {
                    const data_send: PayloadMH = {
                      ambiente: ambiente,
                      idEnvio: 1,
                      version: 1,
                      tipoDte: "01",
                      documento: firmador.data.body,
                    };

                    toast.info("Se ah enviado a hacienda, esperando respuesta");

                    const source = axios.CancelToken.source();

                    const timeout = setTimeout(() => {
                      source.cancel("El tiempo de espera ha expirado");
                    }, 25000);

                    send_to_mh(data_send, token_mh ?? "", source)
                      .then(async (respuestaMH) => {
                        clearTimeout(timeout);
                        toast.success("Hacienda respondió correctamente", {
                          description: "Estamos guardando tus datos",
                        });

                        const json_url = `CLIENTES/${
                          transmitter.nombre
                        }/${new Date().getFullYear()}/VENTAS/FACTURAS/${formatDate()}/${
                          data.dteJson.identificacion.codigoGeneracion
                        }/${data.dteJson.identificacion.codigoGeneracion}.json`;
                        const pdf_url = `CLIENTES/${
                          transmitter.nombre
                        }/${new Date().getFullYear()}/VENTAS/FACTURAS/${formatDate()}/${
                          data.dteJson.identificacion.codigoGeneracion
                        }/${data.dteJson.identificacion.codigoGeneracion}.pdf`;

                        const JSON_DTE = JSON.stringify(
                          {
                            ...data.dteJson,
                            respuestaMH: respuestaMH.data,
                            firma: firmador.data.body,
                          },
                          null,
                          2
                        );
                        const json_blob = new Blob([JSON_DTE], {
                          type: "application/json",
                        });

                        const blob = await pdf(
                          <Invoice
                            MHUrl={generateURLMH(
                              ambiente,
                              data.dteJson.identificacion.codigoGeneracion,
                              data.dteJson.identificacion.fecEmi
                            )}
                            DTE={data}
                            sello={respuestaMH.data.selloRecibido}
                          />
                        ).toBlob();

                        if (json_blob && blob) {
                          const uploadParams: PutObjectCommandInput = {
                            Bucket: "seedcode-facturacion",
                            Key: json_url,
                            Body: json_blob,
                          };
                          const uploadParamsPDF: PutObjectCommandInput = {
                            Bucket: "seedcode-facturacion",
                            Key: pdf_url,
                            Body: blob,
                          };

                          s3Client
                            .send(new PutObjectCommand(uploadParamsPDF))
                            .then((response) => {
                              if (response.$metadata) {
                                s3Client
                                  .send(new PutObjectCommand(uploadParams))
                                  .then((response) => {
                                    if (response.$metadata) {
                                      const token = get_token() ?? "";

                                      axios
                                        .put(
                                          API_URL +
                                            "/sales/sale-update-transaction",
                                          {
                                            pdf: pdf_url,
                                            dte: json_url,
                                            cajaId: Number(
                                              localStorage.getItem("box")
                                            ),
                                            codigoEmpleado: 1,
                                            sello: true,
                                          },
                                          {
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          }
                                        )
                                        .then(() => {
                                          toast.success(
                                            "Se completo con éxito la venta"
                                          );
                                          delete_venta(
                                            data.dteJson.identificacion
                                              .codigoGeneracion
                                          );
                                          modalLoading.onClose();
                                          OnGetSalesNotContigence(
                                            branchId,
                                            1,
                                            5,
                                            dateInitial,
                                            dateEnd
                                          );
                                          setLoading(false);
                                        })
                                        .catch(() => {
                                          toast.error(
                                            "Error al guardar la venta"
                                          );
                                          setLoading(false);
                                          modalLoading.onClose();
                                        });
                                    }
                                  });
                              }
                            });
                        }
                      })
                      .catch(async (error: AxiosError<SendMHFailed>) => {
                        clearTimeout(timeout);
                        modalLoading.onClose();
                        if (axios.isCancel(error)) {
                          setTitle("Tiempo de espera agotado");
                          setErrorMessage(
                            "El tiempo limite de espera ha expirado"
                          );
                          modalErrorContingencia.onOpen();
                          setLoading(false);
                        }

                        if (error.response?.data) {
                          await save_logs({
                            title:
                              "Contingencia: " +
                                error.response.data.descripcionMsg ??
                              "Error al procesar venta",
                            message:
                              error.response.data.observaciones &&
                              error.response.data.observaciones.length > 0
                                ? error.response?.data.observaciones.join(
                                    "\n\n"
                                  )
                                : "",
                            generationCode:
                              data.dteJson.identificacion.codigoGeneracion,
                          });
                          setErrorMessage(
                            error.response.data.observaciones &&
                              error.response.data.observaciones.length > 0
                              ? error.response?.data.observaciones.join("\n\n")
                              : ""
                          );
                          setTitle(
                            error.response.data.descripcionMsg ??
                              "Error al procesar venta"
                          );
                          modalErrorContingencia.onOpen();
                          setLoading(false);
                        }
                      });
                  });
                }
              } else {
                if (result_credito_generate) {
                  const data = generateCredit(
                    result_credito_generate,
                    transmitter,
                    sale
                  );
                  const source = axios.CancelToken.source();

                  const timeout = setTimeout(() => {
                    source.cancel("El tiempo de espera ha expirado");
                  }, 25000);
                  firmarDocumentoFiscal(data)
                    .then((firmador) => {
                      const data_send: PayloadMH = {
                        ambiente: ambiente,
                        idEnvio: 1,
                        version: 3,
                        tipoDte: "03",
                        documento: firmador.data.body,
                      };
                      toast.info(
                        "Se ah enviado a hacienda, esperando respuesta"
                      );
                      send_to_mh(data_send, token_mh ?? "", source)
                        .then(async (respuestaMH) => {
                          clearTimeout(timeout);
                          toast.success("Hacienda respondió correctamente", {
                            description: "Estamos guardando tus datos",
                          });

                          const json_url = `CLIENTES/${
                            transmitter.nombre
                          }/${new Date().getFullYear()}/VENTAS/CRÉDITO_FISCAL/${formatDate()}/${
                            data.dteJson.identificacion.codigoGeneracion
                          }/${
                            data.dteJson.identificacion.codigoGeneracion
                          }.json`;
                          const pdf_url = `CLIENTES/${
                            transmitter.nombre
                          }/${new Date().getFullYear()}/VENTAS/CRÉDITO_FISCAL/${formatDate()}/${
                            data.dteJson.identificacion.codigoGeneracion
                          }/${
                            data.dteJson.identificacion.codigoGeneracion
                          }.pdf`;

                          const JSON_DTE = JSON.stringify(
                            {
                              ...data.dteJson,
                              respuestaMH: respuestaMH.data,
                              firma: firmador.data.body,
                            },
                            null,
                            2
                          );
                          const json_blob = new Blob([JSON_DTE], {
                            type: "application/json",
                          });

                          const blob = await pdf(
                            <CreditoInvoice
                              MHUrl={generateURLMH(
                                ambiente,
                                data.dteJson.identificacion.codigoGeneracion,
                                data.dteJson.identificacion.fecEmi
                              )}
                              DTE={data}
                              sello={respuestaMH.data.selloRecibido}
                            />
                          ).toBlob();
                          if (json_blob && blob) {
                            const uploadParams: PutObjectCommandInput = {
                              Bucket: "seedcode-facturacion",
                              Key: json_url,
                              Body: json_blob,
                            };
                            const uploadParamsPDF: PutObjectCommandInput = {
                              Bucket: "seedcode-facturacion",
                              Key: pdf_url,
                              Body: blob,
                            };
                            s3Client
                              .send(new PutObjectCommand(uploadParamsPDF))
                              .then((response) => {
                                if (response.$metadata) {
                                  s3Client
                                    .send(new PutObjectCommand(uploadParams))
                                    .then((response) => {
                                      if (response.$metadata) {
                                        const token = get_token() ?? "";

                                        axios
                                          .put(
                                            API_URL +
                                              "/sales/sale-fiscal-transaction",
                                            {
                                              pdf: pdf_url,
                                              dte: json_url,
                                              cajaId: Number(
                                                localStorage.getItem("box")
                                              ),
                                              codigoEmpleado: 1,
                                              sello: true,
                                            },
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            }
                                          )
                                          .then(() => {
                                            toast.success(
                                              "Se completo con éxito la venta"
                                            );
                                            delete_credito_venta(
                                              data.dteJson.identificacion
                                                .codigoGeneracion
                                            );
                                            modalLoading.onClose();
                                            OnGetSalesNotContigence(
                                              branchId,
                                              1,
                                              5,
                                              dateInitial,
                                              dateEnd
                                            );
                                            setLoading(false);
                                          })
                                          .catch(() => {
                                            toast.error(
                                              "Error al guardar la venta"
                                            );
                                            setLoading(false);
                                            modalLoading.onClose();
                                          });
                                      }
                                    });
                                }
                              });
                          }
                        })
                        .catch(async (error: AxiosError<SendMHFailed>) => {
                          modalLoading.onClose();
                          if (error.response?.data) {
                            await save_logs({
                              title:
                                "Contingencia: " +
                                  error.response.data.descripcionMsg ??
                                "Error al procesar venta",
                              message:
                                error.response.data.observaciones &&
                                error.response.data.observaciones.length > 0
                                  ? error.response?.data.observaciones.join(
                                      "\n\n"
                                    )
                                  : "",
                              generationCode:
                                data.dteJson.identificacion.codigoGeneracion,
                            });
                            setErrorMessage(
                              error.response.data.observaciones &&
                                error.response.data.observaciones.length > 0
                                ? error.response?.data.observaciones.join(
                                    "\n\n"
                                  )
                                : ""
                            );
                            setTitle(
                              error.response.data.descripcionMsg ??
                                "Error al procesar venta"
                            );
                            modalError.onOpen();
                            setLoading(false);
                          }
                        });
                    })
                    .catch(async (error: AxiosError<SendMHFailed>) => {
                      clearTimeout(timeout);
                      modalLoading.onClose();
                      if (axios.isCancel(error)) {
                        setTitle("Tiempo de espera agotado");
                        setErrorMessage(
                          "El tiempo limite de espera ha expirado"
                        );
                        modalErrorContingencia.onOpen();
                        setLoading(false);
                      }

                      if (error.response?.data) {
                        await save_logs({
                          title:
                            "Contingencia: " +
                              error.response.data.descripcionMsg ??
                            "Error al procesar venta",
                          message:
                            error.response.data.observaciones &&
                            error.response.data.observaciones.length > 0
                              ? error.response?.data.observaciones.join("\n\n")
                              : "",
                          generationCode:
                            data.dteJson.identificacion.codigoGeneracion,
                        });
                        setErrorMessage(
                          error.response.data.observaciones &&
                            error.response.data.observaciones.length > 0
                            ? error.response?.data.observaciones.join("\n\n")
                            : ""
                        );
                        setTitle(
                          error.response.data.descripcionMsg ??
                            "Error al procesar venta"
                        );
                        modalErrorContingencia.onOpen();
                        setLoading(false);
                      }
                    });
                } else {
                }
              }
            }
          })
          .catch(() => {
            modalLoading.onClose();
            toast.error("Error al enviar el documento de contingencia");
            modalErrorContingencia.onOpen();
            setTitle("Error al enviar el documento de contingencia");
            setErrorMessage("Error al enviar el documento de contingencia");
          });
      })
      .catch(() => {
        modalLoading.onClose();
        toast.error("Error al firmar el documento de contingencia");
        setTitle("Error al firmar el documento de contingencia");
        setErrorMessage("Error al firmar el documento de contingencia");
      });
  };

  const modalEdit = useDisclosure();

  const generateURLMH = (
    ambiente: string,
    codegen: string,
    fechaEmi: string
  ) => {
    return `${MH_QUERY}?ambiente=${ambiente}&codGen=${codegen}&fechaEmi=${fechaEmi}`;
  };

  const [codigoGeneracion, setCodigoGeneracion] = useState("");
  const [dataCustomer, setDataCustomer] = useState<Customer>();
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="hidden md:grid w-full grid-cols-3 gap-5 mb-5">
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
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary
              }}
              color="primary"
              size="lg"
              className="font-semibold mt-6"
            >
              Buscar
            </Button>
          </div>
          <div className="flex items-center gap-5 md:mb-0 -mb-8">
            <div className="block md:hidden">
              <Drawer.Root
                shouldScaleBackground
                open={openVaul}
                onClose={() => setOpenVaul(false)}
              >
                <Drawer.Trigger asChild>
                  <Button
                    style={global_styles().thirdStyle}
                    size="lg"
                    isIconOnly
                    onClick={() => setOpenVaul(true)}
                    type="button"
                  >
                    <Filter />
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay
                    className="fixed inset-0 bg-black/40 z-[60]"
                    onClick={() => setOpenVaul(false)}
                  />
                  <Drawer.Content
                    className={classNames(
                      "bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0",
                      context === "dark" ? "dark" : ""
                    )}
                  >
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                      <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-400 mb-8" />
                      <Drawer.Title className="mb-4 dark:text-white font-medium">
                        Filtros disponibles
                      </Drawer.Title>

                      <div className="flex flex-col gap-3">
                        <div className="w-full">
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
                            className="mt-6"
                            classNames={{
                              input: "dark:text-white dark:border-gray-600",
                              label: "text-sm font-semibold dark:text-white",
                            }}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            searchSalesNotContigence();
                            setOpenVaul(false);
                          }}
                          style={{
                            backgroundColor: theme.colors.secondary,
                            color: theme.colors.primary,
                          }}
                          className="w-full mb-10 font-semibold"
                          size="lg"
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>
          </div>
          <div className="md:flex md:mb-2  mb-4 grid overflow-hidden justify-end mr-3">
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
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  header="Acciones"
                  body={(rowData) => (
                    <>
                      {rowData.selloInvalidacion === "null" ? (
                        <Button
                          style={global_styles().dangerStyles}
                          size="lg"
                          isIconOnly
                          onClick={() => {
                            setSelectedSale(rowData), modalAnulation.onOpen();
                          }}
                        >
                          <RefreshCwOff size={20} />
                        </Button>
                      ) : (
                        <Button
                          style={{
                            ...global_styles().thirdStyle,
                            pointerEvents: "none",
                          }}
                          size="lg"
                          isIconOnly
                          onClick={() => {
                            setSelectedSale(rowData), modalAnulation.onOpen();
                          }}
                        >
                          <RefreshCwOff size={20} />
                        </Button>
                      )}
                    </>
                  )}
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
                          handleSendToContingencia(rowData);
                        }}
                      >
                        <Send size={20} />
                      </Button>
                      <Button
                        style={global_styles().secondaryStyle}
                        size="lg"
                        isIconOnly
                        onClick={() => {
                          setDataCustomer((prev) => ({
                            ...prev,
                            ...rowData.customer,
                          }));
                          setCodigoGeneracion(rowData.codigoGeneracion);
                          setSelectedSale(rowData);
                          handleVerifyEdit(rowData);
                          modalLoading.onOpen();
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
            defaultSelectedKeys={["2"]}
            value={contingencia}
            onChange={(e) => {
              if (e.target.value) {
                setContingencia(e.target.value);
              }
            }}
          >
            {cat_005_tipo_de_contingencia.map((tCon) => (
              <SelectItem key={tCon.codigo} value={tCon.codigo}>
                {tCon.valores}
              </SelectItem>
            ))}
          </Select>

          {contingencia === "5" && (
            <div className="mt-5">
              <Textarea
                size="lg"
                label="Información adicional"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Ingresa tus observaciones y comentarios"
              ></Textarea>
            </div>
          )}
        </div>
      </ModalGlobal>
      <ModalGlobal
        title="Invalidar venta"
        isOpen={modalAnulation.isOpen}
        size="w-sm"
        onClose={() => {
          modalAnulation.onClose();
        }}
      >
        <SaleInvalidation sale={selectedSale as Sale} />
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
        title="Editar"
        onClose={modalEdit.onClose}
        size="w-full  md:w-[900px]"
        isOpen={modalEdit.isOpen}
      >
        <UpdateCustomerSales
          onClose={modalEdit.onClose}
          codigoGeneracion={codigoGeneracion}
          customer={dataCustomer}
          handleSendToContingencia={handleSendToContingencia}
          selectedSale={selectedSale}
        />
      </ModalGlobal>
      <ModalGlobal
        title={title}
        size="w-full md:w-[600px] lg:w-[700px]"
        isOpen={modalError.isOpen}
        onClose={modalError.onClose}
      >
        <div className="flex flex-col justify-center items-center">
          <ShieldAlert size={75} color="red" />
          <p className="text-lg font-semibold">{errorMessage}</p>
        </div>
        {loading ? (
          <div className="flex justify-center w-full mt-5">
            <LoaderCircle size={50} className=" animate-spin " />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 mt-5"></div>
        )}
      </ModalGlobal>
    </>
  );
}
export default SalesReportContigence;
