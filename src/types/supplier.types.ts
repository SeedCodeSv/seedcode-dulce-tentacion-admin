import { ITransmitter } from './transmitter.types';

export interface SupplierDirection {
  id?: number
  departamento?: string
  nombreDepartamento?: string
  municipio?: string
  nombreMunicipio?: string
  complemento?: string
  active?: boolean
}


export interface Supplier {
  id?: number;
  nombre: string;
  nombreComercial: string;
  nrc: string;
  nit: string;
  tipoDocumento: string;
  numDocumento: string;
  codActividad: string;
  descActividad: string;
  bienTitulo: string;
  telefono: string;
  correo: string;
  isActive?: boolean;
  esContribuyente: boolean;
  transmitter?: ITransmitter;
  direccion?: SupplierDirection;
  departamento?: string
  nombreDepartamento?: string
  municipio?: string
  nombreMunicipio?: string
  complemento?: string
  direccionId?: number;
}
export interface IGetSuppliers {
  ok: boolean;
  suppliers: Supplier[];
}

export interface IGetSuppliersById {
  ok: boolean;
  supplier: Supplier;
}
export interface IGetSupplierPagination {
  ok: boolean;
  suppliers: Supplier[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface PayloadSupplier {
  id?: number;
  nombre: string;
  nombreComercial?: string;
  nrc?: string;
  nit?: string;
  tipoDocumento?: string;
  numDocumento?: string;
  codActividad?: string;
  descActividad?: string;
  bienTitulo?: string;
  telefono?: string;
  correo?: string;
  departamento?: string
  nombreDepartamento?: string
  municipio?: string
  nombreMunicipio?: string
  complemento?: string
  esContribuyente?: number | boolean;
  transmitterId?: number;
}

