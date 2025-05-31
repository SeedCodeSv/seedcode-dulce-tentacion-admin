import { IPagination } from "../global.types";
import { ProductionOrderDetailsVerify } from "../production-order.types";

export interface GetProductionOrderReport extends IPagination {
  ok: boolean;
  production_orders_report: ProductionOrderDetailsVerify[];
  statusTotals: Status
  status: number;
}

export interface Status {
  open: number,
  inProgress: number,
  completed: number,
  canceled: number,
};