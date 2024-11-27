import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { ambiente, API_URL, SPACES_BUCKET } from "./constants";
import { s3Client } from "@/plugins/s3";
import { toast } from "sonner";
import { PayloadMH } from "@/types/DTE/DTE.types";
import axios from "axios";
import { firmarDocumentoFactura, firmarDocumentoFiscal, send_to_mh } from "@/services/DTE.service";
import { SaleContingence } from "@/types/sales.types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SVFC_FC_Firmado, SVFE_FC_SEND } from "@/types/svf_dte/fc.types";
import { generateURL } from "@/pages/contingence/utils";
import { get_token } from "@/storage/localStorage";
import { SVFC_CF_Firmado, SVFE_CF_SEND } from "@/types/svf_dte/cf.types";

export const uploadToS3 = async (key: string, body: Blob) => {
    const uploadParams: PutObjectCommandInput = {
        Bucket: SPACES_BUCKET,
        Key: key,
        Body: body,
    };

    try {
        const response = await s3Client.send(new PutObjectCommand(uploadParams));
        if (response.$metadata) {
            return true;
        }
    } catch (error) {
        toast.error("Error al subir el archivo a s3")
    }
    return false;
};

export const sendDocumentToMH = async (
    data: PayloadMH,
    token: string,
    numeroControl: string,
    timeoutMs: number = 25000
) => {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel('El tiempo de espera ha expirado'), timeoutMs);

    try {
        const response = await send_to_mh(data, token, source);
        clearTimeout(timeout);
        return response;
      } catch (error) {
        await axios.put(API_URL + '/sales/update-status-contingence', {
          numeroControl,
          statusName: 'CONTINGENCIA INVALIDA',
        });
        clearTimeout(timeout);
        if (axios.isCancel(error)) {
          toast.error('Tiempo de espera agotado');
        } else {
          toast.error('Error al enviar el DTE a Hacienda');
        }
        throw error;
      }
}

export const processSaleFCF = async (
    sale: SaleContingence,
    saleIndex: number,
    token_mh: string,
    motivo: number,
    nit: string,
    passwordPri: string
) => {
    try {
        const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: SPACES_BUCKET,
                Key: sale.pathJson
            })
        );

        const json = await axios.get<SVFC_FC_Firmado>(url, { responseType: 'json' });
        const json_send: SVFE_FC_SEND = {
            nit,
            activo: true,
            passwordPri,
            dteJson: {
              identificacion: { ...json.data.identificacion, tipoOperacion: 2, tipoContingencia: motivo },
              resumen: json.data.resumen,
              cuerpoDocumento: json.data.cuerpoDocumento,
              extension: json.data.extension,
              apendice: json.data.apendice,
              emisor: json.data.emisor,
              receptor: json.data.receptor,
              otrosDocumentos: json.data.otrosDocumentos,
              documentoRelacionado: json.data.documentoRelacionado,
              ventaTercero: json.data.ventaTercero,
            },
          };

          const firma = await firmarDocumentoFactura(json_send);

        const data_send: PayloadMH = {
        ambiente,
        idEnvio: 1,
        version: 1,
        tipoDte: sale.tipoDte,
        documento: firma.data.body,
        };

        toast.info('Se ha enviado a Hacienda, esperando respuesta');

        const respuestaMH = await sendDocumentToMH(
        data_send,
        token_mh,
        json_send.dteJson.identificacion.numeroControl
        );

        const json_url = generateURL(
            json.data.emisor.nombre,
            json.data.identificacion.codigoGeneracion,
            'json',
            sale.tipoDte,
            json_send.dteJson.identificacion.fecEmi
          );
      
          const firmado = {
            ...json_send.dteJson,
            respuestaMH: respuestaMH.data,
            firma: firma.data.body,
          };
          const JSON_DTE = JSON.stringify(firmado, null, 2);
          const json_blob = new Blob([JSON_DTE], { type: 'application/json' });
      
          const uploadSuccess = await uploadToS3(json_url, json_blob);

          if (uploadSuccess) {
            const token = get_token() ?? '';
            await axios.put(
              `${API_URL}/sales/sale-update-transaction`,
              {
                pdf: 'N/A',
                dte: json_url,
                clienteId: sale.customerId,
                cajaId: sale.boxId,
                codigoEmpleado: sale.employeeId,
                sello: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            toast.success(`Venta no. ${saleIndex + 1} guardada`);
            return true;
          }

    } catch (error) {
        return false;
    }
};

export const processSaleCCF = async (
    sale: SaleContingence,
    saleIndex: number,
    token_mh: string,
    motivo: number,
    nit: string,
    passwordPri: string
  ) => {
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: SPACES_BUCKET,
          Key: sale.pathJson,
        })
      );
  
      const json = await axios.get<SVFC_CF_Firmado>(url, { responseType: 'json' });
      const json_send: SVFE_CF_SEND = {
        nit,
        activo: true,
        passwordPri,
        dteJson: {
          identificacion: { ...json.data.identificacion, tipoOperacion: 2, tipoContingencia: motivo },
          resumen: json.data.resumen,
          cuerpoDocumento: json.data.cuerpoDocumento,
          extension: json.data.extension,
          apendice: json.data.apendice,
          emisor: json.data.emisor,
          receptor: json.data.receptor,
          otrosDocumentos: json.data.otrosDocumentos,
          documentoRelacionado: json.data.documentoRelacionado,
          ventaTercero: json.data.ventaTercero,
        },
      };
  
      const firma = await firmarDocumentoFiscal(json_send);
  
      const data_send: PayloadMH = {
        ambiente,
        idEnvio: 1,
        version: 3,
        tipoDte: sale.tipoDte,
        documento: firma.data.body,
      };
  
      toast.info('Se ha enviado a Hacienda, esperando respuesta');
  
      const respuestaMH = await sendDocumentToMH(data_send, token_mh, json_send.dteJson.identificacion.numeroControl);
  
      const json_url = generateURL(
        json.data.emisor.nombre,
        json.data.identificacion.codigoGeneracion,
        'json',
        sale.tipoDte,
        json_send.dteJson.identificacion.fecEmi
      );
  
      const firmado = {
        ...json_send.dteJson,
        respuestaMH: respuestaMH.data,
        firma: firma.data.body,
      };
      const JSON_DTE = JSON.stringify(firmado, null, 2);
      const json_blob = new Blob([JSON_DTE], { type: 'application/json' });
  
      const uploadSuccess = await uploadToS3(json_url, json_blob);
  
      if (uploadSuccess) {
        const token = get_token() ?? '';
        await axios.put(
          `${API_URL}/sales/sale-update-transaction`,
          {
            pdf: 'N/A',
            dte: json_url,
            clienteId: sale.customerId,
            cajaId: sale.boxId,
            codigoEmpleado: sale.employeeId,
            sello: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`Venta no. ${saleIndex + 1} guardada`);
        return true;
      }
  
      return false;
    } catch (error) {
      return false;
    }
  };