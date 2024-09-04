export interface CustomerDirection {
    id: number;
    departamento: string;
    nombreDepartamento: string;
    municipio: string;
    nombreMunicipio: string;
    complemento: string;
    active: boolean;
  }
  
  export interface Customer {
    id: number;
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
    isActive: boolean;
    esContribuyente: boolean;
    direccion: CustomerDirection;
    direccionId: number;
    tipoContribuyente: string;
    branchId: number
    transmitterId: number;
  }
  export interface IGetCustomers {
    ok: boolean;
    customers: Customer[];
  }
  export interface IGetCustomerPagination {
    ok: boolean;
    customers: Customer[];
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
  }
  
  export interface PayloadCustomer {
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
    esContribuyente?: number;
    transmitterId?: number;
    tipoContribuyente: string
  }
  
  export interface PayloadCustomers {
    id? : number,
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
    tipoContribuyente?: string;
    esContribuyente?: number;
    transmitterId?: number;
     direccion? : CustomerDirection
    municipio?: string;
    nombreMunicipio?: string;
    departamento?: string;
    nombreDepartamento?: string;
    complemento?: string;
  }
  
  
  export interface CustomerDirection {
    municipio: string;
    nombreMunicipio: string;
    departamento: string;
    nombreDepartamento: string;
    complemento: string;
  }
  
  export interface IGetCustomerById {
    ok: true;
    status: number;
    customer: Customer;
  }