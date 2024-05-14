import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Customer } from "../../types/customers.types";
import { toast } from "sonner";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { generate_credito_fiscal } from "../../utils/DTE/credito_fiscal";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBranchProductStore } from "../../store/branch_product.store";
import { check_dte, firmarDocumentoFiscal, send_to_mh } from "../../services/DTE.service";
import { TipoTributo } from "../../types/DTE/tipo_tributo.types";
import { get_token, return_mh_token } from "../../storage/localStorage";
import { PayloadMH } from "../../types/DTE/credito_fiscal.types";
import axios, { AxiosError } from "axios";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../../plugins/s3";
import { SendMHFailed } from "../../types/transmitter.types";
import { Invoice } from "../../pages/Invoice";
import { pdf } from "@react-pdf/renderer";
import { API_URL, MH_QUERY, ambiente } from "../../utils/constants";
import { useCorrelativesDteStore } from "../../store/correlatives_dte.store";
import ModalGlobal from "../global/ModalGlobal";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import { DteJson } from "../../types/DTE/DTE.types";
import { ICheckResponse } from "../../types/DTE/check.types";

interface Props {
  clear: () => void;
  Customer?: Customer;
  tipePayment?: IFormasDePago;
  tipeDocument?: ITipoDocumento;
  tipeTribute?: TipoTributo;
}

function CreditoFiscal(props: Props) {
  const { cart_products } = useBranchProductStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");
  const [currentDTE, setCurrentDTE] = useState<DteJson>();
  const [loading, setLoading] = useState(false);

  const modalError = useDisclosure();
  const { getCorrelativesByDte } = useCorrelativesDteStore();

  const { gettransmitter, transmitter } = useTransmitterStore();
  const generateURLMH = (
    ambiente: string,
    codegen: string,
    fechaEmi: string
  ) => {
    return `${MH_QUERY}?ambiente=${ambiente}&codGen=${codegen}&fechaEmi=${fechaEmi}`;
  };
  useEffect(() => {
    gettransmitter();
  }, []);

  const generateFactura = async () => {
    // setLoading(true); // Mostrar mensaje de espera
    if (!props.tipePayment) {
      toast.info("Debes seleccionar el método de pago");

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
        departamento: props.Customer?.direccion?.departamento!,
        municipio: props.Customer?.direccion?.municipio!,
        complemento: props.Customer?.direccion?.complemento!,
      },
      telefono:
        props.Customer!.telefono === "N/A" ? null : props.Customer!.telefono,
      correo: props.Customer!.correo,
    };
    const generate = generate_credito_fiscal(
      transmitter,
      props.tipeDocument,
      Number(correlatives!.siguiente),
      receptor,
      cart_products,
      props.tipeTribute,
      props.tipePayment
    );
    console.log(generate);
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
            }, 25000);
            send_to_mh(data_send, token_mh!, source)
              .then(async ({ data }) => {
                if (data.selloRecibido) {
                  clearTimeout(timeout);
                  toast.success("Hacienda respondió correctamente", {
                    description: "Estamos guardando tus datos",
                  });
                  const json_url = `CLIENTES/${transmitter.nombre}/VENTAS/CRÉDITO_FISCAL/${generate.dteJson.identificacion.codigoGeneracion}.json`;
                  const pdf_url = `CLIENTES/${transmitter.nombre}/VENTAS/CRÉDITO_FISCAL/${generate.dteJson.identificacion.codigoGeneracion}.pdf`;

                  const JSON_DTE = JSON.stringify(
                    {
                      ...generate.dteJson,
                      respuestaMH: data,
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
                        generate.dteJson.identificacion.codigoGeneracion,
                        generate.dteJson.identificacion.fecEmi
                      )}
                      DTE={generate}
                      sello={data.selloRecibido}
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
                                  .post(
                                    API_URL + "/sales/credit-transaction",
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
                                    props.clear();
                                    setLoading(false);
                                  })
                                  .catch(() => {
                                    toast.error("Error al guardar la venta");
                                    setLoading(false);
                                  });
                              }
                            });
                        }
                      });
                  }
                }
              })
              .catch((error: AxiosError<SendMHFailed>) => {
                if (error.response?.data) {
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
                  modalError.onOpen();
                  setLoading(false);
                }
              });
          } else {
            setErrorMessage("No se ha podido obtener el token de hacienda");
            modalError.onOpen();
            setLoading(false);
            return;
          }
        } else {
          setTitle("Error en el firmador");
          setErrorMessage("Error al firmar el documento");
          modalError.onOpen();
          setLoading(false);
          return;
        }
      })
      .catch(() => {
        setTitle("Error en el firmador");
        setErrorMessage("Error al firmar el documento");
        modalError.onOpen();
        setLoading(false);
      });
  };
  const sendToContingencia = () => {
    setLoading(true);
    modalError.onClose();
    if (currentDTE) {
      const json_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${currentDTE.dteJson.identificacion.codigoGeneracion}.json`;

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
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                toast.success("Se envió la factura a contingencia");
                props.clear();
                setLoading(false);
              })
              .catch(() => {
                toast.error("Error al guardar tu factura");
                setLoading(false);
              });
          }
        })
        .catch(() => {
          toast.error("Error al subir la factura a contingencia");
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
              size="lg"
              className="w-full"
            >
              Generar Crédito fiscal
            </Button>
          )}
        </div>
      </div>
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
          <div className="grid grid-cols-3 gap-5 mt-5">
            <Button
              onClick={() => {
                modalError.onClose();
                generateFactura();
              }}
              style={global_styles().secondaryStyle}
              size="lg"
            >
              Re-intentar
            </Button>
            <Button
              onClick={handleVerify}
              style={global_styles().warningStyles}
              size="lg"
            >
              Verificar
            </Button>
            <Button
              onClick={sendToContingencia}
              style={global_styles().dangerStyles}
              size="lg"
            >
              Enviar a contingencia
            </Button>
          </div>
        )}
      </ModalGlobal>
    </div>
  );
}

export default CreditoFiscal;
