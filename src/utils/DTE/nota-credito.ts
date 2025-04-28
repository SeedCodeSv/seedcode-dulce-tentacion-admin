import { generate_uuid } from "../random/random";
import { generate_control } from "../dte";
import { formatearNumero } from "../make-dte";
import { ambiente } from "../constants";
import { getElSalvadorDateTime } from "../dates";

import { ITransmitter } from "@/types/transmitter.types";
import { ND_ApendiceItems, ND_CuerpoDocumentoItems, ND_DocumentoRelacionadoItems, ND_Emisor, ND_Extension, ND_Receptor, ND_Resumen, ND_VentaTercerosItems } from "@/types/svf_dte/nd.types";
import { SVFE_NC_SEND } from "@/types/svf_dte/nc.types";
import { Correlativo } from "@/types/correlatives_dte.types";

export const generateNotaCredito = (
    emisor: ITransmitter,
    receptor: ND_Receptor,
    documentos_relacionados: ND_DocumentoRelacionadoItems[],
    cuerpoDocumento: ND_CuerpoDocumentoItems[],
    correlative: Correlativo,
    resumen: ND_Resumen,
    ventaTercero: ND_VentaTercerosItems[] | null,
    extension: ND_Extension[] | null,
    apendice: ND_ApendiceItems[] | null
): SVFE_NC_SEND => {
    const dataEmisor = {...emisor, tipoEstablecimiento: correlative.tipoEstablecimiento}

    return {
        nit: emisor.nit,
        activo: true,
        passwordPri: emisor.clavePrivada,
        dteJson: {
            identificacion: {
                codigoGeneracion: generate_uuid().toUpperCase(),
                tipoContingencia: null,
                numeroControl: generate_control(
                    '05',
                    correlative.codEstable,
                    correlative.codPuntoVenta,
                    formatearNumero(correlative.next)
                ),
                tipoOperacion: 1,
                ambiente: ambiente,
                fecEmi: getElSalvadorDateTime().fecEmi,
                tipoModelo: 1,
                tipoDte: '05',
                version: 3,
                tipoMoneda: 'USD',
                motivoContin: null,
                horEmi: getElSalvadorDateTime().horEmi,
            },
            documentoRelacionado: documentos_relacionados,
            emisor: generateEmisorNotaDebito(dataEmisor),
            ventaTercero,
            receptor,
            cuerpoDocumento,
            resumen,
            apendice,
            extension,
        },
    };
};

export const generateEmisorNotaDebito = (transmitter: ITransmitter): ND_Emisor => {
    return {
        nit: transmitter.nit,
        nrc: transmitter.nrc,
        nombre: transmitter.nombre,
        nombreComercial: transmitter.nombreComercial,
        codActividad: transmitter.codActividad,
        descActividad: transmitter.descActividad,
        tipoEstablecimiento: transmitter.tipoEstablecimiento,
        direccion: {
            departamento: transmitter.direccion.departamento,
            municipio: transmitter.direccion.municipio,
            complemento: transmitter.direccion.complemento,
        },
        telefono: transmitter.telefono,
        correo: transmitter.correo,
    };
};