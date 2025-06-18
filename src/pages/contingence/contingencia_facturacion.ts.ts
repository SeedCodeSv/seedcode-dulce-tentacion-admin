import axios from "axios";
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { SVFC_NRE_Firmado } from '@renderer/types/svf_dte/nre.types'
import { toast } from "sonner";

import { generateURL } from "./utils";

import { s3Client } from "@/plugins/s3";
import { get_token } from "@/storage/localStorage";
import { ITransmitter } from "@/types/transmitter.types";
import { ambiente, API_URL, SPACES_BUCKET } from "@/utils/constants";
import { getElSalvadorDateTime } from "@/utils/dates";
import { generate_uuid } from "@/utils/random/random";
import { ReferalNote } from "@/types/referal-note.types";
import { CuerpoDocumento, DocumentoNoteOfRemission, Resumen } from "@/shopping-branch-product/types/notes_of_remision.types";
import { firmarNotaDeEnvio, send_to_mh } from "@/shopping-branch-product/service/dte_shipping_note.service";
import { PayloadMH } from "@/types/DTE/DTE.types";
import { SVFC_NRE_Firmado } from "@/types/svf_dte/nre.types";

interface IContingenciaItems {
  noItem: number;
  codigoGeneracion: string;
  tipoDoc: string;
}

export const generate_contingencias = (
  transmitter: ITransmitter,
  items: IContingenciaItems[],
  contingencia: string,
  motivo: string,
  employeeName: string,
  employeeNumberDoc: string,
  employeeTipoDoc: string,
  initialDate: string,
  finalDate: string,
  initialTime: string,
  finalTime: string,
  pVenta: string,
  tipoEstablecimientoDoc: string,
) => {
  return {
    nit: transmitter.nit,
    activo: true,
    passwordPri: transmitter.clavePrivada,
    dteJson: {
      identificacion: {
        version: 3,
        ambiente: ambiente,
        codigoGeneracion: generate_uuid().toUpperCase(),
        fTransmision: getElSalvadorDateTime().fecEmi,
        hTransmision: getElSalvadorDateTime().horEmi,
      },
      emisor: {
        nit: transmitter.nit,
        nombre: transmitter.nombre,
        nombreResponsable: employeeName,
        tipoDocResponsable: employeeTipoDoc,
        numeroDocResponsable: employeeNumberDoc,
        tipoEstablecimiento: tipoEstablecimientoDoc,
        telefono: transmitter.telefono,
        correo: transmitter.correo,
        codEstableMH: null,
        codPuntoVenta: pVenta === '0' ? null : pVenta,
      },
      detalleDTE: items,
      motivo: {
        fInicio: initialDate,
        fFin: finalDate,
        hInicio: initialTime.slice(),
        hFin: finalTime.slice(),
        tipoContingencia: Number(contingencia),
        motivoContingencia: motivo !== '' ? motivo : null,
      },
    },
  };
};
export const processReferalNRE = async (
  referal: ReferalNote,
  saleIndex: number,
  token_mh: string,
  motivo: number,
  nit: string,
  passwordPri: string,
 
) => {
  try {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: referal.pathJson
      })
    )

    const json = await axios.get<SVFC_NRE_Firmado>(url, { responseType: 'json' })
    const json_send: DocumentoNoteOfRemission = {
      nit,
      passwordPri,
      dteJson: {
        identificacion: { ...json.data.identificacion, tipoOperacion: 2, tipoContingencia: motivo },
        resumen: json.data.resumen as Resumen,
        cuerpoDocumento: json.data.cuerpoDocumento as CuerpoDocumento[],
        extension: json.data.extension,
        apendice: null,
        emisor: json.data.emisor,
        receptor: json.data.receptor,
        documentoRelacionado: null,
        ventaTercero: null
      }
    }

    const firma = firmarNotaDeEnvio(json_send)

    const data_send: PayloadMH = {
      ambiente,
      idEnvio: 1,
      version: 3,
      tipoDte: referal.tipoDte,
      documento: (await firma).data.body
    }

    toast.info('Se ha enviado a Hacienda, esperando respuesta')

    const respuestaMH = await SendDocumentoToMhNRE(
      data_send,
      token_mh,
      json_send.dteJson.identificacion.numeroControl
    )

    const json_url = generateURL(
      json.data.emisor.nombre,
      json.data.identificacion.codigoGeneracion,
      'json',
      referal.tipoDte,
      json_send.dteJson.identificacion.fecEmi
    )

    const firmado = {
      ...json_send.dteJson,
      respuestaMH: respuestaMH.data,
      firma: (await firma).data.body
    }
    const JSON_DTE = JSON.stringify(firmado, null, 2)
    const json_blob = new Blob([JSON_DTE], { type: 'application/json' })
    const uploadSuccess = new Upload({
      client: s3Client,
      params: {
        Bucket: SPACES_BUCKET,
        Key: json_url,
        Body: json_blob
      }
    })

    await uploadSuccess.done()

    if (uploadSuccess) {
      const token = get_token() ?? ''

      await axios.put(
        `${API_URL}/referal-note/update-referal-note-contingence`,
        {
          statusName: "PENDIENTE",
          dte: json_url,
          sello: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success(`Nota no. ${saleIndex + 1} guardada`)

      return true
    } else {
      return false
    }

  } catch (error) {

    return false
  }
}

export const SendDocumentoToMhNRE = async (
  data: PayloadMH,
  token: string,
  numeroControl: string,
  timeoutMs: number = 25000
) => {
  const source = axios.CancelToken.source()
  const timeout = setTimeout(() => source.cancel('El tiempo de espera ha expirado'), timeoutMs)

  try {
    const response = await send_to_mh(data, token, source)

    clearTimeout(timeout)

    return response
  } catch (error) {
    await axios.put(API_URL + `/referal-note/update-referal-note-contingence`, {
      numeroControl,
      statusName: 'CONTINGENCIA INVALIDA'
    })
    clearTimeout(timeout)
    if (axios.isCancel(error)) {
      toast.error('Tiempo de espera agotado')
    } else {
      toast.error('Error al enviar el DTE a Hacienda')

    }
    throw error
  }
}
