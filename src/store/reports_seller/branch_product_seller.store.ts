import { create } from "zustand";

import { get_most_selled_product } from "../../services/reports/branch_product.report.service";
import { IBranchProductReportStore } from "./types_seller/branch_product_report_seller.store.types";

export const useBranchProductReportStore = create<IBranchProductReportStore>(
  (set) => ({
    most_product_selled: [],
    getMostProductMostSelled(id) {
      get_most_selled_product(id)
        .then(({ data }) => {
          set({ most_product_selled: data.products });
        })
        .catch(() => {
          set({ most_product_selled: [] });
        });
    },
  })
);
