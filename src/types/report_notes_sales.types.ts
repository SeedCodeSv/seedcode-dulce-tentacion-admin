import { Branch } from "./auth.types";

export interface Sale {
    id: number
    numeroControl: string
    codigoGeneracion: string
    tipoDte: string
    fecEmi: string
    horEmi: string
    selloRecibido: string
    sello: boolean
    codeEmployee: string
    totalNoSuj: string
    totalExenta: string
    totalGravada: string
    subTotalVentas: string
    descuNoSuj: string
    descuExenta: string
    descuGravada: string
    porcentajeDescuento: string
    totalDescu: string
    subTotal: string
    totalIva: string
    montoTotalOperacion: string
    totalPagar: string
    totalLetras: string
    pathPdf: string
    pathJson: string
    isActivated: boolean
    paymentType: any
    customer: Customer
    employee: Employee
    salesStatus: {
      id: number
      isActive: boolean
      name: string
    }
    boxId: number
    customerId: number
    employeeId: number
    paymentTypeId: any
  }

  export interface Customer {
    id: number
    nombre: string
    nombreComercial: string
    nrc: string
    nit: string
    tipoDocumento: string
    numDocumento: string
    codActividad: string
    descActividad: string
    bienTitulo: string
    telefono: string
    correo: string
    isActive: boolean
    esContribuyente: boolean
    direccionId: number
    transmitterId: number
  }
  
  export interface Employee {
    id: number
    fullName: string
    phone: string
    isActive: boolean
    branch: Branch
    branchId: number
  }

  export interface IGetNotaCredito extends Sale {
    sale: Sale;
    saleId: number;
  }

  export interface IResponseIGetNotasCreditos {
    notasCreditos: IGetNotaCredito[];
  }
  export interface IResponseIGetNotasDebitos {
    notasDebitos: IGetNotaCredito[];
  }

export interface IReportNoteSalesStore {
    sales: Sale[]
    notasCreditos: IGetNotaCredito[];
    notasDebitos: IGetNotaCredito[];
    OnGetNotasCreditos: (id: number) => void;
    OnGetNotasDebitos: (id: number) => void;
}