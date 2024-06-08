import { SaleDetails } from "../../types/sales.types";

export interface salesStore {
  postSales: (
    pdf: string,
    dte: string,
    cajaId: number,
    codigoEmpleado: string,
    sello: string
  ) => void;
  sale_details: SaleDetails | undefined,
  getSaleDetails: (id:number) => void
}
