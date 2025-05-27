export interface Transmitter {
  id: number;
  clavePrivada: string;
  clavePublica: string;
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
  active: boolean;
  direccionId: number;
}

export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
  showSale: boolean;
  transmitter: Transmitter;
  transmitterId: number;
}

export interface GetListCategories {
  ok: boolean;
  message: string;
  categoryProducts: CategoryProduct[];
}

export interface IGetCategoriesPaginated {
  ok: boolean;
  categoryProducts: CategoryProduct[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface IGetCategories {
  ok: boolean;
  message: string;
  categoryProducts: CategoryProduct[];
}

//Listado sin paginar
export interface IGetCategoriesList {
  ok: boolean;
  message: string;
  categoryProducts: CategoryProductList[];
}

export interface CategoryProductList {
  id: number;
  name: string;
  isActive: boolean;
}
