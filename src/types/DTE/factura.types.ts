import { ITransmitter } from '../transmitter.types';

import { CuerpoDocumento } from './credito_fiscal.types';
import { Pago } from './sub_interface/payment.types';
import { Receptor } from './sub_interface/receiver.types';

export interface Resumen {
  totalNoSuj: number | string;
  totalExenta: number | string;
  totalGravada: number | string;
  subTotalVentas: number | string;
  descuNoSuj: number | string;
  descuExenta: number | string;
  descuGravada: number | string;
  porcentajeDescuento: number | string;
  totalDescu: number | string;
  tributos:
    | null
    | {
        codigo: string;
        descripcion: string;
        valor: number;
      }[];
  subTotal: number | string;
  ivaRete1: number | string;
  reteRenta: number | string;
  montoTotalOperacion: number | string;
  totalNoGravado: number | string;
  totalPagar: number | string;
  totalLetras: string;
  totalIva: number | string;
  saldoFavor: number | string;
  condicionOperacion: number;
  pagos: Pago[];
  numPagoElectronico: string | null;
}
export interface DTEToPDF {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: string;
  codigoGeneracion: string;
  selloRecibido: string;
  fhProcesamiento: string;
  clasificaMsg: string;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones: string[];
  transmitter: ITransmitter;
  receptor: Receptor;
  resumen: Resumen;
  numeroControl: string;
  cuerpoDocumento: CuerpoDocumento[];
}
