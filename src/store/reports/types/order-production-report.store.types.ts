import { IPagination } from '@/types/global.types';
import { ProductionOrderDetailsVerify } from '@/types/production-order.types';
import { Status } from '@/types/reports/order-production-report';


export interface ProductionOrderReportStore {
  production_orders_report: ProductionOrderDetailsVerify[];
  pagination_production_orders_report: IPagination;
  loading_report: boolean;
  statusTotals: Status;
  getProductionsOrdersReport: (
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
    branchId: number,
    productName: string,
    status: string,
    employeeId: number,
  ) => void;
}
