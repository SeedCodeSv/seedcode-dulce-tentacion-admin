import { get_notas_creditos_by_sale, get_notas_debitos_by_sale } from "@/services/report_notes_sales.service";
import { IReportNoteSalesStore } from "@/types/report_notes_sales.types";
import { create } from "zustand";

export const useReportNoteSalesStore = create<IReportNoteSalesStore>((set) => ({
    sales: [],
    notasCreditos: [],
    notasDebitos: [],
    OnGetNotasCreditos: (id: number) => {
        get_notas_creditos_by_sale(id).then((response) => {
            set({
              notasCreditos: response.data.notasCreditos,
            });
          });
    },
    
    OnGetNotasDebitos: (id: number) => {
        get_notas_debitos_by_sale(id).then((response) => {
            set({
              notasDebitos: response.data.notasDebitos,
            });
          });
    }
}))