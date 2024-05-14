import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../store/customers.store";
import { Customer } from "../../types/customers.types";
import { toast } from "sonner";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { generate_credito_fiscal, make_to_pdf_fiscal } from "../../utils/DTE/credito_fiscal";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBranchProductStore } from "../../store/branch_product.store";
import { firmarDocumentoFiscal, send_to_mh } from "../../services/DTE.service";
import { TipoTributo } from "../../types/DTE/tipo_tributo.types";
import { return_mh_token } from "../../storage/localStorage";
import { DTEToPDFFiscal, PayloadMH } from "../../types/DTE/credito_fiscal.types";
import { AxiosError } from "axios";
import { SendMHFailed } from "../../types/transmitter.types";
function FormMakeSale() {
  const [Customer, setCustomer] = useState<Customer>();
  const { cart_products } = useBranchProductStore();
  const [tipeDocument, setTipeDocument] = useState<ITipoDocumento>();
  const [tipePayment, setTipePayment] = useState<IFormasDePago>();
  const [tipeTribute, setTipeTribute] = useState<TipoTributo>();

  const {
    metodos_de_pago,
    getCat017FormasDePago,
    getCat02TipoDeDocumento,
    tipos_de_documento,
    OnGetTiposTributos,
    tipos_tributo
  } = useBillingStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCustomersList, customer_list } = useCustomerStore();

  useEffect(() => {
    getCat017FormasDePago();
    getCat02TipoDeDocumento();
    getCustomersList();
    gettransmitter();
    OnGetTiposTributos()
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
        departamento: Customer.direccion!.departamento,
        municipio: Customer.direccion!.municipio,
        complemento: Customer.direccion!.complemento,
      },
      telefono: Customer!.telefono === "N/A" ? null : Customer!.telefono,
      correo: Customer!.correo,
    }; 
    const generate = generate_credito_fiscal(
      transmitter,
      tipeDocument,
      1,
      receptor,
      cart_products,
      tipeTribute,
      tipePayment,
    );
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
              // const data_pdf: DTEToPDFFiscal = make_to_pdf_fiscal(
              //   PayloadMH,
              //   total,
              //   data
              // );
              toast.info("El DTE ah sido validado por hacienda");
              //guardar factura
              // await generate_fiscal(
              //   data_pdf,
              //   generation,
              //   data,
              //   firmador.data.body
              // );
            })
            .catch((error: AxiosError<SendMHFailed>) => {
              if (error.response?.status === 401) {
                // ToastAndroid.show(
                //   "No tienes los accesos necesarios",
                //   ToastAndroid.SHORT
                // );
                toast.error("No tienes los accesos necesarios");
                // setLoadingSave(false);
              } else {
                if (error.response?.data) {
                  // Alert.alert(
                  //   error.response?.data.descripcionMsg,
                  //   error.response.data.observaciones &&
                  //     error.response.data.observaciones.length > 0
                  //     ? error.response?.data.observaciones.join("\n\n")
                  //     : ""
                  // );
                  // setLoadingSave(false);
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
      <div className="flex justify-center mt-4 mb-4">
        <div className="mr-4">
          <button
            onClick={() => generateFactura()}
            className="flex items-center p-2 px-2 rounded-md bg-[#02382A] text-white"
          >
            Completar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormMakeSale;
