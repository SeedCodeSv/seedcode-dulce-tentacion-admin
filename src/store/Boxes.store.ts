import { create } from 'zustand';
import { IBoxStore } from './types/Boxes.store.types';
import { messages } from '../utils/constants';
import { toast } from 'sonner';
import { get_boxes_List, save_box, close_box_by_id } from '../services/Boxes.service';
import { post_box, get_box, delete_box } from '../storage/localStorage';
export const useBoxStore = create<IBoxStore>((set) => ({
  box_list: [],
  current_box: Number(get_box() ?? 0),
  has_current_box: get_box() !== undefined,
  getBoxList() {
    get_boxes_List()
      .then(({ data }) => {
        set((state) => ({ ...state, box_list: data.boxes }));
      })
      .catch(() => {
        set((state) => ({ ...state, box_list: [] }));
      });
  },
  postBox(box) {
    save_box(box)
      .then(({ data }) => {
        toast.success(messages.success);
        if (data) {
          post_box(data.box.id.toString());
        }
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  OnRemoveBox() {
    delete_box();
    set({ current_box: 0, has_current_box: false });
  },
  closeBox(idBox) {
    close_box_by_id(idBox)
      .then(() => {
        delete_box();
        set({ current_box: 0, has_current_box: false });
        toast.success('Caja cerrada correctamente');
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
}));
