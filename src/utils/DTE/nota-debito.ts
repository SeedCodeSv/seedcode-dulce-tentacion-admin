import { Correlativo } from '@/types/correlatives_dte.types';
import { ND_ApendiceItems, ND_CuerpoDocumentoItems, ND_DocumentoRelacionadoItems, ND_Emisor, ND_Extension, ND_Receptor, ND_Resumen, ND_VentaTercerosItems, SVFE_ND_SEND } from '../../types/svf_dte/nd.types';
import { ITransmitter } from "../../types/transmitter.types";
import { ambiente } from "../constants";
import { getElSalvadorDateTime } from "../dates";
import { generate_control } from "../dte";
import { formatearNumero } from "../make-dte";
import { generate_uuid } from "../random/random";

export const generateNotaDebito = (
    emisor: ITransmitter,
    receptor: ND_Receptor,
    documentos_relacionados: ND_DocumentoRelacionadoItems[],
    cuerpoDocumento: ND_CuerpoDocumentoItems[],
    // nextNumber: number,
    correlative: Correlativo,
    resumen: ND_Resumen,
    ventaTercero: ND_VentaTercerosItems[] | null,
    extension: ND_Extension[] | null,
    apendice: ND_ApendiceItems[] | null,
    // codPuntoVenta: string,
    // codEstable: string,
    tipoEstable: string
): SVFE_ND_SEND => {
    return {
        nit: emisor.nit,
        activo: true,
        passwordPri: emisor.clavePrivada,
        dteJson: {
            identificacion: {
                codigoGeneracion: generate_uuid().toUpperCase(),
                tipoContingencia: null,
                numeroControl: generate_control("06", correlative.codEstable, correlative.codPuntoVenta, formatearNumero(correlative.next)),
                tipoOperacion: 1,
                ambiente: ambiente,
                fecEmi: getElSalvadorDateTime().fecEmi,
                tipoModelo: 1,
                tipoDte: "06",
                version: 3,
                tipoMoneda: "USD",
                motivoContin: null,
                horEmi: getElSalvadorDateTime().horEmi,
            },
            documentoRelacionado: documentos_relacionados,
            emisor: generateEmisorNotaDebito(emisor, tipoEstable),
            ventaTercero,
            receptor,
            cuerpoDocumento,
            resumen,
            apendice,
            extension
        },
    };
};

export const generateEmisorNotaDebito = (
    transmitter: ITransmitter, codStable: string
): ND_Emisor => {
    return {
        nit: transmitter.nit,
        nrc: transmitter.nrc,
        nombre: transmitter.nombre,
        nombreComercial: transmitter.nombreComercial,
        codActividad: transmitter.codActividad,
        descActividad: transmitter.descActividad,
        tipoEstablecimiento: codStable,
        direccion: {
            departamento: transmitter.direccion.departamento,
            municipio: transmitter.direccion.municipio,
            complemento: transmitter.direccion.complemento,
        },
        telefono: transmitter.telefono,
        correo: transmitter.correo,
    };
};
