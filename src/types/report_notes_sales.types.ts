import { Sale } from "./sales.types";

  export interface IGetNotaCredito extends Sale {
    sale: Sale;
    saleId: number;
  }

  export interface IResponseIGetNotasCreditos {
    notasCreditos: IGetNotaCredito[];
  }
  export interface IResponseIGetNotasDebitos {
    notasDebitos: IGetNotaCredito[];
  }

export interface IReportNoteSalesStore {
    sales: Sale[]
    notasCreditos: IGetNotaCredito[];
    notasDebitos: IGetNotaCredito[];
    OnGetNotasCreditos: (id: number) => void;
    OnGetNotasDebitos: (id: number) => void;
}

