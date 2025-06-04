import axios from "axios"

import { API_URL } from "@/utils/constants"
import { SalesChartGraphPeriod } from "@/types/reports/sales_by_period.report"
import { ResponseDetailsReport } from "@/components/export-reports/types/sales_by_periods.types"
import { get_user } from "@/storage/localStorage"

export const reports_by_periods = async (id: number) => {
    return axios.get<SalesChartGraphPeriod>(API_URL + '/sales/export-data/' + id)
}

export const reporst_details_sales = async (
    page: number, limit: number,
    startDate: string, endDate: string, paymentType: string,
    branch: string, correlative: string, typeVoucher: string, pointOfSale: string
) => {
    const user = get_user();

     return axios.get<ResponseDetailsReport>(`
        ${API_URL}/sales/get-sales-excel-report/${user?.pointOfSale?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&paymentType=${paymentType}&branch=${branch}&correlative=${correlative}&typeVoucher=${typeVoucher}&pointOfSale=${pointOfSale}`)
}