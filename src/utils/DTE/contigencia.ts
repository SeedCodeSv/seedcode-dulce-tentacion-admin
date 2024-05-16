import { ITransmitter } from "../../types/transmitter.types";
import { ambiente } from "../constants";
import { getElSalvadorDateTime, getElSalvadorDateTimeParam } from "../dates";
import { generate_uuid } from "../random/random";

interface IContingenciaItems {
    noItem: number,
    codigoGeneracion: string
    tipoDoc: string
}

export const generate_contingencia = (transmitter: ITransmitter, items: IContingenciaItems[], contingencia: string, motivo: string) => {
    return {
        nit: transmitter.nit,
        activo: true,
        passwordPri: transmitter.clavePublica,
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
                nombreResponsable: "Carlos Daniel Contreras Hernandez",
                tipoDocResponsable: "13",
                numeroDocResponsable: "062017584",
                tipoEstablecimiento: transmitter.tipoEstablecimiento,
                telefono: transmitter.telefono,
                correo: transmitter.correo,
                codEstableMH:
                    transmitter.codEstableMH === "0" ? null : transmitter.codEstableMH,
                codPuntoVenta:
                    transmitter.codPuntoVenta === "0"
                        ? null
                        : transmitter.codPuntoVenta,
            },
            detalleDTE: items,
            motivo: {
                fInicio: getElSalvadorDateTimeParam(new Date()).fecEmi,
                fFin: getElSalvadorDateTime().fecEmi,
                hInicio: getElSalvadorDateTimeParam(new Date()).horEmi,
                hFin: getElSalvadorDateTime().horEmi,
                tipoContingencia: Number(contingencia),
                motivoContingencia:
                    motivo !== "" ? motivo : null,
            },
        },
    }
}