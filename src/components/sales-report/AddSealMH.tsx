import axios from "axios";
import { get_json_sale } from "../../services/sales.service";
import { IDTE } from "../../types/DTE/DTE.types";
import { generate_factura } from "../../utils/DTE/factura";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useEffect } from "react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
import { pdf } from "@react-pdf/renderer";
import { Invoice } from "../../pages/Invoice";
import { ambiente, API_URL, MH_QUERY } from "../../utils/constants";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../../plugins/s3";
import { get_token } from "../../storage/localStorage";
import { toast } from "sonner";
import { Sale } from "../../types/report_contigence";
import { IFormasDePago } from "../../types/DTE/forma_de_pago.types";
import { ICartProduct } from "../../types/branch_products.types";

interface Props {
  sale: Sale;
  sello: string;
}

export const AddSealMH = (props: Props) => {
  useEffect(() => {
    gettransmitter();
    getCat02TipoDeDocumento();
    getCat017FormasDePago();
  }, []);
  const { gettransmitter, transmitter } = useTransmitterStore();
  const {
    tipos_de_documento,
    getCat02TipoDeDocumento,
    getCat017FormasDePago,
    metodos_de_pago,
  } = useBillingStore();
  const generateURLMH = (
    ambiente: string,
    codegen: string,
    fechaEmi: string
  ) => {
    return `${MH_QUERY}?ambiente=${ambiente}&codGen=${codegen}&fechaEmi=${fechaEmi}`;
  };
  interface Data {
    quantity: number;
    discount: string | number;
    percentage: string;
    total: number;
    base_price: string | number;
  }

  get_json_sale(props.sale.id).then((data) => {
    axios
      .get(data.data.json)
      .then(async (response) => {
        const jsonData: IDTE = JSON.parse(response.data);
        const data: Data[] = [];
        for (const item of jsonData.cuerpoDocumento) {
          data.push({
            quantity: item.cantidad,
            discount: item.montoDescu,
            percentage: (
              (Number(item.montoDescu) / Number(item.precioUni)) *
              100
            ).toFixed(2),
            total: Number(item.cantidad) * Number(item.precioUni),
            base_price: item.precioUni,
          });
        }
        jsonData.respuestaMH.selloRecibido = props.sello;
        const correlativo = jsonData.identificacion.numeroControl.slice(-4);
        const formaPago = metodos_de_pago.find(
          (fp) => fp.codigo === jsonData.resumen.pagos[0].codigo
        );

        const tipoDte = tipos_de_documento.find(
          (td) => td.codigo === jsonData.identificacion.tipoDte
        ) as ITipoDocumento;
        const generate = generate_factura(
          transmitter,
          Number(correlativo),
          tipoDte,
          props.sale.customer,
          data as unknown as ICartProduct[],
          formaPago as IFormasDePago
        );

        //json send to spapce
        const JSON_DTE = JSON.stringify(
          {
            ...generate.dteJson,
            respuestaMH: data,
            firma: jsonData.firma,
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
            sello={props.sello}
          />
        ).toBlob();
        if (json_blob && blob) {
          const uploadParams: PutObjectCommandInput = {
            Bucket: "seedcode-facturacion",
            Key: props.sale.pathJson,
            Body: json_blob,
          };
          const uploadParamsPDF: PutObjectCommandInput = {
            Bucket: "seedcode-facturacion",
            Key: props.sale.pathPdf,
            Body: blob,
          };
          try {
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
                              pdf: props.sale.pathPdf,
                              dte: props.sale.pathJson,
                              cajaId: Number(localStorage.getItem("box")),
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
                            toast.success("Se completo con éxito la venta");
                          })
                          .catch(() => {
                            toast.error("Error al guardar la venta");
                          });
                      }
                    });
                }
              });
          } catch {
            toast.error("Error en el archivo");
          }
        }
      })
      .catch(() => {
        toast.error("Error en el archivo");
      });
  });

  return <div>AddSealMH</div>;
};
