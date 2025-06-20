export interface SalesByDay {
	day: number;
	firstCorrelative: string;
	lastCorrelative: string;
	firstNumeroControl: string;
	lastNumeroControl: string;
	firstSelloRecibido: string;
	lastSelloRecibido: string;
	totalGravado: number
	totalExenta: number
	totalNoSuj: number
}

// export interface SalesByDay {
// 	typeVoucher: string;
// 	code: string;
// 	resolution: string;
// 	sales: Sale[];
// }

export interface IGetFeMonth {
	ok: boolean;
	salesByDay: SalesByDay[];
	status: number;
}