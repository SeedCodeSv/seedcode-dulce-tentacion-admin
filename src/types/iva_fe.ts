export interface Sale {
	day: number;
	firstCorrelativ: string;
	lastCorrelative: string;
	firstNumeroControl: string;
	lastNumeroControl: string;
	totalSales: number;
}

export interface SalesByDay {
	typeVoucher: string;
	code: string;
	resolution: string;
	sales: Sale[];
}

export interface IGetFeMonth {
	ok: boolean;
	salesByDay: SalesByDay[];
	status: number;
}