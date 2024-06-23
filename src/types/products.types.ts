export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  code: string;
  costoUnitario: string;
  type: string;
  minimumStock: number;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryProductId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
}

export interface IGetProductsPaginated {
  ok: boolean;
  products: Product[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: string;
  costoUnitario: string;
  code: string;
  categoryProductId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  branch: { id: number }[];
  supplierId: number;
}
export interface ProductList {
  ok: boolean;
  message: string;
  products: Product[];
}

export interface ProductPayloadFormik {
  name: string;
  description: string;
  price: string;
  costoUnitario: string;
  code: string;
  categoryProductId: number;
  tipoDeItem: string;
  tipoItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  branch: string[];
  supplierId: number;
}
export interface IProductCart extends IUnidadProducto {
  quantity: number;
  discount: number;
  percentage: number;
  total: number;
  base_price: number;
}
//---------------------------unit_product---------------------------------------
export interface IProducto {
  id: number;
  nombre: string;
  codigo: string;
  tipoItem: number;
  codigoDeBarra: string;
  unidadDeMedida: number;
  precioUnitario: string;
  precio: string;
  cantidad: number;
  nombreUnidadDeMedida: string;
  active: boolean;
}

export interface IUnidad {
  id: number;
  placa: string;
  codigo: string;
  active: boolean;
  userId: number;
}

export interface IUnidadProducto {
  id: number;
  stock: number;
  price: string;
  isActive: boolean;
  producto: IProducto;
  unidade: IUnidad;
  unidadeId: number;
  productoId: number;
}
export interface IGetUnitProduct {
  id: number;
  price: number;
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    tipoItem: number;
    codigoDeBarra: string;
    unidadDeMedida: number;
    precioUnitario: number;
    precio: number;
    cantidad: number;
    nombreUnidadDeMedida: string;
    active: boolean;
  };
  unidadeId: number;
}
export interface IGetUnitProducts {
  ok: boolean;
  status: number;
  productos: IGetUnitProduct[];
}

export interface IGetProductVehicle {
  productos: IUnidadProducto[];
}

export interface IGetProductByCodeVehicle {
  ok: boolean;
  unidadProducto: IUnidadProducto;
  status: number;
}
