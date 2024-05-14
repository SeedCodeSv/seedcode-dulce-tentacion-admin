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
import { generate_credito_fiscal } from "../../utils/DTE/credito_fiscal";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBranchProductStore } from "../../store/branch_product.store";
import { firmarDocumentoFiscal, send_to_mh } from "../../services/DTE.service";
import { TipoTributo } from "../../types/DTE/tipo_tributo.types";
import { return_mh_token } from "../../storage/localStorage";
import { PayloadMH } from "../../types/DTE/credito_fiscal.types";
import axios, { AxiosError } from "axios";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../../plugins/s3";
import { SendMHFailed } from "../../types/transmitter.types";
import { Invoice } from "../../pages/Invoice";
import { pdf } from "@react-pdf/renderer";
import { API_URL } from "../../utils/constants";
import { useCorrelativesDteStore } from "../../store/correlatives_dte.store";
import ModalGlobal from "../global/ModalGlobal";
import { ShieldAlert } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import CreditoFiscal from "./CreditoFiscal";

function FormMakeSale() {
  const [Customer, setCustomer] = useState<Customer>();
  const { cart_products } = useBranchProductStore();
  const [tipeDocument, setTipeDocument] = useState<ITipoDocumento>();
  const [tipePayment, setTipePayment] = useState<IFormasDePago>();
  const [tipeTribute, setTipeTribute] = useState<TipoTributo>();
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");
  const modalError = useDisclosure();
  const {
    metodos_de_pago,
    getCat017FormasDePago,
    getCat02TipoDeDocumento,
    tipos_de_documento,
    OnGetTiposTributos,
    tipos_tributo,
  } = useBillingStore();
  const { getCorrelativesByDte } = useCorrelativesDteStore();

  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCustomersList, customer_list } = useCustomerStore();

  useEffect(() => {
    getCat017FormasDePago();
    getCat02TipoDeDocumento();
    getCustomersList();
    gettransmitter();
    OnGetTiposTributos();
  }, []);
 
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
    if (!tipeTribute) {
      toast.info("Debes seleccionar el tipo de tributo");
      return;
    }
    const correlatives = await getCorrelativesByDte(transmitter.id, "03");
    if (!correlatives) {
      toast.error("No se encontraron correlativos");
      return;
    }
    if (
      Customer.nit === "N/A" ||
      Customer.nrc === "N/A" ||
      Customer.codActividad === "N/A" ||
      Customer.descActividad === "N/A" ||
      Customer.correo === "N/A"
    ) {
      return;
    }
    const receptor = {
      nit: Customer!.nit,
      nrc: Customer!.nrc,
      nombre: Customer!.nombre,
      codActividad: Customer!.codActividad,
      descActividad: Customer!.descActividad,
      nombreComercial:
        Customer!.nombreComercial === "N/A" ? null : Customer!.nombreComercial,
      direccion: {
        departamento: Customer?.direccion?.departamento!,
        municipio: Customer?.direccion?.municipio!,
        complemento: Customer?.direccion?.complemento!,
      },
      telefono: Customer!.telefono === "N/A" ? null : Customer!.telefono,
      correo: Customer!.correo,
    };
    const generate = generate_credito_fiscal(
      transmitter,
      tipeDocument,
      Number(correlatives!.siguiente),
      receptor,
      cart_products,
      tipeTribute,
      tipePayment
    );
    console.log(generate)
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
          send_to_mh(data_send, token_mh!)
            .then(async ({ data }) => {
              if (data.selloRecibido) {
                const json_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${generate.dteJson.identificacion.codigoGeneracion}.json`;
                const pdf_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${generate.dteJson.identificacion.codigoGeneracion}.pdf`;

                const JSON_DTE = JSON.stringify(generate.dteJson, null, 2);
                const json_blob = new Blob([JSON_DTE], {
                  type: "application/json",
                });

                const blob = await pdf(
                  <Invoice DTE={generate} sello={data.selloRecibido} />
                ).toBlob();

                if (json_blob && blob) {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.download = "filename.pdf";
                  link.href = url;
                  link.click();

                  const url2 = URL.createObjectURL(json_blob);
                  const link2 = document.createElement("a");
                  link2.download = "filename.json";
                  link2.href = url2;
                  link2.click();

                  const uploadParams: PutObjectCommandInput = {
                    Bucket: "seedcode-sv",
                    Key: json_url,
                    Body: json_blob,
                  };
                  const uploadParamsPDF: PutObjectCommandInput = {
                    Bucket: "seedcode-sv",
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
                              axios
                                .post(API_URL + "/sales/credit-transaction", {
                                  pdf: pdf_url,
                                  dte: json_url,
                                  cajaId: Number(localStorage.getItem("box")),
                                  codigoEmpleado: 1,
                                  sello: data.selloRecibido,
                                })
                                .then(() => {
                                  toast.success(
                                    "Se completo con exito la venta"
                                  );
                                })
                                .catch(() => {
                                  toast.error("Error al guardar la venta");
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
              } else {
                if (error.response?.data) {
                  setErrorMessage(
                    "No se ha podido obtener el token de hacienda"
                  );
                  setErrorMessage("Error al firmar el documento");
                  modalError.onOpen();
                  return;
                } else {
                  // ToastAndroid.show(
                  //   "No tienes los accesos necesarios",
                  //   ToastAndroid.SHORT
                  // );
                  // setLoadingSave(false);
                }
              }
            });
        } else {
          // ToastAndroid.show(
          //   "No se encontró la firma necesaria",
          //   ToastAndroid.SHORT
          // );
          // setLoadingSave(false);
        }
      })
      .catch(() => {
        // Alert.alert(
        //   "Error al firmar el documento",
        //   "Intenta firmar el documento mas tarde o contacta al equipo de soporte"
        // );
        // setLoadingSave(false);
      });
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
      <Autocomplete
        onSelectionChange={(key) => {
          if (key) {
            const tipeTributeSelected = JSON.parse(
              key as string
            ) as TipoTributo;
            setTipeTribute(tipeTributeSelected);
          }
        }}
        className="pt-5"
        variant="bordered"
        label="Tipo de tributo"
        labelPlacement="outside"
        placeholder="Selecciona el tipo de tributo"
        size="lg"
      >
        {tipos_tributo.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)} value={item.codigo}>
            {item.valores}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex justify-center mt-4 mb-4 w-full">
        <div className="w-full">
          <Button
            style={global_styles().secondaryStyle}
            onClick={() => generateFactura()}
            size="lg"
            className="w-full"
          >
            Completar
          </Button>
        </div>
      </div>
      <ModalGlobal
        title={title}
        size="w-full md:w-[500px]"
        isOpen={modalError.isOpen}
        onClose={modalError.onClose}
      >
        <div className="flex flex-col justify-center items-center">
          <ShieldAlert size={75} color="red" />
          <p className="text-lg font-semibold">{errorMessage}</p>
        </div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          <Button
            onClick={() => {
              modalError.onClose();
              generateFactura();
            }}
            style={global_styles().secondaryStyle}
          >
            Re-intentar
          </Button>
          <Button style={global_styles().dangerStyles}>
            Enviar a contingencia
          </Button>
        </div>
      </ModalGlobal>
    </div>
  );
}

export default FormMakeSale;
