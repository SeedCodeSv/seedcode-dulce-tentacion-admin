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
  esContribuyente?: number;
  direccion: CustomerDirection;
  direccionId: number;
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
  direccionId?: number;
  CustomerDirection?: CustomerDirection;
  branchId?: number;
}

export interface CustomerDirection {
  municipio: string;
  nombreMunicipio: string;
  departamento: string;
  nombreDepartamento: string;
  complemento: string;
}
