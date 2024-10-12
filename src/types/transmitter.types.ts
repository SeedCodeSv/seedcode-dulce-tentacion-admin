import { Role } from './roles.types';

export interface IAddress {
  id: number;
  departamento: string;
  nombreDepartamento: string;
  municipio: string;
  nombreMunicipio: string;
  complemento: string;
  active?: boolean;
}
export interface IGetTransmitter {
  ok: boolean;
  transmitter: ITransmitter;
  status: number;
}
export interface ITransmitter {
  id: number;
  clavePrivada: string;
  clavePublica: string;
  claveApi: string;
  nit: string;
  nrc: string;
  nombre: string;
  telefono: string;
  correo: string;
  descActividad: string;
  codActividad: string;
  nombreComercial: string;
  tipoEstablecimiento: string;
  codEstableMH: string;
  codEstable: string;
  codPuntoVentaMH: string;
  codPuntoVenta: string;
  direccion: IAddress;
  direccionId: number;
  active?: boolean;
}
export interface Body {
  user: string;
  token: string;
  rol: Role;
  roles: string[];
  tokenType: string;
}
export interface ILoginMH {
  status: string;
  body: Body;
}
export interface ILoginMHFailed {
  body: ILoginFailed;
  status: string;
}
export interface ILoginFailed {
  clasificaMsg: string;
  codigoMsg: string;
  descripcionMsg: string;
  estado: string;
  fhProcesamiento: string | null;
  observaciones: string[] | string | null;
}
export interface SendMHFailed {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: string;
  codigoGeneracion: string;
  selloRecibido: string | null;
  fhProcesamiento: string;
  clasificaMsg: string;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones: string[];
}
