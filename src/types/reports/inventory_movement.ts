export interface IResponseDataInventoryMovement {
  inventoryMoments?: InventoryMoment[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
}

export interface InventoryMoment {
  id: number;
  typeOfMovement: string;
  typeOfInventory: string;
  quantity: number;
  reference: number;
  totalMovement: string;
  date: string;
  time: string;
  isActive: boolean;
  branchProduct: BranchProduct;
  branchProductId: number;
}

export interface BranchProduct {
  id: number;
  stock: number;
  price: string;
  priceA: string;
  priceB: string;
  priceC: string;
  minimumStock: number;
  costoUnitario: string;
  isActive: boolean;
  product: Product;
  branch: Branch;
  branchId: number;
  productId: number;
  supplierId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  tipoItem: string;
  tipoDeItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  code: string;
  isActive: boolean;
  subCategoryProductId: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  codEstableMH: string;
  codEstable: string;
  tipoEstablecimiento: string;
  isActive: boolean;
  location: boolean;
  transmitter: Transmitter;
  transmitterId: number;
}

export interface Transmitter {
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
  tipoContribuyente: string;
  active: boolean;
  direccionId: number;
}

export interface IResponseDataInventoryMovementGraphic {
  typeOfMovement: string;
  date: string;
  quantity: string;
  totalMovement: string;
}
export interface IResponseInventaryMovement {
  ok: boolean;
  inventoyMovement: IResponseDataInventoryMovementGraphic[];
  totalEntry: number;
  totalExit: number;
  status: number;
}

export interface IInventoryMovementStore {
  totalEntry: number;
  totalExit: number;
  inventoyMovement: IResponseDataInventoryMovementGraphic[];
  pagination_inventory_movement: IResponseDataInventoryMovement;
  inventoryMoments: InventoryMoment[];
  OnGetInventoryMovement: (
    id: number,
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    branch: string,
    typeOfInventory: string,
    typeOfMovement: string
  ) => void;
  OnGetGraphicInventoryMovement: (
    id: number,
    startDate: string,
    endDate: string,
    branch: string
  ) => void;
}
