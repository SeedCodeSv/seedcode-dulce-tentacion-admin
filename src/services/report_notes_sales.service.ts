import { IResponseIGetNotasCreditos, IResponseIGetNotasDebitos } from "@/types/report_notes_sales.types"
import { API_URL } from "@/utils/constants"
import axios from "axios";

export const get_notas_creditos_by_sale = (id: number) => {
    return axios.get<IResponseIGetNotasCreditos>(API_URL + `/nota-de-credito/by-sale/${id}`);
}

export const get_notas_debitos_by_sale = (id: number) => {
    return axios.get<IResponseIGetNotasDebitos>(API_URL + `/nota-de-debitos/by-sale/${id}`)
}