import axios from "axios";

import { GetProductionOrderReport, IGetReportOPDetailed } from "@/types/reports/order-production-report";

export const get_production_orders_report = (
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  branchId: number = 0,
  productName: string = '',
  status: string = '',
  employeeId: number = 0,
) => {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('branch', branchId.toString());
  params.append('productName', productName);
  params.append('status', status);
  params.append('employeeId', employeeId.toString());

  return axios.get<GetProductionOrderReport>(import.meta.env.VITE_API_URL + `/reports/orders-production-report?${params.toString()}`);
};

export const get_production_orders_report_detailed = (
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  branchId: number = 0,
  productName: string = '',
  status: string = '',
  employeeId: number = 0,
) => {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('branch', branchId.toString());
  params.append('productName', productName);
  params.append('status', status);
  params.append('employeeId', employeeId.toString());

  return axios.get<IGetReportOPDetailed>(import.meta.env.VITE_API_URL + `/reports/orders-production-report-by-branch-product?${params.toString()}`);
};