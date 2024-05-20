export interface SaleBranchMonth {
	branch: string;
	total: number;
}

export interface IGetSalesByBranchOfCurrentMonth {
	ok: boolean;
	sales: SaleBranchMonth[];
}