import { BranchProduct } from "../branch_products.types";
import { Branches } from "../branches.types";
import { Employee } from "../employees.types";
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

export interface IGetReportOPDetailed {
  ok:     boolean;
  report: ReportDetailed[];
  status: number;
}

export interface ReportDetailed {
  branchProductId: number;
  productName:   string;
  branchName:    string;
  totalOrders:   number;
  totalProduced: number;
  totalDamaged:  number;
  pendingQuantity: number;
  totalCost:     number;
  statusTotals:  Status;
  table:         Table[];
}

export interface Table {
  id:                        number;
  statusOrder:               string;
  observations:              string;
  moreInformation:           string;
  date:                      string;
  time:                      string;
  endDate:                   string | null;
  endTime:                   null | string;
  quantity:                  number;
  producedQuantity:          number;
  damagedQuantity:           number;
  damagedReason:             string;
  missingQuantity:           number;
  finalNotes:                string;
  costRawMaterial:           string;
  costDirectLabor:           string;
  costPrime:                 string;
  indirectManufacturingCost: string;
  totalCost:                 string;
  branchProduct:             BranchProduct;
  destinationBranch:         Branches;
  receptionBranch:           Branches;
  employee:                  Employee;
  employeeOrderId:           number;
  receptionBranchId:         number;
  destinationBranchId:       number;
  branchProductId:           number;
}
