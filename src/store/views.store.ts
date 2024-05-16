import { ViewsStore } from "./types/views.store.types";
import { create } from "zustand";
import { get_views } from "../services/views.service";
import { views_enabled } from "../utils/constants";
export const useViewsStore = create<ViewsStore>((set) => ({
  views_list: [],
  found: [],
  getViews() {
    get_views()
      .then(({ data }) => {
        const enabled = views_enabled.filter((route) => {
          return !(data.views.map((route) => route.name).includes(route))
        })
        set((state) => ({
          ...state,
          views_list: data.views,
          founds: enabled
        }))
    })
    .catch(() => {
      set((state) => ({
        ...state,
        views: [],
      }))
    })
  },
}));
