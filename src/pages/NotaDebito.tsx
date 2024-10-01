import { useParams } from "react-router";
import Layout from "../layout/Layout";
import { useSalesStore } from "../store/sales.store";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../hooks/useTheme";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { formatCurrency } from "../utils/dte";
import { calculateDiscountedTotal } from "../utils/filters";
import { toast } from "sonner";
import { useCorrelativesDteStore } from "../store/correlatives_dte.store";
import { useTransmitterStore } from "../store/transmitter.store";
import { global_styles } from "../styles/global.styles";
import {
  ND_CuerpoDocumentoItems,
  ND_DocumentoRelacionadoItems,
  ND_Receptor,
} from "../types/svf_dte/nd.types";
import { convertCurrencyFormat } from "../utils/money";
import { generateNotaDebito } from "../utils/DTE/nota-debito";
import { firmarDocumentoNotaDebito, send_to_mh } from "../services/DTE.service";
import { PayloadMH } from "../types/DTE/DTE.types";
import { return_mh_token } from "../storage/localStorage";
import axios, { AxiosError } from "axios";
import HeadlessModal from "../components/global/HeadlessModal";
import { LoaderIcon } from "lucide-react";
import { SendMHFailed } from "../types/transmitter.types";
import { save_logs } from "../services/logs.service";
import jsPDF from "jspdf";
import { useConfigurationStore } from "../store/perzonalitation.store";
import { makePDFNotaDebito } from "./svfe_pdf/template1/nota_debito.pdf";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { formatDate } from "../utils/dates";
import { s3Client } from "../plugins/s3";

function NotaDebito() {
  const { id } = useParams();
  const { getSaleDetails, sale_details, updateSaleDetails } = useSalesStore();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    getSaleDetails(Number(id));
  }, [id]);

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const updatePrice = (price: number, id: number) => {
    const items = sale_details?.details;

    if (items) {
      const item = items.find((i) => i.id === id);
      if (item) {
        item.newMontoDescu = 0;
        (item.porcentajeDescuento = 0),
          (item.newTotalItem = price * item.newCantidadItem);
        item.branchProduct.newPrice = price;
        item.isEdited = true;

        const edited = items.map((i) => (i.id === id ? item : i));

        updateSaleDetails({ ...sale_details, details: edited });
      }
    }
  };

  const updateQuantity = (quantity: number, id: number) => {
    const items = sale_details?.details;

    if (items) {
      const item = items.find((i) => i.id === id);
      if (item) {
        item.newCantidadItem = quantity;

        const discount = calculateDiscountedTotal(
          item.branchProduct.newPrice,
          Number(item.porcentajeDescuento)
        );

        item.isEdited = true;

        item.newMontoDescu = discount.discountAmount * item.newCantidadItem;
        item.newTotalItem = discount.discountedTotal * item.newCantidadItem;
        const edited = items.map((i) => (i.id === id ? item : i));
        updateSaleDetails({ ...sale_details, details: edited });
      }
    }
  };

  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  useEffect(() => {
    gettransmitter();
  }, []);

  const modalError = useDisclosure();

  const { personalization } = useConfigurationStore();

  const proccessNotaDebito = async () => {
    if (sale_details) {
      const edited_items = sale_details.details.filter((item) => {
        if (item.isEdited) {
          return (
            item.newCantidadItem >= item.cantidadItem &&
            item.branchProduct.newPrice >= item.branchProduct.price
          );
        }
        return false;
      });

      if (edited_items.length === 0) {
        toast.error(
          "No se encontraron items editados o tienes errores sin resolver"
        );
        return;
      }

      const correlatives = await getCorrelativesByDte(transmitter.id, "06");

      const items: ND_CuerpoDocumentoItems[] = sale_details.details.map(
        (item, index) => {
          return {
            numItem: index + 1,
            tipoItem: Number(item.branchProduct.product.tipoItem),
            numeroDocumento: sale_details.codigoGeneracion,
            codigo:
              item.branchProduct.product.code !== "N/A"
                ? item.branchProduct.product.code
                : null,
            codTributo: null,
            descripcion: item.branchProduct.product.name,
            cantidad: item.newCantidadItem,
            uniMedida: Number(item.branchProduct.product.uniMedida),
            precioUni: Number(item.branchProduct.price),
            montoDescu: Number(item.montoDescu),
            ventaNoSuj: Number(item.ventaNoSuj),
            ventaExenta: Number(item.ventaExenta),
            ventaGravada: Number(item.newTotalItem),
            tributos: ["20"],
          };
        }
      );

      const receptor: ND_Receptor = {
        nit: sale_details.customer!.nit,
        nrc: sale_details.customer!.nrc,
        nombre: sale_details.customer!.nombre,
        codActividad: sale_details.customer!.codActividad,
        descActividad: sale_details.customer!.descActividad,
        nombreComercial:
          sale_details.customer!.nombreComercial === "N/A"
            ? null
            : sale_details.customer!.nombreComercial,
        direccion: {
          departamento: sale_details.customer.direccion.departamento!,
          municipio: sale_details.customer.direccion.municipio!,
          complemento: sale_details.customer.direccion.complemento!,
        },
        telefono:
          sale_details.customer!.telefono === "N/A"
            ? null
            : sale_details.customer!.telefono,
        correo: sale_details.customer!.correo,
      };

      const documentoRelacionado: ND_DocumentoRelacionadoItems[] = [
        {
          tipoDocumento: "03",
          tipoGeneracion: 2,
          numeroDocumento: sale_details.codigoGeneracion,
          fechaEmision: sale_details.fecEmi,
        },
      ];

      const total = sale_details.details
        .map((item) => Number(item.newTotalItem))
        .reduce((a, b) => a + b, 0);

      const total_iva = sale_details.details
        .map((cp) => {
          const iva = Number(cp.newTotalItem) * 0.13;
          return iva;
        })
        .reduce((a, b) => a + b, 0);

      const resumen = {
        totalNoSuj: 0,
        totalExenta: 0,
        totalGravada: Number(total.toFixed(2)),
        subTotalVentas: Number(total.toFixed(2)),
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        totalDescu: 0,
        tributos: [
          {
            codigo: "20",
            descripcion: "Impuesto al Valor Agregado 13%",
            valor: Number(total_iva.toFixed(2)),
          },
        ],
        subTotal: Number(total.toFixed(2)),
        ivaRete1: 0,
        reteRenta: 0,
        ivaPerci1: 0,
        montoTotalOperacion: Number((total + total_iva).toFixed(2)),
        totalLetras: convertCurrencyFormat(
          String((total + total_iva).toFixed(2))
        ),
        condicionOperacion: 1,
        numPagoElectronico: null,
      };

      const nota_debito = generateNotaDebito(
        transmitter,
        receptor,
        documentoRelacionado,
        items,
        Number(correlatives?.siguiente ?? 0),
        resumen,
        null,
        null,
        null
      );
      firmarDocumentoNotaDebito(nota_debito)
        .then((firmador) => {
          const data_send: PayloadMH = {
            ambiente: "00",
            idEnvio: 1,
            version: 3,
            tipoDte: "06",
            documento: firmador.data.body,
          };
          const token_mh = return_mh_token();
          if (token_mh) {
            const source = axios.CancelToken.source();
            const timeout = setTimeout(() => {
              source.cancel("El tiempo de espera ha expirado");
            }, 20000);
            send_to_mh(data_send, token_mh ?? "", source)
              .then(async (response) => {
                clearTimeout(timeout);
                const DTE_FORMED = {
                  ...nota_debito.dteJson,
                  respuestaMH: response.data,
                  firma: firmador.data.body,
                };

                const doc = new jsPDF();

                const data = await axios.get(personalization[0].logo, {
                  responseType: "arraybuffer",
                });

                const QR = await axios.get(
                  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example",
                  {
                    responseType: "arraybuffer",
                  }
                );

                const JSON_DTE = JSON.stringify(
                  {
                    ...DTE_FORMED,
                  },
                  null,
                  2
                );

                const json_url = `CLIENTES/${
                  transmitter.nombre
                }/${new Date().getFullYear()}/VENTAS/NOTAS_DE_DEBITO/${formatDate()}/${
                  nota_debito.dteJson.identificacion.codigoGeneracion
                }/${nota_debito.dteJson.identificacion.codigoGeneracion}.json`;
                const pdf_url = `CLIENTES/${
                  transmitter.nombre
                }/${new Date().getFullYear()}/VENTAS/NOTAS_DE_DEBITO/${formatDate()}/${
                  nota_debito.dteJson.identificacion.codigoGeneracion
                }/${nota_debito.dteJson.identificacion.codigoGeneracion}.pdf`;

                const blob = makePDFNotaDebito(
                  doc,
                  DTE_FORMED,
                  data.data ? new Uint8Array(data.data) : "",
                  new Uint8Array(QR.data),
                  theme
                );

                const json_blob = new Blob([JSON_DTE], {
                  type: "application/json",
                });

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
                            setIsLoading(false);
                            toast.success("Nota de debito enviada");
                          }
                        })
                        .catch(() => {
                          setIsLoading(false);
                          modalError.onOpen();
                        });
                    }
                  })
                  .catch(() => {
                    setIsLoading(false);
                    toast.error("Error al enviar el PDF");
                  });
              })
              .catch(async (error: AxiosError<SendMHFailed>) => {
                clearTimeout(timeout);
                if (axios.isCancel(error)) {
                  setTitle("Tiempo de espera agotado");
                  setErrorMessage("El tiempo limite de espera ha expirado");
                  modalError.onOpen();
                  setIsLoading(false);
                }
                modalError.onOpen();
                setIsLoading(false);

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
                      nota_debito.dteJson.identificacion.codigoGeneracion,
                  });
                }
              });
          } else {
            modalError.onOpen();
            setIsLoading(false);
            setErrorMessage("No se ha podido obtener el token de hacienda");
            return;
          }
        })
        .catch(() => {
          modalError.onOpen();
          setIsLoading(false);
          setTitle("Error en el firmador");
          setErrorMessage("Error al firmar el documento");
        });
    }
  };

  return (
    <Layout title="Nota de débito">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <p className="text-lg font-semibold dark:text-white">Detalles</p>
          <div className="grid grid-cols-2 gap-5">
            <p className="font-semibold dark:text-white">
              Código Generación:{" "}
              <span className="font-normal">
                {sale_details?.codigoGeneracion}
              </span>
            </p>
            <p className="font-semibold dark:text-white">
              Sello recepción:{" "}
              <span className="font-normal">{sale_details?.selloRecibido}</span>
            </p>
            <p className="font-semibold dark:text-white">
              Numero control:{" "}
              <span className="font-normal">{sale_details?.numeroControl}</span>
            </p>
            <p className="font-semibold dark:text-white">
              Fecha hora:{" "}
              <span className="font-normal">
                {sale_details?.fecEmi} - {sale_details?.horEmi}
              </span>
            </p>
          </div>
          <p className="text-lg font-semibold py-8 dark:text-white">
            Productos
          </p>
          {sale_details?.details && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={sale_details?.details}
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
                field="branchProduct.product.name"
                header="Nombre"
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    defaultValue={rowData.branchProduct.product.name}
                    onChange={(e) => {
                      updateSaleDetails({
                        ...sale_details,
                        details: sale_details?.details?.map((item) => {
                          if (item.id === rowData.id) {
                            return {
                              ...item,
                              branchProduct: {
                                ...item.branchProduct,
                                product: {
                                  ...item.branchProduct.product,
                                  name: e.target.value,
                                },
                              },
                            };
                          }
                          return item;
                        }),
                      });
                    }}
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="cantidadItem"
                header="Cantidad"
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    className="w-32"
                    defaultValue={rowData.cantidadItem}
                    min={Number(rowData.cantidadItem)}
                    isInvalid={rowData.newCantidadItem < rowData.cantidadItem}
                    errorMessage="La cantidad no puede ser menor a la cantidad de venta"
                    type="number"
                    onChange={(e) =>
                      updateQuantity(Number(e.target.value), rowData.id)
                    }
                  />
                )}
              />
              {/* <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                body={(rowData) =>
                 <>
                 
                 </>
                }
                header="Descuento"
              /> */}
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branchProduct.product.code"
                header="Codigo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branchProduct.price"
                header="Precio"
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    className="w-52"
                    defaultValue={rowData.branchProduct.newPrice}
                    min={Number(rowData.branchProduct.price)}
                    type="number"
                    startContent="$"
                    isInvalid={
                      rowData.branchProduct.newPrice <
                      rowData.branchProduct.price
                    }
                    errorMessage="El precio no puede ser menor al precio de venta"
                    onChange={(e) =>
                      updatePrice(Number(e.target.value), rowData.id)
                    }
                    endContent={
                      <span>
                        {rowData.branchProduct.newPrice !==
                        rowData.branchProduct.price ? (
                          <s>${rowData.branchProduct.price}</s>
                        ) : (
                          ""
                        )}
                      </span>
                    }
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="newTotalItem"
                header="Total"
                body={(rowData) => formatCurrency(Number(rowData.newTotalItem))}
              />
            </DataTable>
          )}
          <div className="w-full mt-8">
            <Button
              style={global_styles().thirdStyle}
              onClick={proccessNotaDebito}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                "Procesar Nota de Debito"
              )}
            </Button>
          </div>
        </div>
        <HeadlessModal
          isOpen={false}
          onClose={() => {}}
          title="Cargando"
          size="w-[600px]"
        >
          <div>{title} {errorMessage}</div>
        </HeadlessModal>
      </div>
    </Layout>
  );
}

export default NotaDebito;
