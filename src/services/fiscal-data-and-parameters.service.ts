import { FiscalDataAndParameterPayload, GetFiscalDataAndParameter } from "@/types/fiscal-data-and-parameters.types"
import { API_URL } from "@/utils/constants"
import axios from "axios"

export const get_fiscal_data_and_parameters = (transId: number) => {
    return axios.get<GetFiscalDataAndParameter>(API_URL + '/fiscal-data-and-parameters/transmitter/' + transId)
}

export const create_fiscal_data_and_parameters = (fiscalDataAndParameter: FiscalDataAndParameterPayload) => {
    return axios.post<{ ok: boolean, status: number, message: string }>(API_URL + '/fiscal-data-and-parameters', fiscalDataAndParameter)
}

export const update_fiscal_data_and_parameters = (id: number, fiscalDataAndParameter: FiscalDataAndParameterPayload) => {
    return axios.patch<{ ok: boolean, status: number, message: string }>(API_URL + '/fiscal-data-and-parameters/' + id, fiscalDataAndParameter)
}