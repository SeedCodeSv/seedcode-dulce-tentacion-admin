import { ITransmitter } from "@/types/transmitter.types";
import { ambiente } from "@/utils/constants";
import { getElSalvadorDateTime } from "@/utils/dates";
import { generate_uuid } from "@/utils/random/random";

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
    pVenta:string,
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
