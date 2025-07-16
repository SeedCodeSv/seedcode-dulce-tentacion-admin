import { create } from "zustand";

import { IDetailSalesStore } from "./types/detail-sales.store.types";

import { get_details_sales } from "@/services/detail-sales.service";

export const useDetailsSalesStore = create<IDetailSalesStore>((set) => ({
  detailSales: null,
  loadingSale: false,
  getDetailSales(id) {
    set({ loadingSale: true });
    get_details_sales(id)
      .then(({ data }) => {
        set({ detailSales: data.sale, loadingSale: false });
      })
      .catch(() => {
        set({ detailSales: null, loadingSale: false });
      });
  },
}));
