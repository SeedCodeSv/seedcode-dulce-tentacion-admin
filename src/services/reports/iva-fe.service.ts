import { IGetAnnexesIva } from "@/store/types/iva-fe.types"
import { API_URL } from "@/utils/constants"
import axios from "axios"

export const get_annexes_iva = (branchId: number, month: string, year: number) => {
    return axios.get<IGetAnnexesIva>(API_URL + `/reports/annexes-fe/${branchId}?month=${month}&year=${year}`)
}