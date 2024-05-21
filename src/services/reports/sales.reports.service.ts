import axios from "axios"
import { API_URL } from "../../utils/constants"
import { IGetSalesByBranchOfCurrentMonth, IGetSalesByDay, IGetSalesByDayTable, IGetSalesByMonthAndYear } from "../../types/reports/sales.reports.types"

export const get_sales_by_branch_and_current_month = (id: number) => {
    return axios.get<IGetSalesByBranchOfCurrentMonth>(API_URL + `/reports/sales-by-branch/${id}`)
}

export const get_sales_by_month_and_year = (id: number) => {
    return axios.get<IGetSalesByMonthAndYear>(API_URL + `/reports/sum-of-month/${new Date().getFullYear()}/${id}`)
}

export const get_sales_by_day = (id: number) => {
    return axios.get<IGetSalesByDay>(API_URL + `/reports/sales-by-day/${id}`)
}

export const get_sales_by_day_table = (id: number) => {
    return axios.get<IGetSalesByDayTable>(API_URL + `/reports/sales-by-day-table/${id}`)
}