import { ExpenseByBranch, IDataExpensesGrafic } from '../../../types/reports/expenses.reports.types';

export interface IExpensesReportStore {
  expenses_branch_month: ExpenseByBranch[];
  expenses_by_day: number;
  data: IDataExpensesGrafic[];
  getExpensesByDay: (id: number) => void;
  getExpensesByTransmitter: (id: number, startDate: string, endDate: string) => void;
  getExpensesBranchMonth: (id: number) => void;
}
