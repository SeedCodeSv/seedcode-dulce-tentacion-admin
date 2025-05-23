import axios from "axios"

import { API_URL } from "@/utils/constants"
import { IResponseMenu } from "@/types/menu.types"


export const get_menu_by_branchProduct = async (id: number, branchId: number) => {
    return axios.get<IResponseMenu>(`${API_URL}/menu/details/${id}?branchId=${branchId}`)
}


export const update_menu_details = async (id: number, branchId: number, payload: any) => {
    return axios.patch<{ ok: boolean, message: string }>(`${API_URL}/menu/${id}/${branchId}`, payload)
}

export const delete_menu = async (id: number, branchProductId: number) => {
    return axios.delete<{ ok: boolean, message: string }>(`${API_URL}/menu/${id}/${branchProductId}`)
}