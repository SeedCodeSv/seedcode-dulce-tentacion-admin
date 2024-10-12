import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Customer } from "../../types/customers.types";
import { toast } from "sonner";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { generate_credito_fiscal } from "../../utils/DTE/credito_fiscal";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBranchProductStore } from "../../store/branch_product.store";
import {
  check_dte,
  firmarDocumentoFiscal,
  send_to_mh,
} from "../../services/DTE.service";
import { TipoTributo } from "../../types/DTE/tipo_tributo.types";
import { get_token, return_mh_token } from "../../storage/localStorage";
import { PayloadMH } from "../../types/DTE/credito_fiscal.types";
import axios, { AxiosError } from "axios";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../../plugins/s3";
import { SendMHFailed } from "../../types/transmitter.types";
import { API_URL } from "../../utils/constants";
import { useCorrelativesDteStore } from "../../store/correlatives_dte.store";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import { ICheckResponse } from "../../types/DTE/check.types";
import { useContingenciaCreditoStore } from "../../plugins/dexie/store/contingencia_credito.store";
import { formatDate } from "../../utils/dates";
import { save_logs } from "../../services/logs.service";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { pdf } from "@react-pdf/renderer";
import Template1CCF from "../../pages/invoices/Template1CCF";
import { SVFE_CF_SEND } from "../../types/svf_dte/cf.types";
import HeadlessModal from "../global/HeadlessModal";

interface Pagos {
  codigo: string;
  plazo: string;
  periodo: number;
  monto: number;
}

interface Props {
  clear: () => void;
  Customer?: Customer;
  tipePayment: Pagos[];
  tipeDocument?: ITipoDocumento;
  tipeTribute?: TipoTributo;
  condition: string;
}

function CreditoFiscal(props: Props) {
  const { condition, tipePayment } = props;

  const { cart_products } = useBranchProductStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");
  const [currentDTE, setCurrentDTE] = useState<SVFE_CF_SEND>();
  const [loading, setLoading] = useState(false);

  const modalError = useDisclosure();
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { GetConfiguration } = useConfigurationStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  useEffect(() => {
    gettransmitter();
  }, []);

  const total = cart_products
    .map((a) => Number(a.price) * a.quantity)
    .reduce((a, b) => a + b, 0);

  const generateFactura = async () => {
    GetConfiguration(transmitter.id);

    if (condition === "") {
      toast.error("Debes seleccionar una condición");
      return;
    }

    const tipo_pago = tipePayment.filter((type) => {
      if (condition === "1") {
        if (type.codigo !== "") {
          if (type.monto > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        if (type.monto > 0 && type.periodo > 0 && type.plazo !== "") {
          return true;
        } else {
          return false;
        }
      }
    });

    const total_filteres = tipo_pago
      .map((a) => a.monto)
      .reduce((a, b) => a + b, 0);

    if (total_filteres !== total) {
      toast.error(
        "Los montos de las formas de pago no coinciden con el total de la compra"
      );
      return;
    }

    if (tipo_pago.length === 0) {
      toast.error("Debes agregar al menos una forma de pago");
      return;
    }

    if (!props.tipeDocument) {
      toast.info("Debes seleccionar el tipo de documento");

      return;
    }
    if (!props.Customer) {
      toast.info("Debes seleccionar el cliente");
      return;
    }
    if (!props.tipeTribute) {
      toast.info("Debes seleccionar el tipo de tributo");
      return;
    }
    const correlatives = await getCorrelativesByDte(transmitter.id, "03");
    if (!correlatives) {
      toast.error("No se encontraron correlativos");
      return;
    }
    if (
      props.Customer.nit === "N/A" ||
      props.Customer.nrc === "N/A" ||
      props.Customer.codActividad === "N/A" ||
      props.Customer.descActividad === "N/A" ||
      props.Customer.correo === "N/A"
    ) {
      return;
    }
    const receptor = {
      nit: props.Customer!.nit,
      nrc: props.Customer!.nrc,
      nombre: props.Customer!.nombre,
      codActividad: props.Customer!.codActividad,
      descActividad: props.Customer!.descActividad,
      nombreComercial:
        props.Customer!.nombreComercial === "N/A"
          ? null
          : props.Customer!.nombreComercial,
      direccion: {
        departamento: props.Customer.direccion.departamento!,
        municipio: props.Customer.direccion.municipio!,
        complemento: props.Customer.direccion.complemento!,
      },
      telefono:
        props.Customer!.telefono === "N/A" ? null : props.Customer!.telefono,
      correo: props.Customer!.correo,
    };
    const generate = generate_credito_fiscal(
      transmitter,
      props.tipeDocument,
      Number(correlatives!.next),
      receptor,
      cart_products,
      props.tipePayment,
      props.tipeTribute
    );
    setCurrentDTE(generate);
    setLoading(true);
    toast.info("Estamos firmado tu documento");
    firmarDocumentoFiscal(generate)
      .then(async (firmador) => {
        const token_mh = await return_mh_token();
        if (firmador.data.body) {
          const data_send: PayloadMH = {
            ambiente: "00",
            idEnvio: 1,
            version: 3,
            tipoDte: "03",
            documento: firmador.data.body,
          };

          toast.info("Se ah enviado a hacienda, esperando respuesta");
          if (token_mh) {
            const source = axios.CancelToken.source();
            const timeout = setTimeout(() => {
              source.cancel("El tiempo de espera ha expirado");
            }, 20000);
            send_to_mh(data_send, token_mh!, source)
              .then(async ({ data }) => {
                if (data.selloRecibido) {
                  clearTimeout(timeout);
                  toast.success("Hacienda respondió correctamente", {
                    description: "Estamos guardando tus datos",
                  });
                  const DTE_FORMED = {
                    ...generate.dteJson,
                    respuestaMH: data,
                    firma: firmador.data.body,
                  };
                  const json_url = `CLIENTES/${
                    transmitter.nombre
                  }/${new Date().getFullYear()}/VENTAS/CRÉDITO_FISCAL/${formatDate()}/${
                    generate.dteJson.identificacion.codigoGeneracion
                  }/${generate.dteJson.identificacion.codigoGeneracion}.json`;
                  const pdf_url = `CLIENTES/${
                    transmitter.nombre
                  }/${new Date().getFullYear()}/VENTAS/CRÉDITO_FISCAL/${formatDate()}/${
                    generate.dteJson.identificacion.codigoGeneracion
                  }/${generate.dteJson.identificacion.codigoGeneracion}.pdf`;

                  const JSON_DTE = JSON.stringify(
                    {
                      ...DTE_FORMED,
                    },
                    null,
                    2
                  );
                  const json_blob = new Blob([JSON_DTE], {
                    type: "application/json",
                  });

                  const blob = await pdf(
                    <Template1CCF dte={DTE_FORMED} />
                  ).toBlob();

                  if (blob) {
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
                                  .post(
                                    API_URL + "/sales/credit-transaction",
                                    {
                                      pdf: pdf_url,
                                      dte: json_url,
                                      clienteId: Number(props.Customer?.id),
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
                                    props.clear();
                                    setLoading(false);
                                  })
                                  .catch(() => {
                                    toast.error("Error al guardar la venta");
                                    setLoading(false);
                                  });
                              }
                            })
                            .catch(() => {
                              toast.error("Error al guardar el pdf");
                              setLoading(false);
                            });
                        }
                      })
                      .catch(() => {
                        toast.error("Error al guardar el pdf");
                        setLoading(false);
                      });
                  } else {
                    setLoading(false);
                    toast.error("No se pudo generar el pdf");
                  }
                }
              })
              .catch(async (error: AxiosError<SendMHFailed>) => {
                clearTimeout(timeout);
                if (axios.isCancel(error)) {
                  setTitle("Tiempo de espera agotado");
                  setErrorMessage("El tiempo limite de espera ha expirado");
                  modalError.onOpen();
                  setLoading(false);
                }
                modalError.onOpen();
                setLoading(false);

                if (error.response?.data) {
                  setErrorMessage(
                    error.response.data.observaciones &&
                      error.response.data.observaciones.length > 0
                      ? error.response?.data.observaciones.join("\n\n")
                      : ""
                  );
                  setTitle(
                    error.response?.data.descripcionMsg ??
                      "Error al procesar venta"
                  );
                  await save_logs({
                    title:
                      error.response.data.descripcionMsg ??
                      "Error al procesar venta",
                    message:
                      error.response.data.observaciones &&
                      error.response.data.observaciones.length > 0
                        ? error.response?.data.observaciones.join("\n\n")
                        : error.response.data.descripcionMsg,
                    generationCode:
                      generate.dteJson.identificacion.codigoGeneracion,
                      table: ''
                  });
                }
              });
          } else {
            modalError.onOpen();
            setLoading(false);
            setErrorMessage("No se ha podido obtener el token de hacienda");
            return;
          }
        } else {
          modalError.onOpen();
          setLoading(false);
          setTitle("Error en el firmador");
          setErrorMessage("Error al firmar el documento");
          return;
        }
      })
      .catch(() => {
        modalError.onOpen();
        setLoading(false);
        setTitle("Error en el firmador");
        setErrorMessage("Error al firmar el documento");
      });
  };
  const { createContingenciaCredito } = useContingenciaCreditoStore();
  const sendToContingencia = () => {
    setLoading(true);
    modalError.onClose();
    if (currentDTE) {
      createContingenciaCredito(currentDTE);
      const json_url = `CLIENTES/${
        transmitter.nombre
      }/${new Date().getFullYear()}/VENTAS/CRÉDITO_FISCAL/${formatDate()}/${
        currentDTE.dteJson.identificacion.codigoGeneracion
      }/${currentDTE.dteJson.identificacion.codigoGeneracion}.json`;

      const JSON_DTE = JSON.stringify(currentDTE.dteJson, null, 2);
      const json_blob = new Blob([JSON_DTE], {
        type: "application/json",
      });

      const uploadParams: PutObjectCommandInput = {
        Bucket: "seedcode-facturacion",
        Key: json_url,
        Body: json_blob,
      };

      s3Client
        .send(new PutObjectCommand(uploadParams))
        .then((response) => {
          if (response.$metadata) {
            const token = get_token() ?? "";
            axios
              .post(
                API_URL + "/sales/credit-transaction",
                {
                  dte: json_url,
                  cajaId: Number(localStorage.getItem("box")),
                  codigoEmpleado: 1,
                  sello: false,
                  clienteId: props.Customer?.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                toast.success("Se envió el credito fiscal a contingencia");
                props.clear();
                setLoading(false);
              })
              .catch(() => {
                toast.error("Error al guardar tu credito fiscal");
                setLoading(false);
              });
          }
        })
        .catch(() => {
          toast.error("Error al subir el credito fiscal a contingencia");
          setLoading(false);
        });
    }
  };
  const handleVerify = () => {
    setLoading(true);

    const payload = {
      nitEmisor: transmitter.nit,
      tdte: currentDTE?.dteJson.identificacion.tipoDte ?? "03",
      codigoGeneracion:
        currentDTE?.dteJson.identificacion.codigoGeneracion ?? "",
    };

    const token_mh = return_mh_token();

    check_dte(payload, token_mh ?? "")
      .then((response) => {
        toast.success(response.data.estado, {
          description: `Sello recibido: ${response.data.selloRecibido}`,
        });
        setLoading(false);
      })
      .catch((error: AxiosError<ICheckResponse>) => {
        if (error.status === 500) {
          toast.error("NO ENCONTRADO", {
            description: "DTE no encontrado en hacienda",
          });
          setLoading(false);
          return;
        }

        toast.error("ERROR", {
          description: `Error: ${
            error.response?.data.descripcionMsg ??
            "DTE no encontrado en hacienda"
          }`,
        });
        setLoading(false);
      });
  };
  return (
    <div>
      <div className="flex justify-center mt-4 mb-4 w-full">
        <div className="w-full flex  justify-center">
          {loading ? (
            <LoaderCircle size={50} className=" animate-spin " />
          ) : (
            <Button
              style={global_styles().secondaryStyle}
              onClick={() => generateFactura()}
              className="w-full"
            >
              Generar Crédito fiscal
            </Button>
          )}
        </div>
      </div>
      <HeadlessModal
        title={title}
        size="w-full md:w-[600px] lg:w-[700px]"
        isOpen={modalError.isOpen}
        onClose={modalError.onClose}
      >
        <div className="p-5">
          <div className="flex flex-col justify-center items-center">
            <ShieldAlert size={75} color="red" />
            <p className="text-lg font-semibold">{errorMessage}</p>
          </div>
          {loading ? (
            <div className="flex justify-center w-full mt-5">
              <LoaderCircle size={50} className=" animate-spin " />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5 mt-5">
              <Button
                onClick={() => {
                  modalError.onClose();
                  generateFactura();
                }}
                style={global_styles().secondaryStyle}
              >
                Re-intentar
              </Button>
              <Button
                onClick={handleVerify}
                style={global_styles().warningStyles}
              >
                Verificar
              </Button>
              <Button
                onClick={sendToContingencia}
                style={global_styles().dangerStyles}
              >
                Enviar a contingencia
              </Button>
            </div>
          )}
        </div>
      </HeadlessModal>
    </div>
  );
}

export default CreditoFiscal;
