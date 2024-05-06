import { create } from "zustand";
import { ICategoriesExpensesStore } from "./types/categories_expenses.store";
import {
  get_List_categories_expenses,
  get_categories_expenses_paginated,
  save_categories_expenses,
  update_categories_expenses,
  delete_categories_expenses,
} from "../services/categories_expenses.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";

export const useCategoriesExpenses = create<ICategoriesExpensesStore>(
  (set, get) => ({
    paginated_categories_expenses: {
      categoryExpenses: [],
      total: 0,
      totalPag: 0,
      currentPag: 0,
      nextPag: 0,
      prevPag: 0,
      status: 404,
      ok: false,
    },
    list_categories_expenses: [],

    getListCategoriesExpenses() {
      get_List_categories_expenses().then((categories_expenses) =>
        set({
          list_categories_expenses: categories_expenses.data.categoryExpenses,
        })
      );
    },
    getPaginatedCategoriesExpenses(page, limit, name) {
      get_categories_expenses_paginated(page, limit, name)
        .then((categories_expenses) =>
          set({ paginated_categories_expenses: categories_expenses.data })
        )
        .catch(() => {
          set({
            paginated_categories_expenses: {
              categoryExpenses: [],
              total: 0,
              totalPag: 0,
              currentPag: 0,
              nextPag: 0,
              prevPag: 0,
              status: 404,
              ok: false,
            },
          });
        });
    },
    postCategoriesExpenses(payload) {
      save_categories_expenses(payload)
        .then(() => {
          get().getPaginatedCategoriesExpenses(1, 8, "");
          toast.success(messages.success);
        })
        .catch(() => {
          toast.error(messages.error);
        });
    },
    pathCategoriesExpenses(id, payload) {
      update_categories_expenses(id, payload)
        .then(() => {
          get().getPaginatedCategoriesExpenses(1, 8, "");
          toast.success(messages.success);
        })
        .catch(() => {
          toast.error(messages.error);
        });
    },
    deleteCategoriesExpenses: async (id) => {
      return await delete_categories_expenses(id)
        .then(({ data }) => {
          get().getPaginatedCategoriesExpenses(1, 8, "");
          toast.success(messages.success);
          return data.ok;
        })
        .catch(() => {
          toast.warning(messages.error);
          return false;
        });
    },
  })
);
