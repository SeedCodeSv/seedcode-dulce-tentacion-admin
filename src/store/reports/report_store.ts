import { create } from 'zustand';
import { IReportBranchStore } from '../../types/reports/reportByBrachTypes/reportByBranch.types';

export const useReportsByBranch = create<IReportBranchStore>((set) => ({
  expenses: [],
  sales: [],
  OnGetReportByBranchSales: () => 
    {},
  OnGetReportExpenseByBranch: () => {},
}));
