import { create } from "zustand";
import { IContingenciaStore } from "./types/contingencia_store.types";
import { Venta } from "../entities/venta";
import { add_venta } from "../services/venta.service";

export const useContingenciaStore = create<IContingenciaStore>(() => ({
    createContingencia: async (DteJson) => {
        const venta: Venta = {
            fecha: DteJson.dteJson.identificacion.fecEmi,
            total: Number(DteJson.dteJson.resumen.totalPagar),
            codigoGeneracion: DteJson.dteJson.identificacion.codigoGeneracion
        }

        const result = await add_venta(venta);

        console.log(result)
    }
}))