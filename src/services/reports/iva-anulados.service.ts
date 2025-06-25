import axios from "axios"

import { API_URL } from "@/utils/constants"
import { IGetIvaAnulated } from "@/store/types/iva-anulados.types"

export const get_annexes_iva_anulated = (branchId: number, month: string, year: number) => {
    return axios.get<IGetIvaAnulated>(API_URL + `/reports/annexes-anulados/${branchId}?month=${month}&year=${year}`)
}