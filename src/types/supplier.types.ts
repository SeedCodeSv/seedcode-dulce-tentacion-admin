export interface SupplierDirection {
    id: number;
    departamento: string;
    nombreDepartamento: string;
    municipio: string;
    nombreMunicipio: string;
    complemento: string;
    active: boolean;
  }
  
  export interface Supplier {
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
    direccion: SupplierDirection;
    direccionId: number;
  }
  export interface IGetSuppliers {
    ok: boolean;
    Suppliers: Supplier[];
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
  }
  
  export interface SupplierDirection {
    municipio: string;
    nombreMunicipio: string;
    departamento: string;
    nombreDepartamento: string;
    complemento: string;
  }
  