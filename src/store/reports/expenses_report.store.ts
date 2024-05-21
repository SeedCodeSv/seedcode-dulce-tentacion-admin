import { create } from "zustand";
import { IExpensesReportStore } from "./types/expenses_report.store.types";
import { get_expenses_by_branch_month, get_expenses_by_day } from "../../services/reports/expenses_report.service";

export const useReportExpensesStore = create<IExpensesReportStore>((set) => ({
    expenses_branch_month: [],
    expenses_by_day: 0,
    getExpensesByDay(id) {
        get_expenses_by_day(id).then(({ data }) => {
            set({ expenses_by_day: data.expenses })
        }).catch(() => {
            set({ expenses_by_day: 0 })
        })
    },
    getExpensesBranchMonth(id) {
        get_expenses_by_branch_month(id).then(({ data }) => {
            set({ expenses_branch_month: data.expenses })
        }).catch(() => {
            set({ expenses_branch_month: [] })
        })
    },
}))