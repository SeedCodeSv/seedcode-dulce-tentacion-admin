import { create } from 'zustand';

import { IReportBranchStore } from '../../types/reports/reportByBrachTypes/reportByBranch.types';
import {
  get_report_expense_by_branch,
  sales_by_dates_branch,
} from '../../services/report_by_branch.service';
export const useReportsByBranch = create<IReportBranchStore>((set) => ({
  expenses: [],
  sales: [],
  OnGetReportExpenseByBranch: (id, startDate, endDate) => {
    get_report_expense_by_branch(id, startDate, endDate).then(({ data }) => {
      set({
        expenses: data.expenses,
      });
    });
  },
  OnGetReportByBranchSales: (id, startDate, endDate) => {
    sales_by_dates_branch(id, startDate, endDate).then(({ data }) => {
      set({
        sales: data.sales,
      });
    });
  },
}));
