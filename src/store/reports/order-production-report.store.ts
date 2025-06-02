import { create } from 'zustand';

import { ProductionOrderReportStore } from './types/order-production-report.store.types';

import { initialPagination } from '@/utils/utils';
import { get_production_orders_report, get_production_orders_report_detailed } from '@/services/reports/order-production-report.service';
import { Status } from '@/types/reports/order-production-report';

export const useOrderProductionReportStore = create<ProductionOrderReportStore>((set) => ({
  production_orders_report: [],
  po_report_detailed: [],
  statusTotals: {} as Status,
  pagination_production_orders_report: initialPagination,
  loading_report: false,
  getProductionsOrdersReport(
    page,
    limit,
    startDate,
    endDate,
    branchId,
    productName,
    status,
    employeeId,
  ) {
    set({ loading_report: true });
    get_production_orders_report(
      page,
      limit,
      startDate,
      endDate,
      branchId,
      productName,
      status,
      employeeId,
    )
      .then(({data}) => {
        set({
          production_orders_report: data.production_orders_report,
          statusTotals: data.statusTotals,
          pagination_production_orders_report: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
            status: data.status,
            ok: data.ok,
          },
          loading_report: false,
        });
      })
      .catch(() => {
        set({
          production_orders_report: [],
          statusTotals: {} as Status,
          pagination_production_orders_report: initialPagination,
          loading_report: false,
        });
      });
  },
   getP_OrdersReportDetailed(
    page,
    limit,
    startDate,
    endDate,
    branchId,
    productName,
    status,
    employeeId,
  ) {
    set({ loading_report: true });
    get_production_orders_report_detailed(
      page,
      limit,
      startDate,
      endDate,
      branchId,
      productName,
      status,
      employeeId,
    )
      .then(({data}) => {
        set({
          po_report_detailed: data.report,
          loading_report: false,
        });
      })
      .catch(() => {
        set({
          po_report_detailed: [],
          loading_report: false,
        });
      });
  },
}));
