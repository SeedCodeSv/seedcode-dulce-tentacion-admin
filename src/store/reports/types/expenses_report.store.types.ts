import { ExpenseByBranch } from "../../../types/reports/expenses.reports.types";

export interface IExpensesReportStore {
    expenses_branch_month: ExpenseByBranch[],
    expenses_by_day:number,
    getExpensesByDay: (id: number) => void
    getExpensesBranchMonth: (id: number) => void
}