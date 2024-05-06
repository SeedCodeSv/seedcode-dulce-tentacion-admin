import { create } from "zustand";
import { IBoxStore } from "./types/Boxes.store.types";
// import { messages } from "../utils/constants";
// import { toast } from "sonner";
import { get_boxes_List } from "../services/Boxes.service";
export const useBoxStore = create<IBoxStore>((set) => ({
  box_list: [],

  getBoxList() {
    get_boxes_List()
      .then(({ data }) => {
        set((state) => ({ ...state, box_list: data.boxes }));
      })
      .catch(() => {
        set((state) => ({ ...state, box_list: [] }));
      });
  },
}));
