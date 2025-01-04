import { IGetAnnexesCcf } from "@/store/types/iva-ccfe.types";
import { API_URL } from "@/utils/constants"
import axios from "axios"

export const get_annexes_iva_ccfe = (id: number, month: string, year: number) => {
    return axios.get<IGetAnnexesCcf>(API_URL + `/reports/annexes-ccfe/${id}?month=${month}&year=${year}`);
}