import { FiscalDataAndParameter, FiscalDataAndParameterPayload } from "@/types/fiscal-data-and-parameters.types";

export interface FiscalDataAndParameterStore {
    fiscalDataAndParameter:FiscalDataAndParameter | undefined
    getFiscalDataAndParameter: (transId: number) => void,
    onCreateFiscalDataAndParameter: (fiscalDataAndParameter: FiscalDataAndParameterPayload) => void,
    onUpdateFiscalDataAndParameter: (id: number, fiscalDataAndParameter: FiscalDataAndParameterPayload) => void
}