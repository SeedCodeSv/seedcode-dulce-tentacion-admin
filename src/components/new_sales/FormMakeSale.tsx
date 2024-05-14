import {
  Autocomplete,
  AutocompleteItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../store/customers.store";
import { Customer } from "../../types/customers.types";
import { toast } from "sonner";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { generate_factura } from "../../utils/DTE/factura";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBranchProductStore } from "../../store/branch_product.store";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { pdf } from "@react-pdf/renderer";
import { s3Client } from "../../plugins/s3";
import { useCorrelativesDteStore } from "../../store/correlatives_dte.store";
import { firmarDocumentoFactura, send_to_mh } from "../../services/DTE.service";
import ModalGlobal from "../global/ModalGlobal";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import { get_token, return_mh_token } from "../../storage/localStorage";
import { DteJson, PayloadMH } from "../../types/DTE/DTE.types";
import { ambiente, API_URL } from "../../utils/constants";
import axios, { AxiosError } from "axios";
import { SendMHFailed } from "../../types/transmitter.types";
import { Invoice } from "../../pages/Invoice";

function FormMakeSale() {
  const [Customer, setCustomer] = useState<Customer>();
  const { cart_products } = useBranchProductStore();
  const [tipeDocument, setTipeDocument] = useState<ITipoDocumento>();
  const [tipePayment, setTipePayment] = useState<IFormasDePago>();

  const [currentDTE, setCurrentDTE] = useState<DteJson>();

  const {
    metodos_de_pago,
    getCat017FormasDePago,
    getCat02TipoDeDocumento,
    tipos_de_documento,
  } = useBillingStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCustomersList, customer_list } = useCustomerStore();

  useEffect(() => {
    getCat017FormasDePago();
    getCat02TipoDeDocumento();
    getCustomersList();
    gettransmitter();
  }, []);

  const modalError = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { getCorrelativesByDte } = useCorrelativesDteStore();

  const generateFactura = async () => {
    // setLoading(true); // Mostrar mensaje de espera
    if (!tipePayment) {
      toast.info("Debes seleccionar el método de pago");

      return;
    }
    if (!tipeDocument) {
      toast.info("Debes seleccionar el tipo de documento");

      return;
    }
    if (!Customer) {
      toast.info("Debes seleccionar el cliente");
      return;
    }

    const correlatives = await getCorrelativesByDte(transmitter.id, "01");

    if (!correlatives) {
      toast.error("No se encontraron correlativos");
      return;
    }

    const generate = generate_factura(
      transmitter,
      Number(correlatives!.siguiente),
      tipeDocument,
      Customer,
      cart_products,
      tipePayment
    );

    setCurrentDTE(generate);
    setLoading(true);

    toast.info("Estamos firmado tu documento");

    firmarDocumentoFactura(generate)
      .then(async (firma) => {
        const token_mh = await return_mh_token();
        if (firma.data.body) {
          const data_send: PayloadMH = {
            ambiente: ambiente,
            idEnvio: 1,
            version: 1,
            tipoDte: "01",
            documento: firma.data.body,
          };
          toast.info("Se ah enviado a hacienda, esperando respuesta");

          if (token_mh) {
            send_to_mh(data_send, token_mh)
              .then(async ({ data }) => {
                if (data.selloRecibido) {
                  toast.success("Hacienda respondió correctamente", {
                    description: "Estamos guardando tus datos",
                  });

                  const json_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${generate.dteJson.identificacion.codigoGeneracion}.json`;
                  const pdf_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${generate.dteJson.identificacion.codigoGeneracion}.pdf`;

                  const JSON_DTE = JSON.stringify(
                    {
                      ...generate.dteJson,
                      respuestaMH: data,
                      firma: firma.data.body,
                    },
                    null,
                    2
                  );
                  const json_blob = new Blob([JSON_DTE], {
                    type: "application/json",
                  });

                  const blob = await pdf(
                    <Invoice DTE={generate} sello={data.selloRecibido} />
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
                                    API_URL + "/sales/factura-sale",
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
                API_URL + "/sales/factura-sale",
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

  return (
    <div>
      <Autocomplete
        onSelectionChange={(key) => {
          if (key) {
            const customerSelected = JSON.parse(key as string) as Customer;
            setCustomer(customerSelected);
          }
        }}
        variant="bordered"
        label="Cliente"
        labelPlacement="outside"
        placeholder="Selecciona el cliente"
        size="lg"
      >
        {customer_list.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)} value={item.nombre}>
            {item.nombre}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        onSelectionChange={(key) => {
          if (key) {
            const tipePaymentSelected = JSON.parse(
              key as string
            ) as IFormasDePago;
            setTipePayment(tipePaymentSelected);
          }
        }}
        className="pt-5"
        variant="bordered"
        label="Método de pago"
        labelPlacement="outside"
        placeholder="Selecciona el método de pago"
        size="lg"
      >
        {metodos_de_pago.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)} value={item.codigo}>
            {item.valores}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        onSelectionChange={(key) => {
          if (key) {
            const tipeDocumentSelected = JSON.parse(
              key as string
            ) as ITipoDocumento;
            setTipeDocument(tipeDocumentSelected);
          }
        }}
        className="pt-5"
        variant="bordered"
        label="Tipo de documento a emitir"
        labelPlacement="outside"
        placeholder="Selecciona el tipo de documento"
        size="lg"
      >
        {tipos_de_documento.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)} value={item.codigo}>
            {item.valores}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex justify-center mt-4 mb-4 w-full">
        <div className="w-full flex  justify-center">
          {loading ? (
            <LoaderCircle size={50} className=" animate-spin " />
          ) : (
            <Button
              style={global_styles().secondaryStyle}
              className="w-full"
              size="lg"
              onClick={generateFactura}
            >
              Generar Factura
            </Button>
          )}
        </div>
      </div>
      <ModalGlobal
        title={title}
        size="w-full md:w-[600px]"
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
          <div className="grid grid-cols-2 gap-5 mt-5">
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

export default FormMakeSale;
