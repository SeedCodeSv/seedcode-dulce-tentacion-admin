import { BranchProduct } from "./branch_products.types";
import { IPagination } from "./global.types";
import { Sale } from "./sales.types";

export interface GetTicketsResponse extends IPagination {
	sales: Sale[];
	totalSales: number;
}

export interface DetailSale {
	id: number;
	montoDescu: string;
	ventaNoSuj: string;
	ventaExenta: string;
	ventaGravada: string;
	totalItem: string;
	cantidadItem: number;
	isActive: boolean;
	branchProduct: BranchProduct;
	sale: Sale;
	saleId: number;
	branchProductId: number;
}

export interface GetDetailTicket {
	ok: boolean;
	status: number;
	message: string;
	detailSale: DetailSale[];
}