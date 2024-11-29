import { IGetAnnexesCcf } from "@/store/types/iva-ccfe.types";
import { API_URL } from "@/utils/constants"
import axios from "axios"

export const get_annexes_iva_ccfe = async (id: number, startDate: string, endDate: string) => {
    return axios.get<IGetAnnexesCcf>(API_URL + `/reports/annexes-ccfe/${id}?startDate=${startDate}&endDate=${endDate}`);
}