import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client'

import { Branches } from './shipping_branch_product.types';

import { Customer } from '@/types/customers.types';
import { Employee } from '@/types/employees.types';

export interface Identificacion {
  version: number;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia: string | null;
  motivoContin: string | null;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: string;
}
export interface Direccion {
  departamento: string;
  municipio: string;
  complemento: string;
}
export interface Emisor {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string;
  tipoEstablecimiento: string;
  direccion: Direccion;
  telefono: string;
  correo: string;
  codEstableMH: string;
  codEstable: string | null;
  codPuntoVentaMH: string;
  codPuntoVenta: string;
}

export interface Receptor {
  tipoDocumento: string;
  numDocumento: string;
  nrc: string | null;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  nombreComercial: string | null;
  direccion: Direccion | null;
  telefono: string;
  correo: string;
  bienTitulo?: string;
}

export interface CuerpoDocumento {
  numItem: number;
  tipoItem: number;
  numeroDocumento: string | null;
  codigo: string;
  codTributo: string | null;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: string | null;
}

export interface Resumen {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number | null;
  totalDescu: number;
  tributos: string | null;
  subTotal: number;
  montoTotalOperacion: number;
  totalLetras: string;
}

export interface Extension {
  nombEntrega: string;
  docuEntrega: string;
  nombRecibe: string;
  docuRecibe: string;
  observaciones: string;
}

export interface DocumentoNoteOfRemission {
  nit: string;
  passwordPri: string;

  dteJson: {
    identificacion: Identificacion;
    documentoRelacionado: string | null;
    emisor: Emisor;
    receptor: Receptor;
    ventaTercero: string | null;
    cuerpoDocumento: CuerpoDocumento[];
    resumen: Resumen;
    extension: Extension;
    apendice: string | null;
  };
}

export interface ICreateShippingProducts {
  orderId?: number
  dte: string;
  pointOfSaleId: number;
  employeeId: number;
  sello: boolean;
  customerId?: number;
  receivingBranchId?: number;
}

export interface IPropCustomer {
  customer?: Customer;
  employee: Employee;
  pointOfSaleId: number;
  observation: string;
  setErrors: Dispatch<SetStateAction<string[]>>;
  setTitleString: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  onOpenChange: () => void;
  openModalSteps: () => void;
  branch: Branches;
  branchLlegada?: Branches;
  employeeReceptor?: Employee;
  titleError: string;
    socket:Socket;
  branchIssuingId:number
}
