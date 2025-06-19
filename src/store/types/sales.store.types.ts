import { ISale_JSON_Debito, ISaleByItem, Sale, SaleContingence, SaleDates, SaleDetails } from '../../types/sales.types';

import { FacturacionCcfe, SalesCcf } from '@/types/sales_cff.types';
import { SalesByDay } from '@/types/iva_fe';
import { IPagination } from '@/types/global.types';
import { SVFC_CF_Firmado } from '@/types/svf_dte/cf.types';

export interface salesStore {
  facturas_by_month: SalesByDay[];
  loading_facturas: boolean;
  creditos_by_month: SalesCcf[];
  facturacion_ccfe: FacturacionCcfe[];
  factura_totals: number;
  loading_sale: boolean;
  json_sale: ISale_JSON_Debito | undefined;
  json_sale_copy: SVFC_CF_Firmado | undefined;
  sales_dates: SaleDates[];
  sales_dates_pagination: IPagination;
  loading_creditos: boolean;
  contingence_sales: SaleContingence[];
  saleByItem: ISaleByItem[],
  loadingSalesByItem: boolean,
  recentSales: Sale[]
  getSaleByItem: (transId: number, startDate: string, endDate: string, branches: number[] | undefined) => void;
  getFeMonth: (branchId: number, month: number, year: number) => void;
  getCffMonth: (branchId: number, month: string, year: number) => void;
  postSales: (
    pdf: string,
    dte: string,
    cajaId: number,
    codigoEmpleado: string,
    sello: string
  ) => void;
  sale_details: SaleDetails | undefined;
  getSaleDetails: (id: number) => void;
  updateSaleDetails: (data: ISale_JSON_Debito) => void;
  getSalesByDatesAndStatus: (
    page: number,
    limit: number,
    branchId: number,
    startDate: string,
    endDate: string,
    state: string,
    typeVoucher: string,
    pointOfSale: string
  ) => void;
  getNotesOfSale: (id: number) => Promise<{ debits: number; credits: number }>;
  getJsonSale: (path: string) => void;
  getSalesInContingence: (id: number) => void;
  getRecentSales: (id: number) => Promise<void>

}
