import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../store/customers.store";
import { Customer } from "../../types/customers.types";
import { toast } from "sonner";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { generate_factura } from "../../utils/DTE/factura";
import {useTransmitterStore} from "../../store/transmitter.store"
import { useBranchProductStore } from "../../store/branch_product.store";
function FormMakeSale() {
  const [Customer, setCustomer] = useState<Customer>();
  const {
    cart_products
  } = useBranchProductStore();
  const [tipeDocument, setTipeDocument] = useState<ITipoDocumento>();
  const [tipePayment, setTipePayment] = useState<IFormasDePago>();

  const {
    metodos_de_pago,
    getCat017FormasDePago,
    getCat02TipoDeDocumento,
    tipos_de_documento,
    OnSignInvoiceDocument
  } = useBillingStore();
const {gettransmitter, transmitter} = useTransmitterStore()
  const { getCustomersList, customer_list } = useCustomerStore();

  useEffect(() => {
    getCat017FormasDePago();
    getCat02TipoDeDocumento();
    getCustomersList();
    gettransmitter()
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

    const generate = generate_factura(transmitter, 1, tipeDocument, Customer, cart_products, tipePayment)
    OnSignInvoiceDocument(generate, generate.dteJson.resumen.subTotal)

    const json_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${generate.dteJson.identificacion.codigoGeneracion}.json`;
    const pdf_url = `CLIENTES/${transmitter.nombre}/VENTAS/FACTURAS/${DTE.dteJson.identificacion.codigoGeneracion}.pdf`;

    const JSON_DTE = JSON.stringify(generate.dteJson, null, 2);
    const json_blob = new Blob([JSON_DTE], { type: "application/json" });

    const blob = await pdf(<Invoice DTE={DTE} />).toBlob();

    if (blob && json_blob) {
      const uploadParams: PutObjectCommandInput = {
        Bucket: "imexca",
        Key: json_url,
        Body: json_blob,
      };
      const uploadParamsPDF: PutObjectCommandInput = {
        Bucket: "imexca",
        Key: pdf_url,
        Body: blob,
      };
      s3Client
        .send(new PutObjectCommand(uploadParamsPDF))
        .then((response) => {
          if (response.$metadata) {
            s3Client
              .send(new PutObjectCommand(uploadParams))
              .then((result) => {
                if (result.$metadata) {
                  OnSaveVentas({
                    dte: json_url,
                    pdf: pdf_url,
                    codigoEmpleado: 1,
                    cajaId: 3,
                  })
                    .then(() => {
                      setLoading(false); // Ocultar mensaje de espera
                      // Si todo está correcto, mostrar mensaje de éxito
                      ShowToast("success", "Venta realizada con éxito");

                      // Abrir el modal de confirmación
                      handleOpenModal();
                    })
                    .catch(() => {});
                }
              })
              .catch(() => {
                toast.error("Error al subir el archivo");
              });
          }
        })
        .catch(() => {
          toast.error("Error al subir el archivo");
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
            const tipePaymentSelected = JSON.parse(key as string) as IFormasDePago;
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
            const tipeDocumentSelected = JSON.parse(key as string) as ITipoDocumento;
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
