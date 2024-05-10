import { ViewsStore } from "./types/views.store.types";
import { create } from "zustand";
import { get_views } from "../services/views.service";
export const useViewsStore = create<ViewsStore>((set) => ({
  views_list: [],

  getViews() {
    get_views().then(({ data }) => {
      set((state) => ({ ...state, views_list: data.views }));
    });
  },
}));
