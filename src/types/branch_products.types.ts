export interface CategoryProduct {
  id: number;
  name: string;
  isActive: boolean;
  transmitterId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  code: string;
  isActive: boolean;
  categoryProduct: CategoryProduct;
  categoryProductId: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  transmitterId: number;
}

export interface BranchProduct {
  id: number;
  stock: number;
  price: string;
  isActive: boolean;
  product: Product;
  branch: Branch;
  branchId: number;
  productId: number;
}

export interface IGetBranchProductPaginated {
  ok: boolean;
  branchProducts: BranchProduct[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}

export interface ICartProduct extends BranchProduct {
  quantity: number;
  discount: number;
  percentage: number;
  total: number;
  base_price: number;
}

export interface IGetBranchProductByCode {
  ok: boolean;
  message: string;
  product: BranchProduct;
}


export interface CategoryProduct {
	id: number;
	name: string;
	isActive: boolean;
	transmitterId: number;
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
	categoryProduct: CategoryProduct;
	categoryProductId: number;
}

export interface Branch {
	id: number;
	name: string;
	address: string;
	phone: string;
	isActive: boolean;
	transmitterId: number;
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
	direccionId: number;
	transmitterId: number;
}

export interface IBranchProductOrder {
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
	supplier: Supplier;
	branchId: number;
	productId: number;
	supplierId: number;
}

export interface IBranchProductOrderQuantity extends IBranchProductOrder {
	quantity: number;
}

export interface IGetBranchProductOrder {
	ok: boolean;
	message: string;
	branchProducts: IBranchProductOrder[];
}