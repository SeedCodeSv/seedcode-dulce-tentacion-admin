import axios from "axios"
import { IGetExpensesByBranch, IGetExpensesByDay } from "../../types/reports/expenses.reports.types"
import { API_URL } from "../../utils/constants"

export const get_expenses_by_branch_month = (id:number) => {
    return axios.get<IGetExpensesByBranch>(API_URL + `/reports/expenses-by-branch/${id}`)
}

export const get_expenses_by_day = (id:number) => {
    return axios.get<IGetExpensesByDay>(API_URL + `/reports/expenses-by-day/${id}`)
}