import { IGetAnnexesIva } from "@/store/types/iva-fe.types"
import { API_URL } from "@/utils/constants"
import axios from "axios"

export const get_annexes_iva = async (branchId: number, startDate: string, endDate: string) => {
    return axios.get<IGetAnnexesIva>(API_URL + `/reports/annexes-fe/${branchId}?startDate=${startDate}&endDate=${endDate}`)
}