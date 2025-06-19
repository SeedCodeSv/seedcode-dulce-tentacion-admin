
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
  esContribuyente?: number | boolean;
  direccion: CustomerDirection;
  direccionId: number;
  branch?: Branch;
  branchId: number;
}

export interface Branch {
  id: number;
  name: string;
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
  telefono?: string | number;
  correo?: string;
  esContribuyente?: number;
  transmitterId?: number;
  direccionId?: number;
  municipio?: string;
  nombreMunicipio?: string;
  departamento?: string;
  nombreDepartamento?: string;
  complemento?: string;
  branchId?: number;
}

 export interface IGetCustomerById {
    ok: true;
    status: number;
    customer: Customer;
  }

  export interface IGetCustomerInfo {
  ok: true
  status: number
  customer: CustomerInfo
}

export interface CustomerInfo {
  id: number,
  nombre: string,
  correo: string
}
