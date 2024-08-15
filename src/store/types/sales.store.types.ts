import { SalesCcf } from "@/types/sales_cff.types";
import { SaleDetails } from "../../types/sales.types";
import { FEMonth } from "@/types/factura.types";

export interface salesStore {
  facturas_by_month: FEMonth[]
  loading_facturas: boolean
  creditos_by_month: SalesCcf[]
  factura_totals: number,
  loading_creditos: boolean,
  getFeMonth: (branchId: number, month: number) => void
  getCffMonth: (branchId: number, month: string) => void
  postSales: (
    pdf: string,
    dte: string,
    cajaId: number,
    codigoEmpleado: string,
    sello: string
  ) => void;
  sale_details: SaleDetails | undefined,
  getSaleDetails: (id:number) => void
  updateSaleDetails: (data:SaleDetails) => void
}
