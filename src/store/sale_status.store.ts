import { create } from "zustand";
import { ISaleStatusStore } from "./types/sale_status.store.types";
import { get_sales_status } from "../services/sales_status.service";
import { toast } from "sonner";

export const useSaleStatusStore = create<ISaleStatusStore>((set) => ({
  saleStatus: [],

  OnGetSaleStatusList: async () => {
    get_sales_status().then((res) => {
      set({ saleStatus: res.data.saleStatus })
    }).catch(() => {
      set({ saleStatus: [] })
      toast.error("Error al cargar los estados de venta")
    })
  }
}))