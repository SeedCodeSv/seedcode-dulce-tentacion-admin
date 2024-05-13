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