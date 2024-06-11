import { useParams } from "react-router";
import Layout from "../layout/Layout";
import { useSalesStore } from "../store/sales.store";
import { useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../hooks/useTheme";
import { Button, Input } from "@nextui-org/react";
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
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import NotaDebitoTMP from "./invoices/Template2/CND";

function NotaDebito() {
  const { id } = useParams();
  const { getSaleDetails, sale_details, updateSaleDetails } = useSalesStore();

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
        item.porcentajeDescuento = 0,
        item.newTotalItem = price * item.newCantidadItem;
        item.branchProduct.newPrice = price;

        const edited = items.map((i) => (i.id === id ? item : i));

        updateSaleDetails({ ...sale_details, isEdited: true, details: edited });
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

        item.newMontoDescu = discount.discountAmount * item.newCantidadItem;
        item.newTotalItem = discount.discountedTotal * item.newCantidadItem;
        const edited = items.map((i) => (i.id === id ? item : i));
        updateSaleDetails({ ...sale_details, isEdited: true, details: edited });
      }
    }
  };

  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  useEffect(() => {
    gettransmitter();
  }, []);

  const proccessNotaDebito = async () => {
    if (sale_details) {
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
          const source = axios.CancelToken.source();
          const timeout = setTimeout(() => {
            source.cancel("El tiempo de espera ha expirado");
          }, 25000);
          send_to_mh(data_send, token_mh ?? "", source)
            .then((response) => {
              clearTimeout(timeout);
              const DTE_FORMED = {
                ...nota_debito.dteJson,
                respuestaMH: response.data,
                firma: firmador.data.body,
              };

              pdf(<NotaDebitoTMP dte={DTE_FORMED} />)
                .toBlob()
                .then((blob) => {
                  const url = URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "invoice.pdf";
                  link.click();

                  URL.revokeObjectURL(url);
                  toast.success("Se ha descargado el archivo");
                });
            })
            .catch(() => {
              clearTimeout(timeout);
              toast.error("Error al enviar el documento");
            });
        })
        .catch(() => {
          toast.error("Error al firmar el documento");
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
          <p className="text-lg font-semibold py-8 dark:text-white">Productos</p>
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
            >
              Procesar Nota Debito
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotaDebito;
