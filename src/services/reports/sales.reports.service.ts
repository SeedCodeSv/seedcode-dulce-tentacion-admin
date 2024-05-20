import axios from "axios"
import { API_URL } from "../../utils/constants"
import { IGetSalesByBranchOfCurrentMonth } from "../../types/reports/sales.reports.types"

export const get_sales_by_branch_and_current_month = (id: number) => {
    return axios.get<IGetSalesByBranchOfCurrentMonth>(API_URL + `/reports/sales-by-branch/${id}`)
}