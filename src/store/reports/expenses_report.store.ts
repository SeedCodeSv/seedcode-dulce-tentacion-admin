import { create } from 'zustand';
import { IExpensesReportStore } from './types/expenses_report.store.types';
import {
  get_expenses_by_branch,
  get_expenses_by_branch_month,
  get_expenses_by_day,
} from '../../services/reports/expenses_report.service';

export const useReportExpensesStore = create<IExpensesReportStore>((set) => ({
  expenses_branch_month: [],
  data: [],
  expenses_by_day: 0,
  loading_expenses_branchMonth: false,
  getExpensesByDay(id) {
    get_expenses_by_day(id)
      .then(({ data }) => {
        set({ expenses_by_day: data.expenses });
      })
      .catch(() => {
        set({ expenses_by_day: 0 });
      });
  },
  getExpensesByTransmitter: (id, startDate: string, endDate: string) => {
    get_expenses_by_branch(id, startDate, endDate)
      .then((res) => {
        set({ data: res.data.data });
      })
      .catch(() => {
        set({ data: [] });
      });
  },
  getExpensesBranchMonth(id) {
    set({ loading_expenses_branchMonth: true });
    get_expenses_by_branch_month(id)
      .then(({ data }) => {
        set({ expenses_branch_month: data.expenses, loading_expenses_branchMonth: false });
      })
      .catch(() => {
        set({ expenses_branch_month: [], loading_expenses_branchMonth: false });
      });
  },
}));
