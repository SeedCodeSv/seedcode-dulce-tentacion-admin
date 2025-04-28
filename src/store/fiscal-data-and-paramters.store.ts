import { create } from "zustand";
import { toast } from "sonner";

import { FiscalDataAndParameterStore } from "./types/fiscal-data-and-parameters.types";

import { create_fiscal_data_and_parameters, get_fiscal_data_and_parameters, update_fiscal_data_and_parameters } from "@/services/fiscal-data-and-parameters.service";

export const useFiscalDataAndParameterStore = create<FiscalDataAndParameterStore>((set) => ({
    fiscalDataAndParameter: undefined,
    getFiscalDataAndParameter(transId) {
        get_fiscal_data_and_parameters(transId).then((res) => {
            set({
                fiscalDataAndParameter: res.data.fiscalDataAndParameter
            })
        }).catch(() => {
            set({
                fiscalDataAndParameter: undefined
            })
        })
    },
    onCreateFiscalDataAndParameter(fiscalDataAndParameter) {
        create_fiscal_data_and_parameters(fiscalDataAndParameter).then((res) => {
            if (res.data.ok) {
                toast.success("Datos fiscales creados");
            } else {
                toast.error("Error al crear datos fiscales")
            }
        }).catch(() => {
            toast.error("Error al crear datos fiscales")
        })
    },
    onUpdateFiscalDataAndParameter(id, fiscalDataAndParameter) {
        update_fiscal_data_and_parameters(id, fiscalDataAndParameter).then((res) => {
            if (res.data.ok) {
                toast.success("Datos fiscales actualizados");
            } else {
                toast.error("Error al actualizar datos fiscales")
            }
        }).catch(() => {
            toast.error("Error al actualizar datos fiscales")
        })
    },
}))