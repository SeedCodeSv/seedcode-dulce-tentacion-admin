export interface IGetPointOfSales {
    ok: boolean;
    pointOfSales: PointOfSale[];
    status: number;
  }
  
  export interface PointOfSale {
    id: number;
    code: string;
    typeVoucher: string;
    resolution: string;
    serie: string;
    from: string;
    to: string;
    prev: number;
    next: number;
    codPuntoVentaMH: string;
    codPuntoVenta: string;
    isActive: boolean;
    branchId: number;
  }
  
  export interface PointOfSalePayload {
    code: string;
    codPuntoVenta: string;
    branchId: number;
    userName: string;
    password: string;
  }
  
  
  
  
  export interface IGetPointOfSalePaginated {
    ok: boolean
    correlatives: Correla[]
    total: number
    totalPag: number
    currentPag: number
    nextPag: number
    prevPag: number
    status: number
  }
  
  export interface Correla {
    id: number
    code: string
    typeVoucher: string
    description: string
    resolution: string
    serie: string
    from: string
    to: string
    prev: number
    next: number
    codPuntoVentaMH: any
    codPuntoVenta: string
    isActive: boolean
    branch: Branch
    branchId: number
  }
  
  export interface Branch {
    id: number
    name: string
    address: string
    phone: string
    codEstableMH: string
    codEstable: string
    tipoEstablecimiento: string
    isActive: boolean
    transmitterId: number
  }
  

  export interface BranchPointOfSale {
    id: number;
    code: string;
    typeVoucher: string;
    description: string;
    resolution: string;
    serie: string;
    from: string;
    to: string;
    prev: number;
    next: number;
    codPuntoVentaMH: string;
    codPuntoVenta: string;
    isActive: boolean;
    branchId: number;
  }
  
  
  
  
  
  