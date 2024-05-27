import axios from "axios";
import { PayloadSupplier } from "../types/supplier.types";
import { API_URL } from "../utils/constants";

export const add_supplier = (payload: PayloadSupplier) => {
    return axios.post<{ ok: boolean }>(API_URL + "/suppliers", payload)
}