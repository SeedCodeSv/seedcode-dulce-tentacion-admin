import { Annulations, IGetInnvalidations } from "@/types/Innvalidations.types";
import { API_URL } from "@/utils/constants";
import axios from "axios";

export const annulations = (payload: Annulations) => {
    return axios.post<{ ok: boolean, message: string }>(API_URL + '/innvalidations', payload)
}


export const get_list_invalidations = (page: number, limit: number, startDate: string, endDate: string, typeDte: string) => {
    return axios.get<IGetInnvalidations>(`${API_URL}/innvalidations?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`)
}